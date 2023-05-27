
import { config as dotenv } from "dotenv";
import path from "path";
import nconf, { env } from "nconf";
import next from "next";
import nextBuild from "next/dist/build";
import express from "express";
import { createServer } from "http";
import { createClient } from "redis";
import compression from "compression";
import MongoStore from "connect-mongo";
import session from "express-session";
import findOrCreate from "mongoose-findorcreate";
import { setupPassport } from "../config/passport";
import bodyParser from "body-parser";
import { Subscription } from "../models/Subscription";
import { Hobby } from "../models/Hobby";
import { importHobbyCategory } from "./importHobbyCategory";
import webpush from "web-push";
import { Server } from "socket.io";
import { socketHandler } from "../lib/socket";
import type { PassportStatic } from "passport";
import agendash from "agendash";
import { Agenda, Job } from "agenda";
import { agendaHandler } from "../lib/agenda";
import morgan, { StreamOptions } from "morgan";
import winston from "winston";
import "winston-mongodb";
import mongoose from "mongoose";

if (!process.env.NEXT_BUILD) {
	dotenv({
		path: path.resolve(__dirname, "../.env"),
	});

	nconf.file({
		file: path.resolve(__dirname, "../config/config.json"),
	});
}

const dev = process.env.NODE_ENV !== "production";
const server = express();
const httpServer = createServer(server);

