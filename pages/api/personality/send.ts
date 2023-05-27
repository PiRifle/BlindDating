import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "express";
import { check, validationResult } from "express-validator";
import { getQuestions } from "@alheimsins/b5-50-ipip-neo-pi-r"
import calculateScore from "@alheimsins/bigfive-calculate-score"
import interpretScore from "@alheimsins/b5-result-text"
import getResult from '@alheimsins/b5-result-text'
import { User } from "../../../models/User";

interface choice {
    text: string,
    score: number,
    color: number
}

interface question{
    id: string, 
    text: string,
    keyed: string,
    domain: string,
}

interface answer{
    question: string,
    choice: choice[]
}

interface body{
    answers: answer[]
}
function formatChoices(answers){
    return Object.keys(answers).reduce((prev, current) => {
        const choice = answers[current]                
        prev.push({
          domain: choice.domain,
          score: choice.answer.score,
        //   facet: current
        })
        return prev
      }, [])
}

export default async function handler(req: Request, res: NextApiResponse) {
	await check("answers").exists().run(req);
	if(!req.user) return res.status(401).end();

	if (!validationResult(req).isEmpty()) return res.status(400).end();
	const questions: question[] = getQuestions();
	const answers: answer[] = req.body.answers;

	const formatted = answers.map((answer) => {
		const intermediary = {
			...questions.find((value) => {
				return value.id == answer.question;
			}),
			answer: answer.choice,
		};
		delete intermediary["choices"];
		return intermediary;
	});

	const formed = [];

    // console.log(JSON.stringify(formatChoices(formatted)));
    
	const result = calculateScore({ answers: formatChoices(formatted) });
    
    // console.log(result);
    
    const user = await User.findOne({ discordID: req.user.discordID});
    user.profileInfo.personality = result
    // console.log(user);
    
    await user.save()
    
	// const interpret = getResult({scores: result, lang: 'pl'})
	// res.json(interpret);

	// console.log(result);

	// questions.
	// console.log(req.body.answers);

	// await User.updateOne({discordID: req.user.discordID}, {}}).exec()
	res.json({ status: "ok" });

}

        
