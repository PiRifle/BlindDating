import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { createClient } from "redis";
import { User, UserDocument } from "../models/User";
import refresh from "passport-oauth2-refresh";
import dynamic from "next/dynamic";

var scopes = ["identify", "email", "guilds.join"];

export function isAdmin(req, res) {
	!(req.user && req.user.isAdmin) && res.redirect("/");
}

export function isLoggedIn(req, res) {
	!req.user && res.redirect("/");
	req.user && req.user.isAdmin && res.redirect("/admin");
}

export function isJoinedServer(req: Express.Request, res) {
	!(
		req.user &&
		req.user.configuration &&
		req.user.configuration.joinedServer
	) && res.redirect("/join");
}

export function isRegistrationCompleted(req, res) {
	!(req.user && req.user.configuration && req.user.configuration.configured) &&
		res.redirect("/start");
}

export function sendToTraining(req, res) {
	process.env.TRAINING_MODE == "true" && res.redirect("/trainer");
}


async function refreshToken(refreshToken: string) {
	const response = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		body: new URLSearchParams({
			client_id: process.env.DISCORD_ID,
			client_secret: process.env.DISCORD_SECRET,
			grant_type: "refresh_token",
			refresh_token: refreshToken,
		}),
	});
	const data: {
		access_token: string;
		expires_in: number;
		refresh_token: string;
		scope: string;
		token_type: string;
	} = await response.json();

	return data;
}

export function setupPassport(callbackURL) {
	console.log("called Setup Passport");
	
	const DISCORD_ID: string = process.env.DISCORD_ID;
	const DISCORD_SECRET: string = process.env.DISCORD_SECRET;
	console.log("setting up DiscordStrategy");
	
	global.strategyTest = new DiscordStrategy(
		{
			clientID: DISCORD_ID,
			clientSecret: DISCORD_SECRET,
			callbackURL: `${callbackURL}/api/auth/callback/discord`,
			scope: scopes,
		},
		function (accessToken, refreshToken, profile, cb) {
			User.findOne(
				{ discordID: profile.id },
				async function (err, user: UserDocument) {
					if (!user) {
						if (await User.countDocuments() < 1000){
							user = new User({
								discordID: profile.id,
								accessToken,
								refreshToken,
							});
							await user.save();
						}else{
							return cb(null, null, {msg: "Rejestracja się zakończyła"})
						}
					}else{
						user.accessToken = accessToken,
						user.refreshToken = refreshToken,
						await user.save();
					}
					user.profile = profile;
					return cb(err, user);
				}
			);
		}
	);
	console.log("setting up Discord");
	
	passport.serializeUser<any, any>(async (req, user, done) => {
		const data = await req.redisClient.get(user.discordID);
		let profile;

		if (!data) {
			profile = await getUserAsync(user.accessToken, user.refreshToken).catch(err=>err && req.logout(err=>null))
			if (profile)
				await req.redisClient.setEx(
					user.discordID,
					3600,
					JSON.stringify(profile)
				);
		} else {
			profile = JSON.parse(data);
		}

		user.profile = profile;
		(await import("./admin.json")).default.includes(user.discordID) &&
			(user.isAdmin = true);

		done(undefined, user);
	});

	passport.deserializeUser(async (req, id, done) => {
		//@ts-ignore
		User.findById(id)
			.lean()
			//@ts-ignore
			.exec(async (err: NativeError, user: UserDocument) => {
				if (!user) req.logout((err) => (err ? done(err) : done(null, null)));
				const client = createClient({ url: process.env.REDIS_URL });
				client.connect();
				const data = await client.get(user.discordID);
				let profile;
				if (!data) {
					profile = await getUserAsync(
						user.accessToken,
						user.refreshToken
					).catch((err) => err && req.logout(err=>null));
					if (profile)
					await client.setEx(user.discordID, 3600, JSON.stringify(profile));
				} else {
					profile = JSON.parse(data);
				}
				user.profile = profile;
				(await import("./admin.json")).default.includes(user.discordID) &&
					(user.isAdmin = true);
				client.disconnect();
				done(err, user);
			});
	});

	passport.use(global.strategyTest);

	refresh.use(global.strategyTest);
}

export async function getUserAsync(accessToken, refreshTokenData) {
	try {
		return await getUserDataAsync(accessToken);
	} catch (err) {
		const refresh = await refreshToken(refreshTokenData);
		await User.updateOne(
			{ accessToken: accessToken },
			{
				accessToken: refresh.access_token,
				refreshToken: refresh.refresh_token,
			}
		);
		return await getUserDataAsync(accessToken);
	}
}

export function getUserDataAsync(accessToken) {
	return new Promise((resolve, reject) => {
		global.strategyTest.userProfile(accessToken, (err, profile) => {
			if (err) reject(err);
			resolve(profile);
		});
	});
}