console.log(__dirname);
if (!process.env.NEXT_BUILD) {
	const levels = {
		error: 0,
		warn: 1,
		redis: 2,
		info: 3,
		http: 4,
		debug: 5,
	};

	const level = () => {
		const env = process.env.NODE_ENV || "development";
		const isDevelopment = env === "development";
		return isDevelopment ? "debug" : "warn";
	};

	const colors = {
		error: "red",
		warn: "yellow",
		info: "green",
		http: "magenta",
		redis: "cyan",
		debug: "white",
	};
	winston.addColors(colors);

	const stream: StreamOptions = {
		// Use the http severity
		write: (message) => {
			Logger.http(message);
		},
	};
	const skip = () => {
		const env = process.env.NODE_ENV || "development";
		return env !== "development";
	};
	const morganMiddleware = morgan(
		// Define message format string (this is the default one).
		// The message format is made from tokens, and each token is
		// defined inside the Morgan library.
		// You can create your custom token to show what do you want from a request.
		":method :url :status :res[content-length] - :response-time ms",
		// Options: in this case, I overwrote the stream and the skip logic.
		// See the methods above.
		{ stream, skip }
	);

	const passport = require("passport") as PassportStatic;
	setupPassport(process.env.PUBLIC_SERVER_URL);
	const client = createClient({ url: process.env.REDIS_URL });
	client.on("error", (err) => console.log("Redis Client Error", err));
	client.connect();
	const redisPUB = createClient({ url: process.env.REDIS_URL });
	redisPUB.on("error", (err) => console.log("Redis Client Error", err));
	redisPUB.connect();

	//redis message forwarding
	const io = new Server(httpServer);

	socketHandler(io);

	console.log(process.env.MONGO_URL);

	// mongoose.set("debug", true);
	mongoose.connect(process.env.MONGO_URL).then(() => {
		Hobby.countDocuments(async (err, count) => {
			console.log(`Found ${count} Hobbies`);
			if (process.env.UPDATE_HOBBIES) {
			}
			if (count == 0) {
				console.log(`Loading Hobbies`);
				const hobbies = (await import("../docs/hobbies_converted.json"))
					.default;
				hobbies.forEach((hobby) => {
					importHobbyCategory(hobby);
				});
				// importHobbyCategory
			}
		});
	});
	const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
	const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

	webpush.setVapidDetails(
		"mailto:piotrekpolocz@gmail.com",
		publicVapidKey,
		privateVapidKey
	);

	mongoose.plugin(findOrCreate);

	const transports = [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.errors({ stack: true }),
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
				winston.format.colorize({ all: true }),
				winston.format.printf(
					(info) =>
						`${info.timestamp} ${info.level}: ${info.message} ${
							info.stack || ""
						}`
				)
			),
		}),
		new winston.transports.File({
			filename: "logs/error.log",
			level: "error",
			format: winston.format.combine(
				winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
				winston.format.uncolorize(),
				winston.format.printf(
					(info) => `${info.timestamp} [${info.level}]: ${info.message}`
				)
			),
		}),
		// new winston.transports.File({ filename: "logs/all.log" }),
		//@ts-ignore
		new winston.transports.MongoDB({
			db: mongoose.connection.getClient().db(),
			level: "info",
		}),
	];
	const Logger = winston.createLogger({
		level: level(),
		levels,
		transports,
	});

	//@ts-ignore
	console.log = (...args) => Logger.info.call(Logger, args.join(" "));
	console.info = (...args) => Logger.info.call(Logger, args.join(" "));
	console.warn = (...args) => Logger.warn.call(Logger, args.join(" "));
	console.error = (...args) => Logger.error.call(Logger, args.join(" "));
	console.debug = (...args) => Logger.debug.call(Logger, args.join(" "));

	//@ts-ignore
	var agenda = new Agenda({ mongo: mongoose.connection.getClient().db() });

	agendaHandler(agenda, client);

	server.use(morganMiddleware);
	server.use(compression());
	server.use(express.json());
	server.use(bodyParser.urlencoded({ extended: false }));
	server.use(express.urlencoded({ extended: true }));
	const sessionM = session({
		resave: true,
		saveUninitialized: true,
		secret: process.env.SECRET_KEY,
		store: new MongoStore({
			mongoUrl: process.env.MONGO_URL,
		}),
	});

	redisPUB.PSUBSCRIBE("*", (message, channel) => {
		io.emit(channel, message);
		//@ts-ignore
		Logger.redis(`${channel}: ${message}`);
	});

	server.use(sessionM);

	const wrap = (middleware) => (socket, next) =>
		middleware(socket.request, {}, next);

	// io.use(wrap(sessionM));
	// io.use((socket, next) => {
	// 	//@ts-ignore
	// 	const session = socket.request.session;
	// 	if (session && session.authenticated) {
	// 		next();
	// 	} else {
	// 		next(new Error("unauthorized"));
	// 	}
	// });
	server.use(passport.initialize());
	server.use(passport.session());
	server.use((req, res, next) => {
		//@ts-ignore
		req.redisClient = client;
		next();
	});

	//agenda
	server.use(
		"/scheduler",
		function (req, res, next) {
			if (!req.user || !req.user.isAdmin) {
				res.redirect("/");
			} else {
				next();
			}
		},
		agendash(agenda)
	);

	//WEB PUSH
	server.post("/subscribe", async (req, res, next) => {
		if (!req.user) return res.sendStatus(401);

		const newSubscription = await Subscription.updateMany(
			{ endpoint: req.body.endpoint, user: req.user._id },
			{ ...req.body, user: req.user._id },
			{ upsert: true }
		);
		res.send(200);
	});
	const nextApp = next({ dev });
	const nextHandler = nextApp.getRequestHandler();
	server.get(
		"/auth/discord",
		passport.authenticate("discord", function (err, user, info) {
			console.warn(err);
		})
	);
	server.get("/logout", (req, res, next) => {
		req.logout((err) => (err ? next(err) : res.redirect("/")));
	});
	server.get(
		"/api/auth/callback/discord",
		// (req, res, next) => {
		// 	console.log(req);
		// 	next();
		// },
		passport.authenticate("discord", {
			failureRedirect: "/",
			successRedirect: "/home",
		})
	);

	server.all("*", (req, res) => nextHandler(req, res));

	nextApp.prepare().then(() => {
		console.log("NextJS started");
		agenda.start();

		httpServer.listen(process.env.PORT, async () => {
			console.log(`Server listening on ${process.env.PORT}...`);
		});
	});
} else {
	// console.log(httpServer);
	nextBuild(path.join(__dirname, "../../"), null, true, true);
	// 				httpServer.listen(process.env.PORT, async () => {
	// 					console.log('NextJS is now building...');
	// 					console.log(path.join(__dirname, "../../"));
	// 					process.exit();
	//   });
}
