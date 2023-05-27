import mongoose, { PaginateModel } from "mongoose";
import type Strategy from "passport-discord";
import { stringify } from "querystring";
import mongoosePaginate from "mongoose-paginate-v2";

export interface Personality {
	[key: string]: {
		score: number;
		count: number;
		result: string;
	};
}

export type ProfileInfo = {
	name?: string;
	surname?: string;
	age?: number;
	gender?: number[];
	school?: string;
	hobbies?: string[];
	personality?: Personality;
	datingPreference?: boolean;
	genderPreference?: number[];
	msg: string;
};

export interface UserDocument extends mongoose.Document {
	banned: boolean;
	banMessage: string;
	discordID: string;
	accessToken: string;
	refreshToken: string;
	profile?: Strategy.Profile;
	profileInfo: ProfileInfo;
	isAdmin: boolean;
	sendInvite: boolean;
	configuration: {
		step: Number;
		configured: boolean;
		push: boolean;
		joinedServer: boolean;
	};
};

const userSchema = new mongoose.Schema<UserDocument>(
	{
		banned: Boolean,
		banMessage: String,
		discordID: String,
		accessToken: String,
		refreshToken: String,
		configuration: {
			step: Number,
			configured: Boolean,
			push: Boolean,
			joinedServer: Boolean,
		},
		sendInvite: Boolean,
		profileInfo: {
			msg: String,
			name: String,
			surname: String,
			age: Number,
			gender: [{ type: Number }],
			school: String,
			hobbies: [{ type: String }],
			personality: mongoose.Schema.Types.Mixed,
			datingPreference: Boolean,
			genderPreference: [{ type: Number }],
		},
	},
	{ timestamps: true }
);

userSchema.plugin(mongoosePaginate);
userSchema.index({
	"discordID": "text",
	"profileInfo.name": "text",
	"profileInfo.surname": "text",
	"profileInfo.age": "text",
	"profileInfo.school": "text",
});

interface UserModel<T extends mongoose.Document> extends PaginateModel<T> { }


export const User: UserModel<UserDocument> = (mongoose.models.User || mongoose.model("User", userSchema)) as UserModel<UserDocument>
