import { round } from "lodash";
import nconf from "nconf";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserAsync, getUserDataAsync } from "../../../config/passport";
import { Feedback } from "../../../models/Feedback";
import { Pair } from "../../../models/Pair";
import { UserDocument } from "../../../models/User";


export default async function handler(
	req: Express.Request,
	res: NextApiResponse
) {
	const plannedDates = nconf.get("plannedDates");
	const loggedIn = req.user ? true : false;
	if (!loggedIn) return res.status(401).end();

	// const dates = await Pair.find({user: req.user._id})

	const pairs = await Pair.find({
		cancelled: { $ne: true },
		$or: [{ user: req.user._id }, { partner: req.user._id }],
	})
		.sort({ round: 1 })
		.populate(
			"user partner",
			"_id msg profileInfo.msg accessToken refreshToken profileInfo.hobbies profileInfo.name discordID"
		);

	const pairsExport = await Promise.all(
		pairs.map(async (pair, idx) => {
			if (pair.partner._id.toString() === req.user._id.toString()) {
				//TODO: have fallback profile if you cant get userprofile
				try {
					const profile = await getUserAsync(
						pair.user.accessToken,
						pair.user.refreshToken
					);

					const roundConfig: { startDate: Date; endDate: Date } = nconf.get(
						`dateConf:${pair.round}`
					);

					const exists = await Feedback.countDocuments({ user: pair.partner._id });
					console.log("exists", exists)
					return {
						form: exists == 0 ? `/feedback/${pair._id}` : undefined,
						profile: `https://cdn.discordapp.com/avatars/${
							pair.user.discordID
						}/${(profile as any)?.avatar || ""}.webp`,
						name: pair.user.profileInfo.name,
						date: roundConfig.startDate,
						discordLink: pair.dateID
							? `discord://discord.com/channels/${"1037322239734992907"}/${
									pair.dateID
							  }`
							: null,
						dateActive: pair.dateID ? true : false,
						rejected: pair.rejects,
						notCommingLink: `/absent/${pair._id}/`,
						commonHobbies: pair.user.profileInfo.hobbies.filter((value) =>
							req.user.profileInfo.hobbies.includes(value)
						),
						msg: pair.user.profileInfo.msg,
						ended: pair.ended,
					};
				} catch {
					return {
						profile: null,
						commonHobbies: [],
						msg: "Nie powinienem istnieć!!!!",
						name: "Duch",
						dateActive: false,
						rejected: true,
					};
				}
			} else if (pair.user._id.toString() === req.user._id.toString()) {
				try {
					const profile = await getUserAsync(
						pair.partner.accessToken,
						pair.partner.refreshToken
					);
					const roundConfig: { startDate: Date; endDate: Date } = nconf.get(
						`dateConf:${pair.round}`
					);
					const exists = await Feedback.countDocuments({ user: pair.user._id });
					console.log("exists", exists, pair.user._id)
					return {
						form: exists == 0 ? `/feedback/${pair._id}` : undefined,
						profile: `https://cdn.discordapp.com/avatars/${
							pair.partner.discordID
						}/${(profile as any)?.avatar || ""}.webp`,
						name: pair.partner.profileInfo.name,
						date: roundConfig.startDate,
						discordLink: pair.dateID
							? `discord://discord.com/channels/${"1037322239734992907"}/${
									pair.dateID
							  }`
							: null,
						dateActive: pair.dateID ? true : false,
						notCommingLink: `/absent/${pair._id}`,
						rejected: pair.rejects,
						commonHobbies: pair.partner.profileInfo.hobbies.filter((value) =>
							req.user.profileInfo.hobbies.includes(value)
						),
						msg: pair.partner.profileInfo.msg,
						ended: pair.ended,
					};
				} catch {
					return {
						profile: null,
						commonHobbies: [],
						msg: "Nie powinienem istnieć!!!!",
						name: "Duch",
						dateActive: false,
						rejected: true,
					};
				}
			}
		})
	);

	const date = {
		me: {
			name: req.user.profileInfo.name,
			profile: `https://cdn.discordapp.com/avatars/${req.user.discordID}/${req.user.profile.avatar}.webp`,
		},
		plannedDates,
		dates: pairsExport,
	};

	if (!req.user) return res.status(401).end();
	res.json(date);
}
