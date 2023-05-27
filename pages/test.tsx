// import {
// 	Box,
// 	Button,
// 	useStyleConfig,
//     Center,
// 	Input,
// 	Stack,
// 	Text,
// } from "@chakra-ui/react";
// import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
// import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';
// import LogConsole from "../components/admin/logConsole";
// import GenderPicker from "../components/GenderPicker";
// import PositionPicker from "../components/PositionPickerClass";
// import { getDiscordInvite } from "../lib/rpc";
// import registerPush from "../lib/register";
// import { Log } from "../models/Log";

export default function TestPage() {return <div>co ty tu robisz?</div>}
// 	// useEffect(()=>{
// 	// 	navigator.serviceWorker.getRegistrations().then((registrations) => {
// 	// 		console.log(registrations);
// 	// 		if (registrations.length == 0){
// 	// 			registerPush(vapidPublicKey)
// 	// 			if (!("Notification" in window)) {
// 	// 					// Check if the browser supports notifications
// 	// 					alert("This browser does not support desktop notification");
// 	// 				} else if (Notification.permission === "granted") {
// 	// 					// Check whether notification permissions have already been granted;
// 	// 					// if so, create a notification
// 	// 					const notification = new Notification("Hi there!");
// 	// 					// …
// 	// 				} else if (Notification.permission !== "denied") {
// 	// 					// We need to ask the user for permission
// 	// 					Notification.requestPermission().then((permission) => {
// 	// 						// If the user accepts, let's create a notification
// 	// 						if (permission === "granted") {
// 	// 							const notification = new Notification("Dzięki!");
// 	// 							// …
// 	// 						}
// 	// 					});
// 	// 				}
// 	// 			};
// 	// 		return () => {}
// 	// 	});

// 	// }, [vapidPublicKey])
// 	// console.log(a)
// 	return (
// 		<Box p={20}>
// 			<Box w={500} h="300px" overflow={"hidden"}>
// 				<LogConsole channel="*"></LogConsole>
// 			</Box>
// 		</Box>
// 		);
// }

// export async function getServerSideProps({req, res}){
// 	return {
// 		props: {
// 			a: JSON.stringify(await Log.find({}).lean()),
// 			vapidPublicKey: process.env.PUBLIC_VAPID_KEY,
// 		}
// 	}
// }
