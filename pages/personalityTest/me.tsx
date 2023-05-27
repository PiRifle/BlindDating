import translation from "../../languagePacks/result"
import generateResult from "@alheimsins/b5-result-text/lib/generate-result"; 
// import getResult from "@alheimsins/b5-result-text";
import {
	Button,
	Center,
	Container,
	Stack,
	Text,
	Box,
	Divider,
	useMediaQuery,
} from "@chakra-ui/react";
import { Chart } from "react-charts";
import { AnimatePresence, motion } from "framer-motion";
import { NextResponse } from "next/server";
import React, { useState, useEffect } from "react";
import { GetServerSidePropsExpress } from "../../types/next";
import { isLoggedIn } from "../../config/passport";

import { useRouter } from "next/router";

export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res,
	query
}) => {
	isLoggedIn(req, res);
	const loggedIn = req.user ? true : false;
	let result;
	let textResult;
	if (loggedIn && req.user.profileInfo && req.user.profileInfo.personality) {
		result = req.user.profileInfo.personality;

		textResult = generateResult(result, translation);
		// console.log(result, textResult);
	} else {
		res.redirect("/");
	}
	return { props: { textResult, result, time: query.t || 0 } };
};

interface result {
	domain: string;
	title: string;
	shortDescription: string;
	description: string;
	scoreText: string;
	count: number;
	score: number;
	facets: any[];
	text: string;
}

// function Bar() {

//      const primaryAxis = React.useMemo<
//              AxisOptions<typeof data[number]["data"][number]>
//      >(
//              () => ({
//                      position: "left",
//                      getValue: (datum) => datum.primary,
//              }),
//              []
//      );

//      const secondaryAxes = React.useMemo<
//              AxisOptions<typeof data[number]["data"][number]>[]
//      >(
//              () => [
//                      {
//                              position: "bottom",
//                              getValue: (datum) => datum.secondary,
//                      },
//              ],
//              []
//      );

//      return (
//              <>
//                      <button onClick={randomizeData}>Randomize Data</button>
//                      <br />
//                      <br />
//                              <Chart
//                                      options={{
//                                              data,
//                                              primaryAxis,
//                                              secondaryAxes,
//                                      }}
//                              />
//              </>
//      );
// }

const secToTime = (sec: any) => {
	let time = '';

	sec = Math.round(sec / 1000);
	sec >= 3600 ?  time += `${Math.floor(sec / 3600)} Godzinę ` : null;
	sec = sec % 3600;
	sec >= 60 ? time += `${Math.floor(sec / 60)} ${sec / 60 < 2 ? 'Minutę' : sec / 60 < 5 ? 'Minuty' : 'Minut'} ` : null;
	sec = sec % 60;
	time.length != 0 ? time += 'i ' : null;
	sec > 0 ? time += `${sec} ${sec < 2 ? 'Sekundę' : sec < 5 ? 'Sekundy' : 'Sekund'}` : null;

	return time;
}

export default function Me({ textResult, result, time }) {
const [stage, setStage] = useState(-1);
	const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");

	let currentDomain: result;
	if (stage >= 0) 
		currentDomain = textResult[stage];
	return (
		<Box w="100%" h="100vh">
			<Stack>
				<Box mt={isLargerThan1200? "12em" : "5em"} w="100%" overflow="visible">
					<AnimatePresence>
						{stage == -1 && (
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{
									opacity: 1,
									y: 0,
								}}
								exit={{
									opacity: 0,
									y: -80,
									transition: {
										duration: 0.2,
									},
								}}
								key={99}
								transition={{ type: "spring" }}
							>
								<Box position="absolute" w="100vw">
									<Center>
										<Stack w="90%">
											<Text
												fontSize={{ lg: "7xl", base: "4xl" }}
												textAlign="center"
												fontWeight="extrabold"
											>
												Twoje Wyniki!
											</Text>
											<Center h={6}>
												<Divider />
											</Center>

											{time != 0 && (
												<Text
													fontSize={{ lg: "3xl", base: "xl" }}
													textAlign="center"
													fontWeight="bold"
												>
													Widzisz wcale nie było tak źle! Test zajął Ci: <br />
													{secToTime(time)}
												</Text>
											)}
										</Stack>
									</Center>
								</Box>
							</motion.div>
						)}

						{stage >= 0 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,
								}}
								exit={{
									opacity: 0,
								}}
								key={stage}
								transition={{ type: "spring" }}
							>
								<Box position="absolute" w="100vw">
									<Center>
										<Stack w="90%">
											<Text
												fontSize={{ lg: "5xl", base: "4xl" }}
												textAlign="center"
												fontWeight="extrabold"
											>
												{currentDomain.title}
											</Text>
											<Text
												fontSize={{ lg: "xl", base: "lg" }}
												textAlign="center"
												fontWeight="light"
											>
												{currentDomain.shortDescription}
											</Text>
											<Center h={6}>
												<Divider />
											</Center>
											<Text
												fontSize={{ lg: "3xl", base: "s" }}
												textAlign="center"
												fontWeight="bold"
											>
												{currentDomain.text}
											</Text>
										</Stack>
									</Center>
								</Box>
							</motion.div>
						)}
					</AnimatePresence>

					{/* {JSON.stringify({textResult, result})} */}
				</Box>
			</Stack>
			<Center
				position="fixed"
				bottom={10}
				marginLeft="auto"
				marginRight="auto"
				marginBottom="2em"
				left={0}
				right={0}
			>
				<Button
					onClick={() => {
						stage < 4
							? setStage((stage) => stage + 1)
							: window.location.assign("/start");
					}}
				>
					Dalej
				</Button>
			</Center>
		</Box>
	);
}
