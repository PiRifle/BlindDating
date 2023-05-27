import mongoose from "mongoose";

export type HobbyCategoryDocument = mongoose.Document & {
    name: string
};

const hobbyCategorySchema = new mongoose.Schema<HobbyCategoryDocument>({
    name: String
});

export const HobbyCategory =
    (mongoose.models.HobbyCategory as mongoose.Model<HobbyCategoryDocument>) ||
    mongoose.model<HobbyCategoryDocument>("HobbyCategory", hobbyCategorySchema);
