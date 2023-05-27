import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "express";
import { User } from "../../../models/User";


export default async function handler(req: Request, res: NextApiResponse) {
        const u = await User.findOne({ discordID: req.user.discordID })
        u.sendInvite = true;
        await u.save();

        return res.json({
                status: "sent",
        });
}