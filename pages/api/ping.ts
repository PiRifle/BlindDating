import type { NextApiRequest, NextApiResponse } from "next";


export default function handler(
	req,
	res
) {
	res.status(200).send("pong");
}
