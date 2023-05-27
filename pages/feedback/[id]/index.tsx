import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
	Box,
	Center,
	Container,
	Heading,
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
	HStack,
	Radio,
	RadioGroup,
	Button,
	Input,
	Textarea,
} from "@chakra-ui/react";
import { Pair } from "../../../models/Pair";
import { User } from "../../../models/User";
import { GetServerSidePropsExpress } from "../../../types/next";
import {
	isJoinedServer,
	isLoggedIn,
	isRegistrationCompleted,
} from "../../../config/passport";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { Feedback } from "../../../models/Feedback";

export default function feedbackPage({ round, id}) {
	return (
		<Box>
			<Box h="70px"></Box>
			<Center mt="50px">
				<Heading>Formularz Rundy {round}</Heading>
			</Center>
					<form action={`/api/feedback/${id}`} method="post">
						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Jak bardzo podobał Ci się twój partner pod względem osobowości?
							</FormLabel>
							<Center>
								<RadioGroup name="likingPersonality" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>

							<FormHelperText textAlign="center">
								1 - W ogóle nie podobał mi się, 10 - Bardzo mi się podobał
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Na ile zainteresowania twojego partnera pokrywają się z twoimi?
							</FormLabel>
							<Center>
								<RadioGroup name="sameInterests" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>
							<FormHelperText textAlign="center">
								1 - Nie ma praktycznie żadnego pokrycia, 10 - Duża część
								zainteresowań jest zgodna
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Na ile twoja płeć i orientacja seksualna odpowiadają
								preferencjom twojego partnera?
							</FormLabel>
							<Center>
								<RadioGroup name="sexualityPreference" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>
							<FormHelperText textAlign="center">
								1 - W ogóle nie odpowiada, 10 - Całkowicie odpowiada
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Czy twoje oczekiwania co do partnera zostały spełnione?
							</FormLabel>
							<Center>
								<RadioGroup name="partnerExpectations" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>{" "}
							<FormHelperText textAlign="center">
								1 - W ogóle nie, 10 - W pełni spełnione
							</FormHelperText>
							<Center m="15px">
								<Textarea name="partnerExpectationsComment" w="xl"></Textarea>
							</Center>
							<FormHelperText textAlign="center">
								Napisz co nie pasowało (opcjonalne)
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Jakie były twoje pierwsze wrażenia na temat twojego partnera?
							</FormLabel>
							<Center>
								<RadioGroup name="firstImpressions" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>
							<FormHelperText textAlign="center">
								1 - Negatywne, 10 - Pozytywne
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Czy są jakieś problemy lub kwestie, które chciałbyś poruszyć w
								związku z twoim partnerem?
							</FormLabel>
							<Center>
								<RadioGroup name="partnerProblems" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>
							<FormHelperText textAlign="center">
								1 - Nie ma problemów, 10 - Jest wiele problemów
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Czy uważasz, że twoja relacja z partnerem jest zrównoważona i
								satysfakcjonująca dla obu stron?
							</FormLabel>
							<Center>
								<RadioGroup name="satisfyingRelationship" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>
							<FormHelperText textAlign="center">
								1 - W ogóle nie jest zrównoważona, 10 - Jest bardzo zrównoważona
								i satysfakcjonująca dla obu stron
							</FormHelperText>
						</FormControl>

						<FormControl as="fieldset" mt="50px">
							<FormLabel as="legend" textAlign={"center"}>
								Jakie są twoje plany dotyczące przyszłych spotkań z twoim
								partnerem?
							</FormLabel>
							<Center>
								<RadioGroup name="futurePlans" defaultValue="10">
									<HStack spacing="24px">
										<Radio value={"1"}>1</Radio>
										<Radio value={"2"}>2</Radio>
										<Radio value={"3"}>3</Radio>
										<Radio value={"4"}>4</Radio>
										<Radio value={"5"}>5</Radio>
										<Radio value={"6"}>6</Radio>
										<Radio value={"7"}>7</Radio>
										<Radio value={"8"}>8</Radio>
										<Radio value={"9"}>9</Radio>
										<Radio value={"10"}>10</Radio>
									</HStack>
								</RadioGroup>
							</Center>
							<FormHelperText textAlign="center">
								1 - Nie mam planów, 10 - Mam bardzo konkretne i ambitne plany
							</FormHelperText>
						</FormControl>
						<Box h="40px"></Box>
						<Center>
							<Button type="submit">Wyślij</Button>
						</Center>
					</form>
			<Box h="100px"></Box>
		</Box>
	);
}
// 1 Jak bardzo podobał Ci się twój partner pod względem osobowości? (1 - w ogóle nie podobał mi się, 10 - bardzo mi się podobał)
// 2 Na ile zainteresowania twojego partnera pokrywają się z twoimi? (1 - nie ma praktycznie żadnego pokrycia, 10 - duża część zainteresowań jest zgodna)
// 3 Na ile twoja płeć i orientacja seksualna odpowiadają preferencjom twojego partnera? (1 - w ogóle nie odpowiada, 10 - całkowicie odpowiada)
// 4 Czy twoje oczekiwania co do partnera zostały spełnione? (1 - w ogóle nie, 10 - w pełni spełnione)
// 5 Jakie były twoje pierwsze wrażenia na temat twojego partnera? (1 - negatywne, 10 - pozytywne)
// 6 Czy są jakieś problemy lub kwestie, które chciałbyś poruszyć w związku z twoim partnerem? (1 - nie ma problemów, 10 - jest wiele problemów)
// 7 Czy uważasz, że twoja relacja z partnerem jest zrównoważona i satysfakcjonująca dla obu stron? (1 - w ogóle nie jest zrównoważona, 10 - jest bardzo zrównoważona i satysfakcjonująca dla obu stron)
// 8 Jakie są twoje plany dotyczące przyszłych spotkań z twoim partnerem? (1 - nie mam planów, 10 - mam bardzo konkretne i ambitne plany)

export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res,
	params,
}) => {
	console.log(params.id)
	// req.user // to jest zalogowany użytkownik
	// params.id // to jest para
	isLoggedIn(req, res);
	isJoinedServer(req, res);
	isRegistrationCompleted(req, res);
	try {
		const count = await Feedback.countDocuments({user: req.user._id})
		if (count > 0) {
			return { notFound: true };
		}
		const pair = await Pair.findById(
			new ObjectId(params.id)
		);
		if (!pair) {
			return { notFound: true };
		}
		// const user = await User.findById(req.user._id);
		return {
			props: { round: pair.round, id: pair._id.toString() },
		};
	} catch {
		return { notFound: true };
	}
};
