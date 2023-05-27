import Eris, { VoiceChannel } from "eris";
import { arrayBuffer } from "stream/consumers";
import { PairDocument } from "../../models/Pair";

export async function checkChannel(client: Eris.Client, pair: PairDocument) {
	if (!pair.dateID) return null;
	const users = [pair.user.discordID, pair.partner.discordID]
	const pickedChannel = (await client.getChannel(pair.dateID)) as VoiceChannel;
	const channelUsers = Array.from(pickedChannel.voiceMembers.keys())
	if (channelUsers.length < 2) {
		return users.filter(user => !channelUsers.includes(user))
	}
	return []
}

export function checkChannels(client: Eris.Client, pairs: PairDocument[]) {
	return pairs.map(async pair => await checkChannel(client, pair))
}