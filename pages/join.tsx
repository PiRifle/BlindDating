import {
	Center,
	Stack,
	SlideFade,
	Flex,
	Fade,
	Button,
	Text,
	Box,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { isLoggedIn } from "../config/passport";
// import { getDiscordInvite } from "../lib/rpc";
import { User } from "../models/User";
import { GetServerSidePropsExpress } from "../types/next";

export default function Register({ vapidPublicKey, discordLink, inServer }) {
	return (
		<>
			<Center h="100vh">
				<Stack>
					<Text
						align="center"
						fontSize={{ lg: "7xl", base: "6xl" }}
						fontWeight="extrabold"
					>
						Dołącz na serwer!!
					</Text>
					{!inServer ? (
						<Text textAlign={"center"} p={4}>
							Zaraz dołączysz na serwer Blind Dating! Również aby być na bieżąco
							pozwól nam wysyłać ważne komunikaty powiadomieniami!
						</Text>
					) : (
						<Text textAlign={"center"} p={4}>
							Jesteś już na serwerze Blind Dating!
						</Text>
					)}
					<Fade delay={1} in={true}>
						<Center>
							<Link href="/home">
								<Button m={8} p={6} fontSize="xl" fontWeight="bold">
									Kontynuuj
								</Button>
							</Link>
						</Center>
					</Fade>
				</Stack>
			</Center>
		</>
	);
}

export async function getServerSideProps({
	req,
	res,
}: {
	req: Express.Request;
	res: Express.Response;
}) {
	isLoggedIn(req, res);
	let inServer = false;
	const response = await fetch(
		`https://discord.com/api/guilds/1037322239734992907/members/${req.user.discordID}`,
		{
			body: JSON.stringify({ access_token: req.user.accessToken }),
			method: "PUT",
			headers: {
				authorization: `Bot ${process.env.DISCORD_BOT}`,
				"Content-Type": "application/json",
			},
		}
	);
	console.log(response.status);

	if (response.status === 201) {
		inServer = false;
		await User.updateOne(
			{ discordID: req.user.discordID },
			{ "configuration.joinedServer": true }
		);
	} else if (response.status === 204) {
		inServer = true;
		await User.updateOne(
			{ discordID: req.user.discordID },
			{ "configuration.joinedServer": true }
		);
	}
	console.log(await response.text());

	return {
		props: {
			inServer,
			vapidPublicKey: process.env.PUBLIC_VAPID_KEY,
			discordLink: "as",
		},
	};
}
