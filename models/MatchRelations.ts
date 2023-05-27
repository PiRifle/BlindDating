import mongoose from "mongoose";
import { UserDocument } from "./User";

export type MatchRelationsDocument = mongoose.Document & {
	user: UserDocument;
	partners: { user: UserDocument; score: number }[];
};

const MatchRelationsSchema = new mongoose.Schema<MatchRelationsDocument>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	partners: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			score: Number,
		},
	],
});

export const MatchRelations =
	(mongoose.models.MatchRelations as mongoose.Model<MatchRelationsDocument>) ||
	mongoose.model<MatchRelationsDocument>(
		"MatchRelations",
		MatchRelationsSchema
	);
