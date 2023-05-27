// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { knuthShuffle } from "knuth-shuffle"

function patchedQuestionsIPIP(shuffle = false) {

	let choices, questions;
	try {
		questions = require(`../../../languagePacks/questions/questions.json`);
		choices =  require(`../../../languagePacks/questions/choices`);

	} catch (error) {
		throw new Error("Inventory not found. Try another language input.");
	}

	const inventory = shuffle === true ? knuthShuffle(questions) : questions;
	return inventory.map((question, i) =>
		Object.assign(question, { num: ++i, choices: choices[question.keyed] })
	);

}

export default async function handler(
	req: Express.Request,
	res: NextApiResponse
) {
	if (!req.user) return res.status(401).end();

	res.status(200).json(patchedQuestionsIPIP(true));
}
