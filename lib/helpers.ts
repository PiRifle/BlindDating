export function makeID(length: number, type: string) {
	var result = "";
	var characters;
	switch (type) {
		case "string":
			characters =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			break;
		case "number":
			characters = "1234567890";
	}
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getMultipleRandom(arr, num) {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());

	return shuffled.slice(0, num);
}

export function twoDDiff(missingPairs: string[][], pairs: string[][]) {
	const filteredSet = missingPairs.filter((pair) => pair.length == 1);
	const mappedFittingPair = filteredSet.map((missing) =>
		pairs.filter((pair) => pair.includes(missing[0])).flat()
	);
	return filteredSet
		.map((missing, idx) =>
			mappedFittingPair[idx].filter((x) => !missing.includes(x))
		)
		.flat();
}
