import RedisClient from "@redis/client/dist/lib/client";
import Agenda, { Job } from "agenda";
import { filter, round } from "lodash";
import moment from "moment";
import mongoose, { ObjectId } from "mongoose";
import nconf from "nconf";
import { RedisClientType } from "redis";
import { MatchRelations } from "../models/MatchRelations";
import { Pair } from "../models/Pair";
import { User, UserDocument } from "../models/User";
import { startBot } from "./discord";
console.log("ping");
import {
	createDate,
	deleteChannels,
	deleteDate,
} from "./discord/createChannel";
import { checkChannel, checkChannels } from "./discord/tests";
import { twoDDiff } from "./helpers";
import { checkUserRelations, compileUserRelations } from "./rpc";
import { compile } from "./stable-roommates/index";
import {
	sendDateChangeInfo,
	sendDateStarted,
	sendUpcomingDate,
	sendDateStarting,
	sendDateEnding
} from "./notification";
import { sendDiscordDateEnded, sendDiscordDateEnding, sendDiscordDateStarting, sendDiscordUpcomingDate } from "./discord/sendMessage";

interface Round {
	startDate: Date;
	endDate: Date;
}

function isolatePairs(pairs) {
	// make one combination of pairs (ab, ba) to (ab)
	const matches: [string, string][] = [];
	const matchBlacklist = [];
	Object.keys(pairs).forEach((i) => {
		Object.values(pairs).forEach((j) => {
			if (!matchBlacklist.includes(i) && !matchBlacklist.includes(j)) {
				// console.log("Accept");
				matchBlacklist.push(j);
				matchBlacklist.push(i);
				matches.push([i, pairs[i]]);
			}
		});
	});
	return matches;
}

function sliceIntoChunks(arr, chunkSize) {
	const res = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	}
	return res;
}

