import React, { useEffect, useState } from "react";
import { Text, Button, Box, Stack, Center, HStack, Flex, useMediaQuery } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

async function loadTest() {
	const data = await fetch("/api/personality/questions");
	return await data.json();
}

async function sendForm(data) {
	await fetch("/api/personality/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
}

const seconds = new Date().getTime();

export const PersonalityTest = () => {
	const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");
	const [test, setTest] = useState([]);
	const [question, setQuestion] = useState(0);
	const [answers, setAnswer] = useState([]);
	const [testEnd, setTestEnd] = useState(false)
	useEffect(() => {
		loadTest().then(setTest);
	}, []);
	function continueTest(question: any, choice: any) {
		if (question.num >= test.length) {
			setTestEnd(true);
			return sendForm({ answers }).then(() => {
				window.location.assign(`me?t=${new Date().getTime() - seconds}`);
			});
		}
		setAnswer((a) => [...a, { question: question.id, choice }]);
		setQuestion((q) => q + 1);
	}
	const nowQuestion = test[question];

	return (
		<Box position="relative" overflow="hidden" w="100%" h="50vh">
			{!test.length ? (
				<Text fontSize="xl" fontWeight="semibold">
					Ładowanie Testu..
				</Text>
			) : (
				<AnimatePresence>
					<motion.div
						initial={{ opacity: 0, x: -70 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 70 }}
						key={question}
						transition={{ type: "spring" }}
					>
						<Box position="absolute" w="100vw" mt={isLargerThan1200 && 30}>
							<Center>
								<Stack w="90%">
									<Text
										align="center"
										fontSize={{ lg: "xl", base: isLargerThan1200 ? "m" : "xs" }}
										fontWeight="semibold"
									>
										{Math.round((nowQuestion.num / test.length) * 100)}% Testu
										Gotowe
									</Text>
									<Text
										m={isLargerThan1200 && 5}
										align="center"
										fontSize={{
											lg: "4xl",
											base: isLargerThan1200 ? "3xl" : "2xl",
										}}
										fontWeight="bold"
									>
										{nowQuestion.text}
									</Text>
								</Stack>
							</Center>
						</Box>
					</motion.div>
					<Box position="fixed" bottom="80px" w="100%">
						{!testEnd && (
							<Center w="100%">
								<Flex className="flexMobile">
									{nowQuestion.choices.map((choice) => {
										return (
											<Button
												minW="250px"
												maxH={isLargerThan1200 && "32px"}
												m={isLargerThan1200 ? 2 : 1}
												fontSize={{
													lg: "xl",
													base: isLargerThan1200 ? "m" : "s",
												}}
												background={
													[
														"#9C00CC",
														"#A202AD",
														"#A7038D",
														"#AC056E",
														"#B1064E",
													][choice.color - 1]
												}
												key={choice.color}
												onClick={() => {
													continueTest(nowQuestion, choice);
												}}
											>
												{choice.text}
											</Button>
										);
									})}
								</Flex>
							</Center>
						)}
					</Box>
				</AnimatePresence>
			)}
		</Box>
	);
};
