import { Stack, Center, Text, Box, HStack, Divider, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import image from "../public/team/kedziora.jpg";

function Profile({
	profile,
	name,
	size,
	titleSize,
	descSize,
	desc,
}: {
	size?: string | number;
	titleSize: string | number;
	descSize: string | number;
	profile: string;
	name: string;
	desc: string;
}) {
	return (
		<Stack style={{margin:"30px"}}>
            <Center>
                <Box
                    width={size || "140px"}
                    height={size || "140px"}
                    rounded="100%"
                    overflow="hidden"
                    as="img"
                    src={profile}
                    alt="Profile Picture"
                />
            </Center>
			<Text textAlign="center" fontWeight="semibold" fontSize={titleSize}>
				{name}
			</Text>
			<Text textAlign="center" fontWeight="light" fontSize={descSize}>
				{desc}
			</Text>
		</Stack>
	);
}

function HVStack({makeH, children}: {makeH?: boolean, children: any}){
    if(makeH){
        return <HStack>{children}</HStack>
    }else{
        return <Stack>{children}</Stack>;
    }
}

export default function Team() {
	const [isLargerThan1200] = useMediaQuery("(min-width: 1200px)");	
    return (
			<Stack>
				<Box h={"140px"}></Box>
				<Text textAlign="center" fontSize="6xl" fontWeight="bold">
					Nasz Team
				</Text>
				{isLargerThan1200 && <Box h={"50px"}></Box>}
				<Center>
					<HVStack makeH={isLargerThan1200}>
						<Profile
							titleSize={"38px"}
							descSize={"20px"}
							name="Piotrek Czirnia"
							desc="Twórca"
							profile="/team/czirnia.jpg"
							size={"370px"}
						/>
						{isLargerThan1200 && <Box w={"200px"}></Box>}
						<Profile
							titleSize={"38px"}
							descSize={"20px"}
							desc="Geniusz Uczenia Maszynowego"
							profile="/team/budziłowicz.jpg"
							name="Szymon Budziłowicz"
							size={"370px"}
						/>
					</HVStack>
				</Center>
				{isLargerThan1200 && <Box h={"60px"}></Box>}
				<Center>
					<HVStack makeH={isLargerThan1200}>
						<Profile
							titleSize={"28px"}
							descSize={"15px"}
							name="Michał Kędziora"
							desc="Bóg Marketingu"
							profile="/team/kedziora.jpg"
							size={"170px"}
						/>
						{isLargerThan1200 && <Box w={"100px"}></Box>}
						<Profile
							titleSize={"28px"}
							descSize={"15px"}
							desc="Dzielny Frontendowiec"
							profile="/team/kalicun.jpg"
							name="Dominik Kalicun"
							size={"170px"}
						/>
						{isLargerThan1200 && <Box w={"100px"}></Box>}
						<Profile
							titleSize={"28px"}
							descSize={"15px"}
							desc="Wybitny Pisarz"
							profile="/team/nowański.jpg"
							name="Konrad Nowański"
							size={"170px"}
						/>
					</HVStack>
				</Center>
				{isLargerThan1200 && <Box h={"60px"}></Box>}
			</Stack>
		);
}
