import mongoose from "mongoose";
import { UserDocument } from "./User";

export type TrainingPairDocument = mongoose.Document & {
	user: UserDocument;
    partner: UserDocument;
    matching: boolean
};

const trainingPairSchema = new mongoose.Schema<TrainingPairDocument>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	partner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
    matching: Boolean
});

export const TrainingPair =
	(mongoose.models.TrainingPair as mongoose.Model<TrainingPairDocument>) ||
	mongoose.model<TrainingPairDocument>("TrainingPair", trainingPairSchema);
