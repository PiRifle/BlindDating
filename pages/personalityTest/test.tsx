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
	useMediaQuery,
} from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSidePropsExpress } from "../../types/next";
import { useEffect, useState } from "react";
import {PersonalityTest} from "../../components/personalityTest";
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
		res.redirect("/");
	}

	return {
		props: { loggedIn, name },
	};
};

function Description(){
    const [seconds, setSeconds] = useState(0);
    const descriptions = [
                "Dawaj! Jeszcze chwilka",
                "Jejku, ale super dziś wyglądasz :))",
                "Ciekawe, Ciekawe...",
                "A tak pozatym.. to jak ci dzień minał?",
                "No i cudo",
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((seconds) => {if (descriptions.length <= seconds) {return 0}else{return seconds + 1}});
        }, 20000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
			<>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
					exit={{ opacity: 0, y: 10 }}
					key={seconds + "seconds"}
				>
					<Text
						m={5}
						align="center"
						fontSize={{ lg: "m", base: "s" }}
						fontWeight="semibold"
					>
						{descriptions[seconds]}
					</Text>
				</motion.div>
			</>
		);
}


const Home: NextPage<{ loggedIn: boolean; name: string }> = ({
	loggedIn,
	name,
}) => {
	const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");

	return (
		<Box h="100vh">
			<Stack spacing={2} maxW="100vw">
				<Text
					m={isLargerThan1200 && 5}
					align="center"
					mt="60px"
					fontSize={{ lg: "6xl", base: "5xl" }}
					fontWeight="extrabold"
				>
					Test osobowości
				</Text>
				{ isLargerThan1200 && <Description></Description>}
				<PersonalityTest />
			</Stack>
		</Box>
	);
};

export default Home;
