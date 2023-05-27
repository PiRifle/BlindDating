import {
	Box,
	Button,
	Center,
	FormControl,
	FormHelperText,
	FormLabel,
	Heading,
	HStack,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Stack,
	Text,
	Textarea,
	useToast,
} from "@chakra-ui/react";
import { useSteps, Steps, Step } from "chakra-ui-steps";
import { useEffect, useReducer, useState } from "react";
import { GetServerSidePropsExpress, School } from "../types/next";
import { AnimatePresence, motion } from "framer-motion";
import { ProfileInfo } from "../models/User";
import { isEmpty } from "lodash";
import { MultiSelect } from "../lib/chakra-multiselect";
import Link from "next/link";
import dynamic from "next/dynamic"
import { isLoggedIn, isRegistrationCompleted } from "../config/passport";
import Head from "next/head";
const GenderPicker = dynamic(() => import("../components/GenderPicker"));


export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res
}) => {
	const loggedIn = req.user ? true : false;
	isLoggedIn(req, res);

	if (loggedIn) {
		const name =
			req.user.profile.username + "#" + req.user.profile.discriminator;
		const step = req.user.configuration && req.user.configuration.step;
		let cfg: ProfileInfo = isEmpty(req.user.profileInfo)
			? {
				school: "ZSEL",
				name: "",
				surname: "",
				age: 15,
				hobbies: [],
				gender: [0.1, 0.1],
				datingPreference: true,
				genderPreference: [0.1, 0.1],
				msg: ""
			}
			: {
				school: "ZSEL",
				name: "",
				surname: "",
				age: 15,
				hobbies: [],
				gender: [0.1, 0.1],
				datingPreference: true,
				genderPreference: [0.1, 0.1],
				msg: "",
				...req.user.profileInfo,
			};
		// console.log(req.user.profileInfo);

		return {
			props: { cfg, step: step || 0 },
		};
	} else {
		res.redirect("/");
	}
};

function reducer(state, action) {
	state[action.type] = action.value;
	return { ...state };
}
const variants = {
	enter: (direction: number) => {
		return {
			zIndex: 3,
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		};
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => {
		return {
			zIndex: 0,
			x: direction < 0 ? 1000 : -1000,
			opacity: 0,
		};
	},
};

async function sendConfig(config: ProfileInfo, step, setStep, setInputErr) {
	if (
		!(
			(
				step == 0 &&
				["name", "surname", "age", "gender", "school"].every(
					(i) => config.hasOwnProperty(i) && config[i]
				)
			) ||
			(
				step == 1 &&
				config.personality &&
				config.hobbies &&
				config.hobbies.length &&
				["hobbies"].every(
					(i) => config.hasOwnProperty(i) && config[i]
				)
			) ||
			(
				step == 2 &&
				["genderPreference"].every(
					(i) => config.hasOwnProperty(i) && config[i]
				) &&
				config.msg
			)
		)) return false;
	setInputErr(false);
	config.datingPreference = Boolean(config.datingPreference)
	config.age = Number(config.age)
	const response = await fetch("/api/profile/update", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ...config, step }),
	});
	const jsonData = await response.json()
	if (response.status == 200) {
		if (jsonData.nextStep > 2) window.location.assign("/home");
		setStep(jsonData.nextStep)
	}
	return true;
}

const sendHobby = async (config: ProfileInfo, step) => {
	config.datingPreference = Boolean(config.datingPreference);
	config.age = Number(config.age);
	step = step - 1;
	const response = await fetch("/api/profile/update", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ...config, step }),
	});
	if (response.status == 200) {
		window.location.assign("/personalityTest");
	}
}

async function fetchHobbies() {
	const data = await fetch("/api/getHobbies")
	const jdata = await data.json()
	return jdata.map(hobby => ({ label: hobby.description, value: hobby.name }))
}

async function fetchSchools() {
	const data = await fetch("/api/schools")
	return await data.json()
}

