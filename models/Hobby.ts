import mongoose from "mongoose";
import { HobbyCategoryDocument } from "./HobbyCategories";

export type HobbyDocument = mongoose.Document & {
	name: string,
	description: string,
	category: HobbyCategoryDocument,
};

const hobbySchema = new mongoose.Schema<HobbyDocument>({
	name: String,
	description: String,
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "HobbyCategory",
	},
});

export const Hobby =
	mongoose.models.Hobby as mongoose.Model<HobbyDocument> || mongoose.model<HobbyDocument>("Hobby", hobbySchema);