export async function agendaHandler(agenda: Agenda, client1: any) {
	if (process.env.MANUAL_AGENDA) {
		console.warn("Starting Agenda Handler with manual setup");
	} else {
		console.info("Starting Agenda Handler with automatic setup");
	}


	const db = mongoose.connection
	db.once('open', async function () {
		const count = await db.db.collection("agendaJobs").countDocuments({ name: "Sanity Check" })
		if (count == 0) {
			console.warn("no sanity check, generating one")
			agenda.every("30 minutes", "Sanity Check");
		}
	})

	agenda.on("fail", (err, job) => {
		throw err.stack;
	});

	const client = client1 as RedisClientType;
	agenda.define<{ dates: Round[] }>(
		"Init Rounds",
		async (job: Job<{ dates: Round[] }>) => {
			console.log("start");

			nconf.set("plannedDates", job.attrs.data.dates.length);
			job.attrs.data.dates.forEach((d, id) => nconf.set(`dateConf:${id}`, d));
			nconf.save((err) => console.log(err));
		}
	);
	agenda.define<{ round: number }>(
		"Prepare Round",
		async (job: Job<{ round: number }>) => {
			await checkUserRelations();
			const rnd = job.attrs.data.round;
			await client.del(`R${rnd}REJECTED`);
			console.log("start");
			const relations = await MatchRelations.aggregate([
				{
					$unwind: "$partners",
				},
				{
					$sort: {
						"partners.score": 1,
					},
				},
				{
					$group: {
						_id: "$_id",
						user: {
							$first: "$user",
						},
						partners: {
							$push: "$partners",
						},
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							_id: "$_id",
							user: "$user",
							partners: "$partners.user",
						},
					},
				},
			]);
			const compilationobj: { [key: string]: UserDocument[] } =
				Object.fromEntries(relations.map((a) => [a.user, a.partners]));
			const lastPairs = await Pair.find({ round: { $lt: rnd } });

			//pull already paired pairs to the end
			let updatedCompile = {};
			lastPairs.map((a) => {
				let prefs1 = compilationobj[a.user.toString()];
				prefs1 = prefs1.filter(
					(value, index, array) => value.toString() != a.partner.toString()
				);
				prefs1.push(a.partner);
				compilationobj[a.user.toString()] = prefs1;
				let prefs2 = compilationobj[a.partner.toString()];
				prefs2 = prefs2.filter(
					(value, index, array) => value.toString() != a.user.toString()
				);
				prefs2.push(a.user);
				compilationobj[a.partner.toString()] = prefs2;
			});
			const payload = compilationobj; //concatenate rejected users

			const compiled: {
				matches: { [key: string]: string };
				rejected: string[];
			} = await compile(payload as any);

			if (Object.keys(compiled.matches).length == 0) {
				console.warn("CAUTION: SRP generated 0 pairs!");
			}

			const matches = isolatePairs(compiled.matches);

			const multi = client.multi();

			const Dclient = await startBot();
			await sendDiscordUpcomingDate(Dclient);

			await Promise.all(
				matches.map(async (pair) => {
					console.log(pair);
					sendUpcomingDate(await User.findById(pair[0]));
					sendUpcomingDate(await User.findById(pair[1]));
					return Pair.updateOne(
						{ user: pair[0], rejects: false, round: rnd },
						{
							user: pair[0],
							partner: pair[1],
							rejects: false,
							round: rnd,
							ended: false,
						},
						{ upsert: true }
					);
				})
			);

			//the srp rejects array will be cut into pairs
			await Promise.all(
				sliceIntoChunks(compiled.rejected, 2).map(async (pair) => {
					if (pair.length < 2)
						return new Promise((resolve, reject) => {
							multi.rPush(`R${rnd}REJECTED`, pair[0]);
							resolve(undefined);
						});
					sendUpcomingDate(await User.findById(pair[0]));
					sendUpcomingDate(await User.findById(pair[1]));
					return Pair.updateOne(
						{ user: pair[0], rejects: true, round: rnd },
						{
							user: pair[0],
							partner: pair[1],
							rejects: true,
							round: rnd,
							ended: false,
						},
						{ upsert: true }
					);
				})
			);
			await multi.exec();
			if (!process.env.MANUAL_AGENDA) {
				const date = moment(nconf.get(`dateConf:${rnd}`).startDate);
				agenda.schedule(date.toDate(), "Create Round", { round: rnd });
				agenda.schedule(
					date.add(-5, "minutes").toDate(),
					"Notify Pre-Start Round",
					{
						round: rnd,
					}
				);
			}
		}
	);

	agenda.define<{ round: number }>(
		"Sanity Check",
		async (job: Job<{ round: number }>) => {
			await checkUserRelations();
		}
	);
	agenda.define<{ round: number }>(
		"Create Round",
		async (job: Job<{ round: number }>) => {
			const rnd = job.attrs.data.round;
			console.log("start");
			const pairs = await Pair.find({ round: rnd }).populate(
				"user partner",
				"discordID profileInfo"
			);
			const client = await startBot();
			// console.log(pairs);
			console.log("creating Date");
			pairs.forEach((pair) => {
				// console.log(pair);

				sendDateStarted(pair.partner);
				sendDateStarted(pair.user);
			});
			console.log(pairs);

			await createDate(client, pairs);
			if (!process.env.MANUAL_AGENDA) {
				const { startDate, endDate } = nconf.get(`dateConf:${rnd}`);
				const dateS = moment(startDate);
				agenda.schedule(dateS.add(8, "minutes").toDate(), "Check Round Pairs", {
					round: rnd,
				});
				const dateE = moment(endDate);
				agenda.schedule(
					dateE.add(-5, "minutes").toDate(),
					"Notify Pre-Stop Round",
					{
						round: rnd,
					}
				);
				agenda.schedule(dateE.toDate(), "Remove Round", { round: rnd });
			}
		}
	);

	agenda.define<{ round: number }>(
		"Notify Pre-Start Round",
		async (job: Job<{ round: number }>) => {
			const rnd = job.attrs.data.round;
			console.log("start");
			const Dclient = await startBot();
			await sendDiscordDateStarting(Dclient);
			const pairs = await Pair.find({ round: rnd }).populate(
				"user partner",
				"discordID profileInfo"
			);
			pairs.forEach((pair) => {
				sendDateStarting(pair.partner);
				sendDateStarting(pair.user);
			});
		}
	);

	agenda.define<{ round: number }>(
		"Notify Pre-Stop Round",
		async (job: Job<{ round: number }>) => {
			const rnd = job.attrs.data.round;
			console.log("start");
			const Dclient = await startBot();
			await sendDiscordDateEnding(Dclient);
			const pairs = await Pair.find({ round: rnd }).populate(
				"user partner",
				"discordID profileInfo"
			);
			pairs.forEach((pair) => {
				sendDateEnding(pair.partner);
				sendDateEnding(pair.user);
			});
		}
	);

	agenda.define<{ round: number }>(
		"Remove Round",
		async (job: Job<{ round: number }>) => {
			const rnd = job.attrs.data.round;
			console.log("start");
			const Dclient = await startBot();
			await sendDiscordDateEnded(Dclient);
			await deleteDate(rnd);
		}
	);
	agenda.define<{ round: number }>(
		"Check Round Pairs",
		async (job: Job<{ round: number }>) => {
			const rnd = job.attrs.data.round;
			await client.del(`R${rnd}ABSENT`);
			await client.del(`R${rnd}LEFT`);
			const pairs = await Pair.find({ round: rnd }).populate(
				"user partner",
				"discordID"
			);
			const formattedPairs = pairs.map((pair) => [
				pair.partner.discordID,
				pair.user.discordID,
			]);
			const discordClient = await startBot();
			const missingPairs = await Promise.all(
				checkChannels(discordClient, pairs)
			);
			const absentUsers = missingPairs.flat();
			const multi = client.multi();
			absentUsers.forEach((user) => {
				multi.rPush(`R${rnd}ABSENT`, user);
			});
			console.log(missingPairs, "MissingPairs");
			console.log(absentUsers, "AbsentUsers");

			const leftUsers = twoDDiff(missingPairs, formattedPairs);
			await Promise.all(
				leftUsers.map(async (user) => {
					multi.rPush(`R${rnd}LEFT`, user);
					sendDateChangeInfo(await User.findOne({ discordID: user }));
				})
			);
			await multi.exec();
			if (!process.env.MANUAL_AGENDA) {
				const date = moment(new Date(nconf.get(`dateConf:${rnd}`).startDate));
				agenda.schedule(
					date.add(10, "minutes").toDate(),
					"Create Additional Round",
					{ round: rnd }
				);
			}
		}
	);
	agenda.define<{ round: number }>(
		"Create Additional Round",
		async (job: Job<{ round: number }>) => {
			console.log("start");
			const rnd = job.attrs.data.round;
			const left = await client.lRange(`R${rnd}LEFT`, 0, -1);
			const formattedPairs = await Pair.aggregate<{
				users: string[];
				_id: ObjectId;
			}>([
				{
					$lookup: {
						from: "users",
						localField: "user",
						foreignField: "_id",
						as: "usr",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "partner",
						foreignField: "_id",
						as: "partnr",
					},
				},
				{
					$unwind: {
						path: "$usr",
					},
				},
				{
					$unwind: {
						path: "$partnr",
					},
				},
				{
					$set: {
						users: ["$usr.discordID", "$partnr.discordID"],
					},
				},
				{
					$project: {
						_id: true,
						users: true,
					},
				},
			]);
			console.log(formattedPairs, "formattedPairs");

			//cancelling dates with 1 missing user
			const channelIDs = left.map((leftUser) => {
				return formattedPairs.filter((pair) => pair.users.includes(leftUser))[0]
					._id;
			});
			const rmDates = await Pair.find({ _id: { $in: channelIDs } });
			rmDates.forEach((date) => {
				date.cancelled = true;
			});
			await Promise.all(rmDates.map((a) => a.save()));
			await deleteChannels(rmDates);
			//creating new pairs from missing users
			const users = (await User.find({ discordID: { $in: left } }, "_id")).map(
				(user) => user._id
			);
			const relations = await MatchRelations.aggregate([
				{
					$match: {
						user: {
							$in: users,
						},
					},
				},
				{
					$unwind: "$partners",
				},
				{
					$sort: {
						"partners.score": 1,
					},
				},
				{
					$group: {
						_id: "$_id",
						user: {
							$first: "$user",
						},
						partners: {
							$push: "$partners",
						},
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							_id: "$_id",
							user: "$user",
							partners: "$partners.user",
						},
					},
				},
			]);
			console.log(relations, "relations");

			const compilationobj: { [key: string]: UserDocument[] } =
				Object.fromEntries(relations.map((a) => [a.user, a.partners]));

			const compiled: {
				matches: { [key: string]: string };
				rejected: string[];
			} = await compile(compilationobj as any);
			const matches = isolatePairs(compiled.matches);

			const multi = client.multi();
		
			const pairsToCreate = [...matches];
			//the srp rejects array will be cut into pairs
			sliceIntoChunks(compiled.rejected, 2).map((pair) => {
				if (pair.length < 2) {
					multi.rPush(`R${rnd}REJECTED`, pair[0]);
				} else {
					pairsToCreate.push(pair);
				}
			});

			const pairDocuments = await Promise.all(
				pairsToCreate.map(async (pair) => {
					console.log(pair, "pair");
					const user = await User.findOne({ _id: pair[0] });
					const partner = await User.findOne({ _id: pair[1] });
					return new Pair({ user, partner, rejects: true, round: rnd });
				})
			);

			await multi.exec();
			const bot = await startBot();
			console.log(pairDocuments);
			await createDate(bot, pairDocuments);
		}
	);
}
