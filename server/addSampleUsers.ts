import mongoose from "mongoose"
import { config as dotenv } from "dotenv";
import path from "path";
import { Hobby } from "../models/Hobby";
import promptCfg from "prompt-sync"
import { User } from "../models/User";
import { makeID, getRandomInt, getMultipleRandom } from "../lib/helpers";
import { TrainingPair } from "../models/TrainingPair";
const prompt = promptCfg()

dotenv({
	path: path.resolve(__dirname, "../.env"),
});


async function main(){
    
    const userLen = prompt("How many users do you want to create");
    
    console.log('loading hobbies')
    const hobbies = await Hobby.find({})
    
    const users = []

    for (let i = 0; i <= userLen; i++){
        const usr = new User({
					discordID: makeID(18, "number"),
					accessToken: makeID(18, "string"),
					refreshToken: makeID(18, "string"),
					configuration: {
						step: 0,
						configured: true,
					},
					profileInfo: {
						name: `user #${i}`,
						surname: `#${i}`,
						age: getRandomInt(15, 20),
						gender: [Math.random(), Math.random()],
						school: "ZSEL",
						hobbies: getMultipleRandom(hobbies, getRandomInt(2, 19)).map(
							(hobby) => hobby.name
						),
						personality: {
							C: {
								score: getRandomInt(1, 50),
								count: 10,
								result: "neutral",
							},
							A: {
								score: getRandomInt(1, 50),
								count: 10,
								result: "neutral",
							},
							E: {
								score: getRandomInt(1, 50),
								count: 10,
								result: "neutral",
							},
							N: {
								score: getRandomInt(1, 50),
								count: 10,
								result: "neutral",
							},
							O: {
								score: getRandomInt(1, 50),
								count: 10,
								result: "neutral",
							},
						},
						datingPreference: [true, false][getRandomInt(0, 1)],
						genderPreference: [Math.random(), Math.random()],
					},
				});
        await usr.save()
        console.log("creates user", usr.profileInfo.name)
    }
    console.log("Created users")

    // const USRS = await User.find({})
    // USRS.forEach(user => {USRS.forEach(partner=>{
    //     console.log(
	// 				"creating pair",
	// 				user.profileInfo.name,
	// 				partner.profileInfo.name
	// 			);
        
    //     TrainingPair.create({user, partner, matching: false})
    // })})
}



mongoose.connect(process.env.MONGO_URL);

main()


