import {
	Box,
	Button,
	Center,
	Divider,
	Fade,
	Flex,
	Link,
	SlideFade,
	Stack,
	Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { GetServerSidePropsExpress } from "../../types/next";
import { isLoggedIn, isRegistrationCompleted } from "../../config/passport";

export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res,
}) => {
	const loggedIn = req.user ? true : false;
	isLoggedIn(req, res);
	isRegistrationCompleted(req, res);
	let name: string = "";
	if (loggedIn) {
		name = req.user.profile.username + "#" + req.user.profile.discriminator;
	}

	return {
		props: { loggedIn, name },
	};
};

const Home: NextPage<{ loggedIn: boolean; name: string }> = ({
	loggedIn,
	name,
}) => {
	return (
		<>
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
										Blind Dating
									</Text>
								</Center>
								<Box w={3}></Box>
								<Center>
									<Text
										fontSize={{ lg: "6xl", base: "3xl" }}
										fontWeight="extrabold"
									>
										Trainer!
									</Text>
								</Center>
							</Flex>
						</Center>
					</SlideFade>
					<Fade delay={0.8} in={true}>
						<Divider />
						<Text textAlign="center" m={3}>
							<b>Wspólnymi siłami stworzymy event który będzie przecudowny!</b>
							<br />
							Dziękujemy za twoją obecność w projekcie jako trener!
						</Text>
					</Fade>
					<Fade delay={1.3} in={true}>
						<Center>
							<Link href="/trainer/choose">
								<Button m={8} p={6} fontSize="xl" fontWeight="bold">
									Zaczynajmy!
								</Button>
							</Link>
						</Center>
					</Fade>
				</Stack>
			</Center>
		</>
	);
};

export default Home;
