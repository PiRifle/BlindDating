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
import { GetServerSidePropsExpress } from "../../types/next";
import { isLoggedIn } from "../../config/passport";

export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res,
}) => {
	isLoggedIn(req, res);

	const loggedIn = req.user ? true : false;
	let name: string = "";
	if (loggedIn) {
		name =
			(req.user.profileInfo && req.user.profileInfo.name) ||
			req.user.profile.username + "#" + req.user.profile.discriminator;
	} else {
		res.redirect("/")
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
				<Stack mx={5}>
					<Text
						align="center"
						fontSize={{ lg: "6xl", base: "4xl" }}
						fontWeight="extrabold"
					>
						{name}, Czas na Test!
					</Text>
					<Text
						align="center"
						fontSize={{ lg: "xl", base: "s" }}
						fontWeight="regular"
					>
						Abyśmy mogli Ciebie połączyć z najbardziej pasującą osobą,
						Chcemy zadać Tobie parę pytań! <br />
						To zajmie tobie tylko kilkanaście minut! Odpal sobie muzykę i odpowiedz nam
						na 50 prostych pytań :))
					</Text>
					<Fade delay={1} in={true}>
						<Center>
							<Link href="/personalityTest/test">
								<Button m={8} p={6} fontSize="xl" fontWeight="bold">
									Zaczynajmy
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
