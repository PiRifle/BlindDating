import { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
	const loggedIn = req.user ? true : false;
	res.json(loggedIn);
}
