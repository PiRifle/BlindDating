import {
	Center,
	Grid,
	GridItem,
	List,
	ListItem,
	Stack,
	Text,
	Button,
	Box,
	Divider,
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionIcon,
	HStack,
	AccordionPanel,
	Tag,
	useColorModeValue,
	useMediaQuery,
	Link,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Spinner,
	useDisclosure,
	Avatar,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/pl";
import { Icon } from "@chakra-ui/icons";
import { BsDot } from "react-icons/bs";
import { FaGhost } from "react-icons/fa";
// @ts-ignore

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
	isJoinedServer,
	isLoggedIn,
	isRegistrationCompleted,
	sendToTraining,
} from "../config/passport";
import { GetServerSidePropsExpress } from "../types/next";
import Head from "next/head";
import registerPush from "../lib/register";
const Timer = dynamic(() => import("../components/Timer"), { ssr: false });

export function getServerSideProps({ req, res }) {
	isLoggedIn(req, res);
	isRegistrationCompleted(req, res);
	sendToTraining(req, res);
	isJoinedServer(req, res);
	return { props: { vapidPublicKey: process.env.PUBLIC_VAPID_KEY, sendInvite: req.user?.sendInvite || false } };
}

export default function Home({ vapidPublicKey }) {
	const sendInvite = true
	const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
	const [isLargerThan500] = useMediaQuery("(min-width: 700px)");
	const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");
	const [isOpen, setOpen] = useState(!sendInvite);
	let [registering, setRegistering] = useState(true)
	const [date, setDateConf] = useState<
		| {
			me: {
				name: string;
				profile: string;
			};
			plannedDates: number;
			dates: {
				profile: string;
				name: string;
				date: Date;
				rejected: boolean;
				discordLink: any;
				form: string;
				dateActive: boolean;
				notCommingLink: string;
				discordChannel: string;
				commonHobbies: string[];
				msg: string;
				ended: boolean;
			}[];
		}
		| undefined
	>();
	useEffect(() => {
		fetch("/api/profile/loggedin")
			.then((loggedIn) => loggedIn.json())
			.then((loggedin) => {
				if (loggedin) {
					fetch("/api/date/getdates")
						.then((i) => i.json())
						.then(setDateConf);
				}
			});
	}, []);

	useEffect(() => {
		if (registering) {
			if (!sendInvite) {
				navigator.serviceWorker
					.getRegistrations()
					.then(function (registrations) {
						for (let registration of registrations) {
							registration.unregister();
						}
					})
					.catch(function (err) {
						console.log("Service Worker registration failed: ", err);
					});
			}
			navigator.serviceWorker.getRegistrations().then((registrations) => {
				console.log(registrations);
				if (registrations.length == 0) {
					registerPush(vapidPublicKey);
					if (!("Notification" in window)) {
						alert("Ta przeglądarka nie wspiera powiadomień :*(");
					} else if (Notification.permission === "granted") {
					} else if (Notification.permission !== "denied") {
						Notification.requestPermission().then((permission) => {
							if (permission === "granted") {
								const notification = new Notification("Dzięki!");
							}
						});
					}
				}
			});
			registering = false;
			setRegistering(false)
		}
		return () => { };
	}, [vapidPublicKey]);
	function Meeting({
		ghost = false,
		meeting,
	}: {
		meeting: typeof date.dates[0];
		ghost: boolean;
	}) {
		return (
			<>
				<Modal
					isOpen={isOpen}
					onClose={() => {
						setOpen(false);
					}}
				>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>
							Zapraszamy do udostępnienia strony blinddating.opole.pl!
						</ModalHeader>
						<ModalCloseButton />
						<ModalBody m="5px">
							Dzięki temu możesz pomóc swoim singlowym znajomym znaleźć
							prawdziwą miłość. Nasza platforma oferuje bezpieczne i anonimowe
							randki, a dzięki Twojemu udostępnieniu szansa na odnalezienie
							szczęścia może być jeszcze większa. Dziel się naszą stroną i pomóż
							innym spełnić ich marzenia o miłości!
							<Center>
								<Button
									m="17px"
									onClick={async () => {
										await navigator
											.share({
												title: "Zaproś innych do Blind Dating!",
												url: "https://blinddating.opole.pl",
											})
											.then(() => {
												setOpen(false);
												return fetch("/api/profile/sentInvite");
											})
											.catch(console.error);
										return location.reload();
									}}
								>
									Zaproś Do Blind Dating
								</Button>
							</Center>
						</ModalBody>
					</ModalContent>
				</Modal>
				<Head>
					<title>Twoje Randki!</title>
					<meta
						name="description"
						content="Blind Dating to największy opolski event randkowy szkół!"
					/>
					<meta http-equiv="X-UA-Compatible" content="ie=edge" />
				</Head>
				<AccordionItem
					opacity={ghost ? 0.4 : 1}
					border="none"
					borderRadius={20}
					w="100%"
					p={isLargerThan500 ? 6 : 3}
					background={useColorModeValue("whiteAlpha.300", "whiteAlpha.100")}
				>
					<HStack>
						<AccordionButton w="min" m={0} p={3} borderRadius={7}>
							{ghost ? (
								<Icon as={BsDot} height="30px" width="30px" />
							) : (
								<AccordionIcon />
							)}
						</AccordionButton>
						{ghost || !meeting.profile ? (
							<Box
								as={FaGhost}
								h="44px"
								w="44px"
								borderRadius="100%"
								p={0}
								alignItems="center"
								ml={0}
							></Box>
						) : (
							<Avatar
								height="50px"
								width="50px"
								name={meeting.name}
								src={meeting.profile}
							/>
						)}
						<Text
							px={3}
							fontSize={{ lg: "xl", base: "m" }}
							fontWeight={"semibold"}
						>
							{ghost ? "????" : meeting.name}
						</Text>
						{ghost || (
							<Tag
								position="absolute"
								right={isLargerThan500 ? 16 : 6}
								colorScheme={meeting.rejected ? "yellow" : "pink"}
								borderRadius={20}
								minW={isLargerThan500 ? "300px" : "70px"}
								maxW={!isLargerThan800 ? "150px" : null}
								p={3}
								className={meeting.dateActive && "attention"}
							>
								{meeting.ended ? (
									<Text textAlign="center" width={"100%"}>
										Randka Zakończona
									</Text>
								) : !moment().isSame(new Date(meeting.date), "day") ? (
									<Text
										textAlign="center"
										width={"100%"}
										fontSize={{ lg: "sm", sm: "xs" }}
									>
										{moment(new Date(meeting.date))
											.locale("pl")
											.format("MMMM Do YYYY, h:mm:ss a")}
									</Text>
								) : (
									<Timer dateInfo={meeting} />
								)}
							</Tag>
						)}
					</HStack>
					{ghost ||
						(isLargerThan500 ? (
							<AccordionPanel p={3} h="300px" pb={4}>
								<Grid
									h="100%"
									gridTemplateColumns={isLargerThan500 ? "1fr 300px" : "1fr"}
									gridTemplateRows="1fr 50px"
								>
									<GridItem p={3}>
										<Text>Wiadomość:</Text>
										<Text mt={2} fontWeight={"normal"}>
											{meeting.msg}
										</Text>
									</GridItem>
									<GridItem
										position={"relative"}
										borderRadius={20}
										p={3}
										// eslint-disable-next-line react-hooks/rules-of-hooks
										background={useColorModeValue(
											"blackAlpha.100",
											"whiteAlpha.100"
										)}
									>
										<Text
											w="100%"
											textAlign={"center"}
											m={2}
											fontWeight={"light"}
										>
											Wspólne Hobby:
										</Text>
										<Box overflow="hidden" position={"relative"} h={"80%"}>
											<Box
												display={"flex"}
												position={"absolute"}
												m={0}
												left={0}
												right={0}
												bottom={0}
												top={0}
												flexWrap="wrap"
												alignContent="start"
												overflow={"hidden"}
												overflowY={"auto"}
												className={"hideScroll"}
											>
												{meeting.commonHobbies.map((a, idx) => (
													<Tag m="3px" key={idx}>
														{a}
													</Tag>
												))}
											</Box>
										</Box>
									</GridItem>
									<GridItem py={3} colSpan={2}>
										{meeting.ended && meeting.form && (
											<Button colorScheme={"cyan"} variant={"solid"}>
												<Link target="_blank" href={meeting.form}>
													Wypełnij Formularz
												</Link>
											</Button>
										)}
										{meeting.ended || (
											<Box display="flex" flexFlow={"row-reverse"}>
												{meeting.dateActive ? (
													<Button colorScheme={"blue"} variant={"solid"}>
														<Link target="_blank" href={meeting.discordLink}>
															Dołącz
														</Link>
													</Button>
												) : (
													<Link href={meeting.notCommingLink}>
														<Button colorScheme={"red"} variant={"outline"}>
															Nie Przyjdę
														</Button>
													</Link>
												)}
											</Box>
										)}
									</GridItem>
								</Grid>
							</AccordionPanel>
						) : (
							<AccordionPanel p={3} pb={4}>
								<Stack
									h="100%"
									gridTemplateColumns={isLargerThan500 ? "1fr 300px" : "1fr"}
									gridTemplateRows="1fr 50px"
								>
									<Box p={3}>
										<Text>Wiadomość:</Text>
										<Text mt={2} fontWeight={"normal"}>
											{meeting.msg}
										</Text>
									</Box>
									<Box
										position={"relative"}
										borderRadius={20}
										p={3}
										minH={"300px"}
										// eslint-disable-next-line react-hooks/rules-of-hooks
										background={useColorModeValue(
											"blackAlpha.100",
											"whiteAlpha.100"
										)}
									>
										<Text
											w="100%"
											textAlign={"center"}
											m={2}
											fontWeight={"light"}
										>
											Wspólne Hobby:
										</Text>
										<Box overflow="hidden" position={"relative"} h={"80%"}>
											<Box
												display={"flex"}
												position={"absolute"}
												m={0}
												left={0}
												right={0}
												bottom={0}
												top={0}
												flexWrap="wrap"
												alignContent="start"
												overflow={"hidden"}
												overflowY={"auto"}
												className={"hideScroll"}
											>
												{meeting.commonHobbies.map((a, idx) => (
													<Tag m="3px" key={idx}>
														{a}
													</Tag>
												))}
											</Box>
										</Box>
									</Box>
									<Box py={3}>
										{meeting.ended && meeting.form && (
											<Button colorScheme={"cyan"} variant={"solid"}>
												<Link target="_blank" href={meeting.form}>
													Wypełnij Formularz
												</Link>
											</Button>
										)}
										{meeting.ended || (
											<Box display="flex" flexFlow={"row-reverse"}>
												{meeting.dateActive ? (
													<Button colorScheme={"blue"} variant={"solid"}>
														<Link target="_blank" href={meeting.discordLink}>
															Dołącz
														</Link>
													</Button>
												) : (
													<Link href={meeting.notCommingLink}>
														<Button colorScheme={"red"} variant={"outline"}>
															Nie Przyjdę
														</Button>
													</Link>
												)}
											</Box>
										)}
									</Box>
								</Stack>
							</AccordionPanel>
						))}
				</AccordionItem>
			</>
		);
	}
	const colorscheme = useColorModeValue("blackAlpha.50", "whiteAlpha.300");
	return (
		<Grid
			templateAreas={
				isLargerThan1200
					? `	"header header"
						"info nav"
						"main nav"`
					: `	"header"
						"main"
						"nav"`
			}
			gridTemplateRows={isLargerThan1200 ? "50px 20% 1fr" : "50px 1fr 80px"}
			gridTemplateColumns={isLargerThan1200 ? "1fr 350px" : "1ft"}
			h="100vh"
			gap="1"
			p={5}
			fontWeight="bold"
		>
			{isLargerThan1200 ? (
				<GridItem
					background={colorscheme}
					style={{ backdropFilter: "blur(50px)" }}
					mx={2}
					borderRadius="20px"
					p={4}
					area={"nav"}
				>
					<Center>
						<Stack spacing={5} alignItems={"center"}>
							{date ? (
								<Avatar
									mt={7}
									height="150px"
									width="150px"
									name={date.me.name}
									src={date.me.profile}
								/>
							) : (
								<Spinner />
							)}
							{date ? (
								<Text textAlign="center" fontSize="2xl" fontWeight="bold">
									{date.me.name}
								</Text>
							) : (
								<Spinner />
							)}
							<Divider />
							<Link href="/start">
								<Button w="100%" colorScheme={"gray"} variant="ghost">
									Ustawienia
								</Button>
							</Link>
							<Link href="/logout">
								<Button w="100%" colorScheme={"gray"} variant="ghost">
									Wyloguj
								</Button>
							</Link>
						</Stack>
					</Center>
				</GridItem>
			) : (
				<GridItem
					background={colorscheme}
					style={{ backdropFilter: "blur(50px)" }}
					mx={2}
					borderRadius="20px"
					p={4}
					area={"nav"}
				>
					<Center>
						<HStack>
							<Link href="/start">
								<Button w="100%" colorScheme={"gray"} variant="ghost">
									Ustawienia
								</Button>
							</Link>
							<Link href="/logout">
								<Button w="100%" colorScheme={"gray"} variant="ghost">
									Wyloguj
								</Button>
							</Link>
						</HStack>
					</Center>
				</GridItem>
			)}
			{isLargerThan1200 && (
				<GridItem area="info" h="100%">
					<Center h="100%" fontSize="4xl">
						Planowane Spotkania:
					</Center>
				</GridItem>
			)}
			<GridItem
				position={"relative"}
				as={Accordion}
				allowToggle={true}
				mx={2}
				p={7}
				style={{ backdropFilter: "blur(50px)" }}
				borderRadius="20px"
				background={useColorModeValue("blackAlpha.50", "whiteAlpha.300")}
				area={"main"}
			>
				{date ? (
					<Box p={5} position={"relative"} h="100%" w={"100%"}>
						<Stack
							spacing={7}
							position={"absolute"}
							overflow="auto"
							top={0}
							className={"hideScroll"}
							left={0}
							right={0}
							bottom={0}
						>
							{date.plannedDates > 0 ? (
								[...Array(date.plannedDates)].map((d, id) => (
									<Meeting
										key={id}
										meeting={date.dates.at(id)}
										ghost={!date.dates.at(id)}
									/>
								))
							) : (
								<Text textAlign={"center"}>Nie ma jeszcze randek</Text>
							)}
						</Stack>
					</Box>
				) : (
					<Spinner />
				)}
			</GridItem>
		</Grid>
	);
}
