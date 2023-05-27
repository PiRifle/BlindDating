// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { School } from "../../types/next";



export const schools: School[] = [
	{
		code: "ZSEK",
		name: "Zespół Szkół Ekonomicznych w Opolu",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "ZSEL",
		name: "Zespół Szkół Elektrycznych w Opolu",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "LO6",
		name: "Liceum Ogólnokształcące nr 6",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "LO5",
		name: "Liceum Ogólnokształcące nr 5",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "LO2",
		name: "Liceum Ogólnokształcące nr 2",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "LO3",
		name: "Liceum Ogólnokształcące nr 3",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "LO1",
		name: "Liceum Ogólnokształcące nr 1",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "LO8",
		name: "Liceum Ogólnokształcące nr 8",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "Gzowski",
		name: "Zespół Szkół Technicznych i Ogólnokształcących im. K. Gzowskiego",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "Staszic",
		name: "Zespół Szkół Zawodowych im. Stanisława Staszica",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "Budowlanka",
		name: "Zespół Szkół Budowlanych im. Papieża Jana Pawła II",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "Plastyk",
		name: "Zespół Państwowych Placówek Kształcenia Plastycznego im. Jana Cybisa",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "Mechan",
		name: "Zeszpół Szkół Mechanicznych",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "Kotlet",
		name: "Zespół Szkół Zawodowych nr 4 im. Koraszewskiego",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
	{
		code: "OTHER",
		name: "Inne",
		logo: "https://elektryk.opole.pl/images/logo.png",
	},
];

export default function handler(
	req: Express.Request,
	res: NextApiResponse
) {
	if (!req.user) return res.status(401).end();
	res.status(200).json(schools)
}
