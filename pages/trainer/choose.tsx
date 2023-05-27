import { Center, Stack, Box, Text, Divider, Grid, GridItem, UnorderedList, Button, ListItem, Flex, Tag, useColorMode, useMediaQuery, useStatStyles } from "@chakra-ui/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
	motion,
	useMotionValue,
	useTransform,
	AnimatePresence,
} from "framer-motion";
import { useEffect, useState } from "react";
import { Personality, UserDocument } from "../../models/User";
import GenderPicker from "../../components/GenderPicker";
import { isRegistrationCompleted } from "../../config/passport";
import { useColorModeValue } from "@chakra-ui/react";

async function fetchPair() {
	const res = await fetch("/api/training/getPartner");
	const resp = await res.json();
	return resp == null ? "Nie ma już żadnych profili do przejrzenia! \n Dziękujemy za twój czas <33" : resp
}


function generateDescription(personality: Personality) {
	const convert = (result) => {
		switch (result) {
			case "low":
				return 0;
			case "neutral":
				return 1;
			case "high":
				return 2;
		}
	}
	// const O
	// const C
	// const E
	// const N
	const string = `Ta osoba jest ${["słabo", "średnio", "mocno"][convert(personality.A.result)]
		} nastawiona do świata społecznego, jest ${["mało", "średnio", "dużo"][convert(personality.O.result)]
		} otwarta na nowe doświadczenia, ${["słabo", "średnio", "bardzo"][convert(personality.C.result)]
		} trzyma się słowa i obowiązków. ${["jest introwertyczna", "", "jest ekstrowertyczna"][
		convert(personality.E.result)
		]
		} ${[", nie przeżywa silnych emocji.", "", ", 	przeżywa silne emocje."][
		convert(personality.N.result)
		]
		}`;
	return string
}

async function sendPair(partner: string, matching: boolean) {
	await fetch("/api/training/postPartner", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ partner, matching }),
	});
}

export function getServerSideProps({ req, res }) {
	isRegistrationCompleted(req, res);
	console.log(process.env.TRAINING_GENDER || false)
	console.log(process.env.TRAINING_PERSONALITY || false);
	return {
		props: {
			genderFocus: process.env.TRAINING_GENDER || false,
			personalityFocus: process.env.TRAINING_PERSONALITY || false,
		},
	};
}

