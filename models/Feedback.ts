import mongoose from "mongoose";
import { PairDocument } from "./Pair";
import { UserDocument } from "./User";

export type FeedbackDocument = mongoose.Document & { //Moongoose deez nuts in your mouth @StillTree
	date: PairDocument;
	user: UserDocument;
	likingPersonality: number;
	sameInterests: number;
	sexualityPreference: number;
	partnerExpectations: number;
	partnerExpectationsComment: string;
	firstImpressions: number;
	partnerProblems: number;
	satisfyingRelationship: number;
	futurePlans: number;
};


const FeedbackSchema = new mongoose.Schema<FeedbackDocument>({
	date: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Pairs",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
	},
	likingPersonality: Number,
	sameInterests: Number,
	sexualityPreference: Number,
	partnerExpectations: Number,
	partnerExpectationsComment: String,
	firstImpressions: Number,
	partnerProblems: Number,
	satisfyingRelationship: Number,
	futurePlans: Number
});

export const Feedback = (mongoose.models.Feedback ||
	mongoose.model<FeedbackDocument>(
		"Feedback",
		FeedbackSchema
	)) as mongoose.Model<FeedbackDocument>;
