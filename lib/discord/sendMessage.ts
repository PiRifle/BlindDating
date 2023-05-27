import Eris, { TextChannel } from "eris";

interface IMessageParams {
	title: string;
	body: string;
	color?: number;
	bot: Eris.Client
}

async function sendMessage({
	title,
	body,
	color,
	bot,
}: IMessageParams): Promise<void> {
	const channelId = "1073712199073271828"
	const embed = {
		title,
		description: `@everyone ${body}`,
		color: color || 0xff5733, // Default color if not specified
	};
	const channel = bot.getChannel(channelId) as TextChannel;
	await channel.createMessage({ embed });
}


export function sendDiscordUpcomingDate(bot) {
	return sendMessage({
		bot,
		title: "Nadchodzi randka!",
		body: "Wejdźcie na stronę, zobaczcie z kim się poznacie!",
	});
}

export function sendDiscordDateStarted(bot) {
	return sendMessage({
		bot,
		title: "Spotkania się zaczęły",
		body: "Wejdź na kanał z aby spotkać się z swoją parą!",
	});
}

export function sendDiscordDateStarting(bot) {
	return sendMessage({
		bot,
		title: "Twoje spotkanie zaraz się zacznie",
		body: "Stay Tuned!",
	});
}

export function sendDiscordDateEnded(bot) {
	return sendMessage({
		bot,
		title: "Randka się zakończyła",
		body: "Koniec tego dobrego :((",
	});
}

export function sendDiscordDateEnding(bot) {
	return sendMessage({
		bot,
		title: "Spotkanie za moment się skończy",
		body: "Tylko ostrzegam :D",
	});
}
