import FormData from "form-data";
import { Readable } from "stream";

export async function compile(preferences: { [key: string]: string[] }): Promise<{
	matches: { [key: string]: string };
	rejected: string[];
}> {
	const fetch = require("node-fetch");
	const form = new FormData();
	form.append(
		"prefs",
		Readable.from(JSON.stringify(preferences)),
		"params.json"
	);
	const res = await fetch(`${process.env.SRP_URL}match`, {
		method: "POST",
		body: form,
	});
	try {
		return await res.json();
	} catch {
		return new Promise((resolve, reject) => resolve({ matches: {}, rejected: Object.keys(preferences) }));
	}
}