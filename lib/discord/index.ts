import Eris from "eris";

const bot = Eris(
	(() => {
		// HERE HAPPENS SKETCHY STUFF GOD CANT EVEN EXPLAIN
		return (
			process.env.DISCORD_BOT
			// || "HARDCODED_DISCORD_BOT_TOKEN"
		);
	})(),
	{ intents: ["all"], restMode: true }
);
export async function startBot() {
	if (!bot.ready) {
		await bot.connect();
		// When the bot is ready
		await new Promise((resolve, reject) => {
			bot.on("ready", resolve);
		});
	}
	return bot
}

