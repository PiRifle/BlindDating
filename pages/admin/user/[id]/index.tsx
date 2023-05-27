import { Box, Container, Heading, HStack, Text } from "@chakra-ui/react";
import { check, validationResult } from "express-validator";
import * as React from "react";
import GenderPicker from "../../../../components/GenderPicker";
import { User, UserDocument } from "../../../../models/User";
import { GetServerSidePropsExpress } from "../../../../types/next";

export interface IAdminProps {
	usr: string;
}

export const getServerSideProps: GetServerSidePropsExpress<
	IAdminProps
> = async ({ req, res, params }) => {
	if (!req.user) return res.redirect("/");
	if (!req.user.isAdmin) return res.redirect("/");
	if (!(params.id && params.id.length == 24)) return { notFound: true };
	const usr = await User.findById(params.id).lean();
	if (usr) {
		//@ts-ignore
		usr.profile = JSON.parse(await req.redisClient.get(usr.discordID));
	}
	return usr ? { props: { usr: JSON.stringify(usr) } } : { notFound: true };
};

export default function Admin(props: IAdminProps) {
	const profile: UserDocument = JSON.parse(props.usr);
	console.log(profile);

	return (
		<Container maxW="container.xl">
			<Box h="90px"></Box>

			<HStack>
				<Box>
					{profile.profile && (
						/*eslint-disable-next-line @next/next/no-img-element */
						<img
							src={`https://cdn.discordapp.com/avatars/${profile.discordID}/${
								profile.profile?.avatar || ""
							}.webp`}
							alt="profile picture"
						/>
					)}
				</Box>
				<Box>
					{profile.profileInfo && (
						<Heading>
							{profile.profileInfo.name} {profile.profileInfo.surname}
						</Heading>
					)}
					<Text>{profile.discordID}</Text>
				</Box>
			</HStack>
			<Box>
				<Box mt="12px">
					<Heading fontSize={"lg"}>Szkoła</Heading>
					<Text>{profile.profileInfo.school}</Text>
				</Box>
				<Box mt="12px">
					<HStack>
						<Box>
							<Heading fontSize={"lg"}>Płeć</Heading>
							<GenderPicker
								onChange={() => {}}
								isStatic={true}
								value={profile.profileInfo.gender}
							/>
						</Box>
						<Box>
							<Heading fontSize={"lg"}>Preferencja</Heading>
							<GenderPicker
								onChange={() => {}}
								isStatic={true}
								value={profile.profileInfo.genderPreference}
							/>
						</Box>
					</HStack>
				</Box>
				<Box mt="12px">
					<Heading fontSize={"lg"}>Wybór</Heading>
					<Text>
						{profile.profileInfo.datingPreference ? "Randka" : "Spotkanie"}
					</Text>
				</Box>
				<Box mt="12px">
					<Heading fontSize={"lg"}>Hobby</Heading>
					<Text>{profile.profileInfo.hobbies.join(", ")}</Text>
				</Box>
				<Box mt="12px">
					<Heading fontSize={"lg"}>Wiadomość</Heading>
					<Text maxW={"50%"}>{profile.profileInfo.msg}</Text>
				</Box>
			</Box>
		</Container>
	);
}
