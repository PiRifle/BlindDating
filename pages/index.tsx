import {
	Box,
	Button,
	Center,
	Fade,
	Flex,
	Heading,
	Link,
	SlideFade,
	Stack,
	Text,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { motion } from "framer-motion";
import { GetServerSidePropsExpress } from "../types/next";
import { isLoggedIn } from "../config/passport";
import { useEffect } from "react";
import Head from "next/head";
import { User } from "../models/User";
import registerPush from "../lib/register";

export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res,
}) => {
	const users = await User.countDocuments();
	const loggedIn = req.user ? true : false;
	const configured =
		req.user && req.user.configuration && req.user.configuration.configured
			? true
			: false;
	configured && res.redirect("/home");
	let name: string = "";
	if (loggedIn) {
		name = req.user.profile.username + "#" + req.user.profile.discriminator;
	}

	return {
		props: {
			loggedIn,
			name,
			configured,
			users,
		},
	};
};

const Home: NextPage<{
	loggedIn: boolean;
	name: string;
	configured: boolean;
	users: number;
	vapidPublicKey: string;
}> = ({ loggedIn, name, configured, users }) => {

	return (
		<>
			<Head>
				<title>Witaj w Blind Dating!</title>
				<meta
					name="description"
					content="Blind Dating to największy opolski event randkowy szkół!"
				/>
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			</Head>
			<Center h="100vh">
				<Stack>
					<Text
						align="center"
						fontSize={{ lg: "7xl", base: "6xl" }}
						fontWeight="extrabold"
					>
						Witaj!
					</Text>
					<SlideFade delay={0.2} in={true} offsetY="-20px">
						<Center>
							<Flex>
								<Center>
									<Text fontSize={{ lg: "6xl", base: "3xl" }} fontWeight="bold">
										w
									</Text>
								</Center>
								<Box w={3}></Box>
								<Center>
									<Text
										bgGradient="linear(to-l, #c200fb, #ec0868)"
										bgClip="text"
										fontSize={{ lg: "6xl", base: "3xl" }}
										fontWeight="extrabold"
									>
										Blind Dating!
									</Text>
								</Center>
							</Flex>
						</Center>
					</SlideFade>
					<Fade delay={1} in={true}>
						<Center>
							{!loggedIn ? (
								<Stack>
									(
									<Link href="/api/auth/login">
										<Button m={8} p={6} fontSize="xl" fontWeight="bold">
											{users > 1000 ? "Zaloguj Się!" : "Zarejestruj Się!"}
										</Button>
									</Link>
									)
									<Text fontWeight={"light"} textAlign="center">
										{users > 1000 ? "Wszystkie miejsca są zapełnione!" : <>Pozostało {1001 - users} miejsc</>}
									</Text>
								</Stack>
							) : (
								<Link href="/start">
									<Button m={8} p={6} fontSize="xl" fontWeight="bold">
										Kontynuuj jako {name}
									</Button>
								</Link>
							)}
						</Center>
					</Fade>
				</Stack>
			</Center>
		</>
	);
};

export default Home;
