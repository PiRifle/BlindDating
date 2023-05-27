export const ansiToHtml = (str: string) => {
	const codes = {
		reset: [0, 0],
		bold: [1, 22],
		dim: [2, 22],
		italic: [3, 23],
		underline: [4, 24],
		inverse: [7, 27],
		hidden: [8, 28],
		strikethrough: [9, 29],

		black: [30, 39],
		red: [31, 39],
		green: [32, 39],
		yellow: [33, 39],
		blue: [34, 39],
		magenta: [35, 39],
		cyan: [36, 39],
		white: [37, 39],
		gray: [90, 39],

		bgBlack: [40, 49],
		bgRed: [41, 49],
		bgGreen: [42, 49],
		bgYellow: [43, 49],
		bgBlue: [44, 49],
		bgMagenta: [45, 49],
		bgCyan: [46, 49],
		bgWhite: [47, 49],
	};

	let newString = "";
	let color;
	let background;
	let style = [];
	let regex = new RegExp(/\u001b\[(\d+)m/g);
	let match;

	console.log(str.match(regex))

	// while ((match = regex.exec(str))) {
	// 	newString += str.substring(0, match.index);
	// 	str = str.substring(match.index + match[0].length);
	// 	console.log(match);
		
	// 	for (const code in codes) {
	// 		if (codes[code][0] === +match[1]) {
	// 			if (code === "reset") {
	// 				color = null;
	// 				background = null;
	// 				style = [];
	// 			} else if (code.startsWith("bg")) {
	// 				background = code;
	// 			} else {
	// 				color = code;
	// 			}

	// 			style.push(code);
	// 		}
	// 	}

	// 	if (color || background || style.length > 0) {
	// 		newString += `<span style="${color ? `color: ${color};` : ""} ${
	// 			background ? `background-color: ${background};` : ""
	// 		}">`;
	// 	}
	// }

	// newString += str;

	// for (const s of style.reverse()) {
	// 	newString += `</span>`;
	// }

	return newString;
};

// export const logger = () => {
// 	const { createLogger, transports } = require("winston");
// 	createLogger({
// 		transports: [
// 			new transports.File({
// 				filename: "logs.html",
// 				formatter: (options) => {
// 					const level = options.level.toUpperCase();
// 					const message = ansiToHtml(options.message);
// 					return `<p>${level}: ${message}</p>`;
// 				},
// 			}),
// 		],
// 	});
// };
