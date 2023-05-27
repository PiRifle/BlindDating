import mongoose from "mongoose";
import { UserDocument } from "./User";

export type SubscriptionDocument = mongoose.Document & {
    endpoint: string
    expirationTime: number
    keys: {
        p256h: string
        auth: string
    }
    user: UserDocument
};

const subscriptionSchema = new mongoose.Schema<SubscriptionDocument>({
	endpoint: String,
	expirationTime: Number,
	keys: {
		p256dh: String,
		auth: String,
	},
    user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

export const Subscription =
	(mongoose.models.Subscription as mongoose.Model<SubscriptionDocument>) ||
	mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema);
