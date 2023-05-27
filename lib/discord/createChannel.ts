import { channel } from "diagnostics_channel";
import Eris from "eris";
import { startBot } from ".";
import { Pair, PairDocument } from "../../models/Pair";
import { sendDateEnded, sendDateStarted } from "../notification";

export async function createDate(client: Eris.Client, pairs: PairDocument[]) {
	const bot = await startBot()
	const guild = new Eris.Guild({ id: "1037322239734992907" }, bot);

	const roles = await guild.getRESTRoles();
	const channels = await guild.getRESTChannels();

	const everyone_role = roles.filter((role) => role.name == "@everyone")[0].id;
	const vcm_role = roles.filter((role) => role.name == "VCM")[0].id;
	return pairs.map(async (document, idx) => {
		const channel = await createChannel(guild, [document.partner.discordID, document.user.discordID], `Randka${idx}r${document.round}`, vcm_role, everyone_role)
		if (document.dateID) {
			channels.filter(channel => channel.id == document.dateID).forEach(async doc => await doc.delete())
		}
		document.dateID = channel.id
		await document.save()
	})
}

export async function deleteChannels(pairs: PairDocument[]) {
	const bot = await startBot();
	const guild = new Eris.Guild({ id: "1037322239734992907" }, bot);
	const channels = await guild.getRESTChannels();
	const channelMap = channels.reduce(function (
		map: { [key: string]: typeof obj },
		obj
	) {
		map[obj.id] = obj;
		return map;
	},
		{});
	return Promise.all(
		(await pairs.map(async (document) => {
			await channelMap[document.dateID]?.delete();
			document.dateID = undefined;
			await document.save();
		})
		));
}

export async function deleteDate(round: number) {
	const bot = await startBot();

	const guild = new Eris.Guild({ id: "1037322239734992907" }, bot);
	const channels = await guild.getRESTChannels();
	const channelMap = channels.reduce(function (
		map: { [key: string]: typeof obj },
		obj
	) {
		map[obj.id] = obj;
		return map;
	},
		{});
	return Promise.all((await Pair.find({ round }).populate("user partner")).map(async document => {
		await sendDateEnded(document.partner);
		await sendDateEnded(document.user);
		await channelMap[document.dateID]?.delete()
		document.ended = true;
		document.dateID = undefined;
		await document.save()
	}))

}

export function createChannel(
	guild: Eris.Guild,
	users: string[],
	name: string,
	vcm: string,
	everyone: string
) {
	const mapping = users.map((userID) => ({
		deny: 0,
		id: userID,
		allow: 4298114048,
		type: 1,
	}));

	const options: Eris.CreateChannelOptions = {
		userLimit: 2,
		permissionOverwrites: [
			{ deny: 4298114048, id: everyone, allow: 0, type: 0 },
			{ deny: 0, id: vcm, allow: 4298114048, type: 0 },
			...mapping,
		] as Eris.Overwrite[],
	};
	return guild.createChannel(name, 2, options);
}