export default function MyApp({
	cfg,
	step,
}: {
	cfg: ProfileInfo;
	step: number;
}) {
	const toast = useToast();
	const [config, dispatch] = useReducer(
		reducer,
		cfg
	);
	const [schools, setSchools] = useState([]);
	const [direction, setDirection] = useState(0);
	const [hobbies, setHobbies] = useState([]);
	const [inputErr, setInputErr] = useState(false);

	useEffect(() => {
		fetchSchools().then(setSchools);
		fetchHobbies().then(setHobbies);
	}, []);

	useEffect(() => {
		if (config.hobbies && config.hobbies.length > 20) {
			dispatch({ name: "hobbies", value: config.hobbies.splice(20) });
			toast({
				title: "Za dużo hobby",
				description:
					"Hola Hola! Może jesteś ciekawym człowiekiem, ale nie przesadzasz trochę?",
				status: "error",
				duration: 3000,
				position: "bottom-left"
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [config])

	const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
		initialStep: step,
	});

	return (
		<Center maxW="100vw" overflow="hidden">
			<Head>
				<title>Uzupełnij swoje dane</title>
				<meta
					name="description"
					content="Blind Dating to największy opolski event randkowy szkół!"
				/>
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			</Head>
			<Stack position="relative">
				<Box h="15px" w="10px" />
				<Center pt={10} overflow={"hidden"}>
					<Heading>Uzupełnij Resztę Danych</Heading>
				</Center>
				<Box h={10} />
				<Steps activeStep={activeStep} colorScheme="pink">
					<Step label="Kim Jesteś?" />
					<Step label="Co Lubisz?" />
					<Step label="Kogo Preferujesz?" />
				</Steps>

				<Box h={700} w="100%" overflow="visible">
					<AnimatePresence custom={direction}>
						<motion.div
							key={activeStep}
							custom={direction}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{
								x: { type: "spring", stiffness: 300, damping: 30 },
								opacity: { duration: 0.2 },
							}}
							variants={variants}
						>
							<Center
								position="absolute"
								left={0}
								right={0}
								marginLeft="auto"
								marginRight="auto"
								maxW="28.5vw"
							>
								{activeStep == 0 && (
									<Stack spacing={3} py={9}>
										<FormControl>
											<FormLabel>Twoje Imię i Nazwisko</FormLabel>
											<HStack>
												<Input
													isInvalid={!config.name && inputErr}
													placeholder="Imię"
													type="name"
													value={config.name}
													onChange={(event) => {
														dispatch({
															type: "name",
															value: event.target.value,
														});
													}}
												/>
												<Input
													isInvalid={!config.surname && inputErr}
													isRequired
													placeholder="Nazwisko"
													type="surname"
													value={config.surname}
													onChange={(event) => {
														dispatch({
															type: "surname",
															value: event.target.value,
														});
													}}
												/>
											</HStack>
											<FormHelperText></FormHelperText>
										</FormControl>
										<FormControl isInvalid={!config.age && inputErr}>
											<FormLabel>Ile masz lat?</FormLabel>
											<NumberInput
												value={config.age}
												onChange={(value) => {
													dispatch({
														type: "age",
														value: value,
													});
												}}
												precision={0}
												defaultValue={15}
												min={15}
												max={99}
											>
												<NumberInputField />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</FormControl>
										<FormControl isInvalid={!config.gender && inputErr}>
											<FormLabel>Identyfikujesz się jako</FormLabel>
											<Center w="100%">
												<GenderPicker
													isStatic={false}
													value={
														(config.gender as number[]).some((v) => isNaN(v))
															? [0, 0]
															: config.gender
													}
													onChange={(value) => {
														dispatch({
															type: "gender",
															value: value,
														});
													}}
												/>
											</Center>
											<FormHelperText></FormHelperText>
										</FormControl>
										<FormControl isInvalid={!config.school && inputErr}>
											<FormLabel>Do której szkoły chodzisz?</FormLabel>
											<Select
												value={config.school}
												onChange={(value) => {
													dispatch({
														type: "school",
														value: value.target.value,
													});
												}}
											>
												{schools.map((value: School, idx) => {
													return (
														<option value={value.code} key={value.code}>
															{value.name}
														</option>
													);
												})}
											</Select>
											<FormHelperText></FormHelperText>
										</FormControl>
									</Stack>
								)}
								{activeStep == 1 && (
									<Stack spacing={3} py={9}>
										<Box>
											<FormLabel>Twoja Osobowość?</FormLabel>
											{!cfg.personality ? (
												<Stack>
													<Text textAlign="center">
														Potrzebujemy twoją osobowość aby móc dobrać idealną
														parę dla ciebie
													</Text>
													<Button
														colorScheme={
															!config.personality && inputErr ? "red" : null
														}
														onClick={() => {
															sendHobby(config, activeStep);
														}}
													>
														Sprawdź swoją Osobowość
													</Button>
												</Stack>
											) : (
												<Stack>
													<Text textAlign="center">
														Jak coś mamy twoją osobowość <br />
														sprawdź ją{" "}
														<Link href="/personalityTest/me">
															<a
																style={{
																	fontWeight: "bolder",
																}}
															>
																tutaj
															</a>
														</Link>
													</Text>
													<Button
														onClick={() => {
															sendHobby(config, activeStep);
														}}
													>
														Sprawdź swoją Osobowość Ponownie
													</Button>
												</Stack>
											)}
										</Box>
										<FormControl isInvalid={!config.hobbies.length && inputErr}>
											<FormLabel>Jakie masz Hobby?</FormLabel>
											<MultiSelect
												options={hobbies}
												value={config.hobbies}
												onChange={(option) => {
													dispatch({
														type: "hobbies",
														value: option,
													});
												}}
											/>
											<FormHelperText></FormHelperText>
										</FormControl>
									</Stack>
								)}
								{activeStep == 2 && (
									<Stack spacing={3} py={9}>
										<FormControl
											isInvalid={!config.genderPreference && inputErr}
										>
											<FormLabel>Jaką płeć preferujesz?</FormLabel>
											<Center w="100%">
												<GenderPicker
													isStatic={false}
													value={
														(config.genderPreference as number[]).some((v) =>
															isNaN(v)
														)
															? [0, 0]
															: config.genderPreference
													}
													onChange={(value) => {
														dispatch({
															type: "genderPreference",
															value: value,
														});
													}}
												/>
											</Center>
											<FormHelperText></FormHelperText>
										</FormControl>
										<FormControl
											isInvalid={
												!config.datingPreference.toString() && inputErr
											}
										>
											<FormLabel>Jesteś zainteresowan*:?</FormLabel>
											<Select
												value={config.datingPreference.toString()}
												onChange={(value) => {
													dispatch({
														type: "datingPreference",
														value: value.target.value == "true" ? true : false,
													});
												}}
											>
												<option value="true">Randka</option>
												<option value="false">Szukanie znajomego</option>
											</Select>
											<FormHelperText></FormHelperText>
										</FormControl>
										<FormControl isInvalid={!config.msg && inputErr}>
											<FormLabel>
												Krótka wiadomość którą wyślemy twojej parze
											</FormLabel>
											<Textarea
												value={config.msg}
												onChange={(value) => {
													dispatch({
														type: "msg",
														value: value.target.value,
													});
												}}
											></Textarea>
										</FormControl>
									</Stack>
								)}
							</Center>
						</motion.div>
					</AnimatePresence>
				</Box>
				<Center pb={5}>
					{activeStep > 0 ? (
						<Button
							variant="outline"
							onClick={() => {
								prevStep();
								setDirection(-1);
							}}
						>
							Wróć
						</Button>
					) : null}
					<Box w={5}></Box>
					{activeStep < 2 ? (
						<Button
							onClick={async () => {
								setInputErr(true);
								await sendConfig(config, activeStep, setStep, setInputErr);
								setDirection(1);
							}}
							colorScheme={"pink"}
						>
							Dalej
						</Button>
					) : null}
					{activeStep == 2 ? (
						<Button
							onClick={async () => {
								setInputErr(true);
								await sendConfig(config, activeStep, setStep, setInputErr);
								setDirection(1);
							}}
							colorScheme={"pink"}
						>
							Zaczynajmy!
						</Button>
					) : null}
				</Center>
			</Stack>
		</Center>
	);
}