export default function StartPage(
	props
) {
	console.log(props);

	const [genderFocus, setGender] = useState(props.genderFocus == 'true');
	const [personalityFocus, setPersonality] = useState(
		props.personalityFocus == 'true'
	);

	// // console.log(genderFocus, personalityFocus)

	const [profile, setProfile] = useState<UserDocument>();
	const x = useMotionValue(0);
	const [chosenNumber, chooseNumber] = useState(0);
	const color = useColorModeValue("#FFFFFF", "#2D2E3F")
	const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
	const background = useTransform(
		x,
		[-300, 0, 300],
		[
			`linear-gradient(90deg, #F56565, ${color})`,
			`linear-gradient(90deg, ${color}, ${color})`,
			`linear-gradient(90deg, ${color}, #48BB78)`,
		]
	);
	console.log(color);

	const sendForm = (event, info) => {
		if (Math.abs(info.offset.y) <= 100) {


			if (info.offset.x >= (isLargerThan800 ? 300 : 200)) {
				setProfile(null);
				//@ts-ignore
				profile && sendPair(profile._id, true);
				chooseNumber((a) => a + 1);
			}
			if (info.offset.x <= -(isLargerThan800 ? 300 : 200)) {
				setProfile(null);
				//@ts-ignore

				profile && sendPair(profile._id, false);
				chooseNumber((a) => a + 1);
			}
		}
		fetchPair().then(setProfile);
	};
	useEffect(() => {
		fetchPair().then(setProfile);
	}, []);

	return (
		// @ts-ignore
		<Center as={motion.div} h="100vh" overflow="hidden" style={{ background }}>
			<Box h="20px" />
			<Button
				position={"absolute"}
				onClick={() => sendForm(null, { offset: { x: 700, y: 50 } })}
				right={30}
				display={{ base: "none", xl: "block" }}
				top="50%"
			>
				Przyjmij
			</Button>
			<Button
				position={"absolute"}
				onClick={() => sendForm(null, { offset: { x: -700, y: 50 } })}
				left={30}
				top="50%"
				display={{ base: "none", xl: "block" }}
			>
				Odrzuć
			</Button>
			<AnimatePresence>
				{profile instanceof Object ? (
					<Box
						position="absolute"
						as={motion.div}
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0 }}
						background={color}
						// @ts-ignore
						onDragEnd={sendForm}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						style={{ x }}
						maxW="100vh"
						h={{ lg: "80vh", base: "" }}
						// minH="80vh"
						m={5}
						border="2px solid"
						borderColor="blackAlpha.50"
						borderRadius="20px"
						boxShadow="0px 0px 40px RGBA(0, 0, 0, 0.16)"
						key={chosenNumber}
					>
						{/* <input type="checkbox" checked={genderFocus} onChange={()=>setGender(gender=>!gender)} /> */}
						{/* <input type="checkbox" checked={personalityFocus} onChange={()=>setPersonality(gender=>!gender)} /> */}
						<Box h="100%" p={4}>
							<Stack>
								<Box position="relative" height={14}>
									{!personalityFocus ? (
										<>
											<Text
												fontSize={{
													base: "2xl",
													xl: !genderFocus ? "4xl" : "2xl",
												}}
												position="absolute"
												left={0}
												bottom={0}
												fontWeight="bold"
											>
												{profile.profileInfo.name}
											</Text>
											<Text>{profile.profileInfo.school}</Text>
											<Text
												fontSize="2xl"
												position="absolute"
												right={0}
												fontWeight="light"
											>
												{profile.profileInfo.age} lat
											</Text>
											<Text
												top={0}
												textAlign={"center"}
												fontSize={{
													base: "m",
													xl: !genderFocus ? "2xl" : "xl",
												}}
												w={{ base: "8em", xl: "100%" }}
												position="absolute"
												left={"50%"}
												transform="translateX(-50%)"
												fontWeight="light"
											>
												Chce iść z tobą na{" "}
												{profile.profileInfo.datingPreference
													? "Randkę"
													: "Spotkanie"}
											</Text>
										</>
									) : null}
								</Box>
								<Divider />
								{!genderFocus ? (
									<Grid
										templateRows="1fr 200px"
										templateColumns="repeat(3, 1fr)"
										alignItems="center"
										alignContent="center"
										mt={20}
									>
										{!personalityFocus ? (
											<GridItem>
												<Box position="relative" width="min-content">
													<Text
														textAlign="center"
														fontWeight="bold"
														fontSize={{ lg: "2xl", base: "xl" }}
													>
														płeć
													</Text>
													<Box
														m={{ lg: -2, base: -12 }}
														transform={{
															lg: "scale(0.8)",
															base: "scale(0.66)",
														}}
													// style={{ transform: "scale(0.8)" }}
													>
														<GenderPicker
															isStatic
															onChange={() => { }}
															value={profile.profileInfo.gender}
															key={chosenNumber}
														></GenderPicker>
													</Box>
												</Box>
											</GridItem>
										) : null}
										<GridItem h="100%" colSpan={!personalityFocus ? 2 : 3}>
											<Text
												textAlign="center"
												fontWeight="bold"
												fontSize={{ lg: "2xl", base: "xl" }}
											>
												Hobby
											</Text>
											<Flex flexWrap="wrap" maxH="25vh" overflowY="scroll">
												{profile.profileInfo.hobbies.map((a, idx) => (
													<Tag
														m={{ lg: 1, base: 0.8 }}
														fontSize={{ lg: "sm", base: "2xs" }}
														key={idx}
													>
														{a}
													</Tag>
												))}
											</Flex>
											{/* <UnorderedList>
											{profile.profileInfo.hobbies.map((a, idx) => (
												<ListItem key={idx}>{a}</ListItem>
											))}
										</UnorderedList> */}
										</GridItem>
										<GridItem h="100%" colSpan={3} w="100%">
											<Text
												textAlign="center"
												fontWeight="bold"
												fontSize={{ lg: "2xl", base: "xl" }}
											>
												Osobowość
											</Text>
											<Text
												textAlign="center"
												fontWeight="regular"
												mt="7px"
												fontSize={{ lg: "3xl", base: "lg" }}
											>
												{generateDescription(profile.profileInfo.personality)}
											</Text>
										</GridItem>
									</Grid>
								) : (
									<Box position="relative" width="min-content">
										<Text
											textAlign="center"
											fontWeight="bold"
											fontSize={{ lg: "2xl", base: "xl" }}
										>
											płeć
										</Text>
										<Box m={isLargerThan800 ? 14 : 2} style={{ transform: isLargerThan800 ? "scale(1.2)" : "scale(0.8)" }}>
											<GenderPicker
												isStatic
												onChange={() => { }}
												value={profile.profileInfo.gender}
												key={chosenNumber}
											></GenderPicker>
										</Box>
									</Box>
								)}
							</Stack>
							{/* <Text fontSize="xs">
								{JSON.stringify(profile)}
							</Text> */}
						</Box>
					</Box>
				) : (
					<Text fontSize="2xl" textAlign="center" fontWeight="extrabold">
						{profile}
					</Text>
				)}
			</AnimatePresence>
		</Center>
	);
}

