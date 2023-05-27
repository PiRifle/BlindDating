// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Hobby } from "../../models/Hobby";
import { School } from "../../types/next";


export default async function handler(req: Express.Request, res: NextApiResponse) {
    if (!req.user) return res.status(401).end();
	const hobbies = await Hobby.find({}, "name description")

	res.status(200).json(hobbies);
}
