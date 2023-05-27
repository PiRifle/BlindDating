import { Request, Response } from "express";

export default async function handler(
	req: Request,
	res: Response
) {
	const loggedIn = req.user ? true : false;
	const name =
		(req.user && req.user.profileInfo && req.user.profileInfo.name) ||
		(req.user && req.user.profile && req.user.profile.name) ||
		"";
	const profile = loggedIn
		? {
				name: name,
				profilePic: `https://cdn.discordapp.com/avatars/${req.user.discordID}/${req.user.profile.avatar}.webp`,
		  }
		: {};

	loggedIn ? res.json(profile) : res.status(401).end();
}
