// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";

type Data = {
	name: string;
};

export default passport.authenticate('discord', { failureRedirect: '/', successRedirect: '/'})

