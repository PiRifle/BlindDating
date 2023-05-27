import mongoose, { PaginateModel } from "mongoose";
import { UserDocument } from "./User";
import mongoosePaginate from "mongoose-paginate-v2";


export type PairDocument = mongoose.Document & {
	user: UserDocument;
	partner: UserDocument;
	matching: boolean;
	round: number;
	rejects: boolean;
	dateID: string;
	cancelled: boolean;
	ended: boolean;
};

const PairSchema = new mongoose.Schema<PairDocument>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	partner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
    matching: Boolean,
    round: Number,
	rejects: Boolean,
	dateID: String,
	ended: Boolean,
	cancelled: Boolean

});
PairSchema.plugin(mongoosePaginate);
interface PairModel<T extends mongoose.Document> extends PaginateModel<T> {}

export const Pair: PairModel<PairDocument> = (mongoose.models.Pair || mongoose.model<PairDocument>("Pair", PairSchema)) as PairModel<PairDocument>;
