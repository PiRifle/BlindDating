import mongoose from "mongoose";
import {
	isLoggedIn,
	isJoinedServer,
	isRegistrationCompleted,
} from "../../../config/passport";
import { Pair } from "../../../models/Pair";
import { GetServerSidePropsExpress } from "../../../types/next";
import { body, check, validationResult } from "express-validator";
import { NextApiResponse } from "next";
import { Feedback } from "../../../models/Feedback";
import { ObjectId } from "mongodb";


export default async function handler(
	req,
	res: NextApiResponse,
    
) {
	await body("likingPersonality")
		.isInt({ max: 10, min: 1 })
		.optional()
		.run(req);
	await body("sameInterests").isInt({ max: 10, min: 1 }).optional().run(req);
	await body("sexualityPreference")
		.isInt({ max: 10, min: 1 })
		.optional()
		.run(req);
	await body("partnerExpectations")
		.isInt({ max: 10, min: 1 })
		.optional()
		.run(req);
	await body("partnerExpectationsComment")
		.isString()
		.isLength({ max: 199 })
		.optional()
		.run(req);
	await body("firstImpressions").isInt({ max: 10, min: 1 }).optional().run(req);
	await body("partnerProblems").isInt({ max: 10, min: 1 }).optional().run(req);
	await body("satisfyingRelationship")
		.isInt({ max: 10, min: 1 })
		.optional()
		.run(req);
	await body("futurePlans").isInt({ max: 10, min: 1 }).optional().run(req);
	if (!validationResult(req).isEmpty()) return res.status(403).end();
    if (!req.user) return res.status(401).end();

    try{
        const fd = new Feedback({...req.body, user: req.user, date: new ObjectId(req.query.id)})
        await fd.save()
        res.redirect("/home")
    }catch{
        res.status(403).end();
    }
    
};
