function getRandomInt(max: number) {
	return Math.floor(Math.random() * max);
}

async function sendRPC(execFunction: string, execArguments: any[] | {}) {
	const ID = getRandomInt(10000);
	const payload = {
		method: execFunction,
		params: execArguments,
		jsonrpc: "2.0",
		id: ID,
	};
	const request = await fetch(process.env.AI_URL, {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (request.status != 200) return null;
	const response: { result: any; id: number; jsonrpc: string } =
		await request.json();

	return response;
}

export async function checkUserRelations(): Promise<{ message: string }> {
	return (await sendRPC("integrity_check", []))?.result;
}

export async function compileUserRelations(userID: string): Promise<void> {
	const response = (await sendRPC("generate_branch", [userID]))?.result;
	if (response.message == "ok") {
	} else {
		if (response.message == "bad_id") {
			throw new Error("The provided value couldn't be cast to an ObjectID");
		}
		if (response.message == "not_found") {
			throw new Error("User not found");
		}
	}
}


export async function generateRelations(): Promise<string> {
	return (await sendRPC("generate_branch", {}))?.result as never;
}
