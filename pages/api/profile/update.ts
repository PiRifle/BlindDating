// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "express";
import { School } from "../../../types/next";
import { User } from "../../../models/User";
import { body, check, validationResult } from "express-validator";
import { schools } from "../schools";
import { Hobby } from "../../../models/Hobby";
import { compileUserRelations } from "../../../lib/rpc";

export default async function handler(req: Request, res: NextApiResponse) {
	await body("name").isString().isLength({ max: 99 }).optional().run(req);
	await body("surname").isString().isLength({ max: 99 }).optional().run(req);
	await body("age").isInt({ gt: 14, lt: 100 }).optional().run(req);
	await body("gender").isArray({ max: 2, min: 2 }).optional().run(req);
	await body("school")
		.isIn(schools.map((value) => value.code))
		.optional()
		.run(req);
	await body("hobbies").isArray().optional().run(req);
	await body("genderPreference")
		.isArray({ max: 2, min: 0 })
		.optional()
		.run(req);
	await body("datingPreference").isBoolean().optional().run(req);
	await body("msg").isString().isLength({ max: 300 }).optional().run(req);
	if (!validationResult(req).isEmpty()) return res.status(400).end();
	if (!req.user) return res.status(401).end();
	// console.log(req.body);
	// if()
	// if (req.body.config.hobbies && req.body.config.hobbies.length) {
	//     await Hobby.find({ name: { $in: req.body.config.hobbies } })

	// }
	// console.log(req.body.config.genderPreference && req.body.config.datingPreference, "preferences");
	if ((req.body.age as string).toString().includes("e"))
		return res.json({
			status: "Jak to uczyniłeś",
		});
	if (req.body.step >= 2) {
		const user = await User.findOne({ discordID: req.user.discordID });
		const profInfo = user.profileInfo;
		let validation = true;
		profInfo.age >= 15 && profInfo.age <= 99
			? (validation = true)
			: (validation = false);
		typeof profInfo.name == typeof "" && typeof profInfo.surname == typeof ""
			? (validation = true)
			: (validation = false);
		typeof req.body.msg == typeof ""
			? (validation = true)
			: (validation = false);
		profInfo.gender.length == 2 && req.body.genderPreference.length == 2
			? (validation = true)
			: (validation = false);
		profInfo.school.length > 0 &&
		profInfo.hobbies.every(async (a) => await Hobby.findOne({ name: a }))
			? (validation = true)
			: (validation = false);
		profInfo.personality &&
		Object.keys(profInfo.personality).every((i) =>
			["A", "E", "C", "O", "N"].includes(i)
		)
			? (validation = true)
			: (validation = false);
		
		//update last step and setup profile as configured
		user.profileInfo.genderPreference = req.body.genderPreference;
		user.profileInfo.datingPreference = req.body.datingPreference;
		user.profileInfo.msg = req.body.msg
		user.configuration.configured = validation;
		user.configuration.step = validation ? 0 : 3;
        
		if (!validation) {
            return res.json({ status: "bad config", nextStep: 0 });
        } else {
            await user.save((e) => {
                // console.log("validation", validation);
				// console.log(e);
				// if (e) return res.status(500).end();
				compileUserRelations(user._id).catch(console.error);
				res.json({ status: "ok", nextStep: 3 });
			});
            return null
		}
	}
	// console.log();
	await User.updateOne(
		{ discordID: req.user.discordID },
		{
			profileInfo: { ...req.body, step: undefined },
			"configuration.step": req.body.step >= 2 ? 0 : req.body.step + 1,
		}
	).exec();
	return res.json({
		status: "ok",
		nextStep: req.body.step + 1,
	});
}
