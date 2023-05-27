const missingPairs = [["a", "b"], ["c"], []]
const missingUsers = missingPairs.flat()
const pairs = [["a", "b"], ["c", "d"], ["e", "f"]]

function twoDDiff(missingPairs: string[][], pairs: string[][]) {
	const filteredSet = missingPairs.filter((pair) => pair.length == 1);
	const mappedFittingPair = filteredSet.map((missing) =>
		pairs.filter((pair) => pair.includes(missing[0])).flat()
	);
	// console.log(mappedFittingPair);

	return filteredSet
		.map((missing, idx) =>
			mappedFittingPair[idx].filter((x) => !missing.includes(x))
		)
		.flat();
}

test("list rest of users", ()=>{
    const result = twoDDiff(missingPairs, pairs)
    expect(result).toEqual(["d"])
})

test("list rest of users (bigger set)", () => {
	const result = twoDDiff(missingPairs, pairs);
	expect(result).toEqual(["d"]);
});

export {}