import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { User } from "../models/User";
import { shuffle } from "lodash";
import { generateRelations } from "./rpc";
import nconf from "nconf"

export interface setupSystem {
	channelKickTimeout: number,
	rounds: {
		startDate: Date,
		endDate: Date
	}[]
}
export async function socketHandler(
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
	io.on("connection", (socket) => {


		socket.on("createPairs", data => {
			io.emit("pairsMessages", "Invoked createPairs Setup")
			generateRelations()
			const { pairs } = JSON.parse(data)
		})
		socket.on("setupSystem", (data: setupSystem) => {
			nconf.set("config", data)
			io.emit("systemMessage", "config saved")
		})
	});
}

async function createPairs() {
	User.find({}).exec((err, data) => {
		const shuffleme = [...data.map((data) => data._id)];
		Object.fromEntries(data.map((user) => [user._id, shuffle(shuffleme)]));
	});
}
