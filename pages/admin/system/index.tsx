import { Box, Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import LogConsole from "../../../components/admin/logConsole";
import nconf from "nconf"
import type {setupSystem} from "../../../lib/socket"


export function getServerSideProps({req, res}){
	if (!req.user) return res.redirect("/");
	if (!req.user.isAdmin) return res.redirect("/");
	return { props: { systemConfig: nconf.get("config") || {} } };
}

export default function System({systemConfig}: {systemConfig: setupSystem}) {

	// console.log(systemConfig.);
	
	const socket = io()
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box width="100%">
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input type={"number"} placeholder="Kick Out Timeout (Seconds)" />
						
						
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="green">Save</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Text fontSize="4xl" fontWeight="bold" m={6}>
				System
			</Text>
			<Stack>
				<HStack>
					<Button
						onClick={() => {
							socket.emit("createPairs", JSON.stringify({ pairs: 3 }));
						}}
					>
						Generate Pairs
					</Button>
					{/* <Button onClick={onOpen}>Set Configuration</Button> */}
				</HStack>
			</Stack>
			<LogConsole channel="*" />
		</Box>
	);
}
