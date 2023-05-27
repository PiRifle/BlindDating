import { Express, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingPair } from "../../../models/TrainingPair";
import { User } from "../../../models/User";

type Data = {
	name: string;
};

export default async function handler(req: Request, res: Response) {
	if (!req.user) return res.status(401).end();
	await check("partner").isString().isLength({ min: 24, max: 24 }).run(req);
	await check("matching").isBoolean().run(req);
    if (!validationResult(req).isEmpty()) return res.status(400).end();
	
	await TrainingPair.create({
		user: req.user._id,
		partner: new mongoose.Types.ObjectId(req.body.partner),
		matching: req.body.matching,
	})
	res.json({message: "ok"})
		
}
