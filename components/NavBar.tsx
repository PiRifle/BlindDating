import { Box, Text, HStack, useColorMode, Button, Center, Link, useMediaQuery, Avatar } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";


export default function NavBar() {
	const [registerMe, setRegisterMe] = useState(false)
	const [profile, setProfile] = useState({ profilePic: "", name: "" });
	useEffect(() => {
		// if (document.cookie.indexOf('connect.sid=') != -1){
			fetch("/api/profile/loggedin").then((loggedIn) => loggedIn.json()).then((loggedin)=>{if(loggedin){fetch("/api/profile/info")
				.then((prof) => prof.json())
				.then(setProfile)
				.catch(() => {});}})
			
		// }

			return ()=>{}
	}, []);
	const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");
	return (
		<Box
			position="fixed"
			w="100%"
			zIndex={1000}
			h="4.1em"
			style={{ backdropFilter: "blur(15px)" }}
		>
			<Box as="nav" bg="bg-surface">
				<HStack position="absolute" top="5px" left={0} m={2}>
					{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
					<a href="/">
						<Text
							className="animBG"
							w="max-content"
							bgClip="text"
							fontSize="2xl"
							fontWeight="extrabold"
						>
							Blind Dating
						</Text>
					</a>
					{isLargerThan1200 && (
						<Center>
							<Link href="/team">
								<Text m={2} fontSize="m">
									Nasz Team
								</Text>
							</Link>
							<Link href="/regulamin">
								<Text m={2} fontSize="m">
									Regulamin
								</Text>
							</Link>
						</Center>
					)}
				</HStack>
				<Box position="absolute" top="5px" right={0} m={2}>
					<HStack mr={6} onClick={() => setRegisterMe((reg) => !reg)}>
						{profile.profilePic && (
							<Avatar
								height="36px"
								width="36px"
								src={profile.profilePic}
								name={profile.name}
							/>
						)}
						<Text fontWeight="semibold">{profile.name}</Text>
					</HStack>
				</Box>
			</Box>
		</Box>
	);
}
