import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Pair } from "../../../models/Pair";
import Link from "next/link";
import { Box, Center, Stack, Text, Button } from "@chakra-ui/react";
import Head from "next/head";

export default function AbsentPage({
	round,
	id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<Head>
				<title>Czy jesteś pewien?</title>
				<meta
					name="description"
					content="Blind Dating to największy opolski event randkowy szkół!"
				/>
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			</Head>
			<Center h="100vh" m={8}>
				<Stack>
					<Text
						py={6}
						align="center"
						fontSize={{ lg: "5xl", base: "3xl" }}
						fontWeight="extrabold"
					>
						Czy na pewno chcesz anulować rundę {round}?
					</Text>
					<Center>
						<a href={`${id}/cancel`}>
							<Button colorScheme={"red"}>Tak, Kontynuuj</Button>
						</a>
					</Center>
					<Box h={20}></Box>
				</Stack>
			</Center>
		</>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	const { id } = ctx.params;
	const pair = await Pair.findOne({
		_id: id,
		dateID: null,
		ended: false
	});
	if (pair){
		return {
			props: {
				round: pair.round,
				id,
			},
		};
	}
	return {
		notFound: true,
	};
}
