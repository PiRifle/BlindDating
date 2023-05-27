import type { NextApiRequest, NextApiResponse } from 'next'
import { TrainingPair } from '../../../models/TrainingPair'
import { User, UserDocument } from '../../../models/User'
import { Request } from 'express'
import mongoose from 'mongoose'
type Data = {
    name: string
}

async function getRandomUser(client: UserDocument){
	console.log(await User.findById(client._id));

	//searches already picked users
	const a = await TrainingPair.aggregate([
		{
			$match: {
				user: (await User.findById(client._id))._id,
			},
		},
		{
			$group: {
				_id: "$user",
				partners: {
					$addToSet: "$partner",
				},
			},
		},
	]);
	console.log(a);
    let b;
	//gets first user not present in TrainingPairs
    if (a.length){
        b = await User.findOne({ _id: { $nin: a[0].partners }, "configuration.configured": true }, "_id profileInfo");
    }else{
        b = await User.findOne({ _id: { $nin: [client._id] }, "configuration.configured": true  }, "_id profileInfo");

    }
	// console.log(b)
	return b
}

export default async function handler(req: Request, res: NextApiResponse) {
    if (!req.user) return res.status(401).end();
    res.status(200).json(await getRandomUser(req.user));
}