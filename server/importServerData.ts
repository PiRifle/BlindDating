import mongoose from "mongoose";
import {readFileSync} from "fs"
import { config as dotenv } from "dotenv";
import path from "path";
import { Hobby } from "../models/Hobby";
import hobbyData from "../docs/hobbies_converted.json"
import { importHobbyCategory } from "./importHobbyCategory";

dotenv({
	path: path.resolve(__dirname, "../.env"),
});

mongoose.connect(process.env.MONGO_URL);


export interface Hobby{
    value: string,
    label: string
}

export interface HobbyTheme{
    data: Hobby[],
    theme: string
}

hobbyData.forEach(importHobbyCategory)
