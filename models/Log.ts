import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


export type LogDocument = mongoose.Document & {
	level: string;
	message: string;
	timestamp: Date;
	meta: any;
};

const LogSchema = new mongoose.Schema<LogDocument>({
	level: String,
	message: String,
	timestamp: Date,
	meta: mongoose.Schema.Types.Mixed,
}, {collection: "log"});


LogSchema.plugin(mongoosePaginate);
interface LogModel<T extends mongoose.Document> extends PaginateModel<T> {}

export const Log = (mongoose.models.Log ||
	mongoose.model<LogDocument>("Log", LogSchema)) as LogModel<LogDocument>;
