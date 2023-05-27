import RedisClient from "@redis/client/dist/lib/client";
import { Pair } from "../../../models/Pair"
import { User } from "../../../models/User";
import { GetServerSidePropsExpress } from "../../../types/next";
import { ObjectId } from "mongodb";

export default function handler(){
}

export const getServerSideProps: GetServerSidePropsExpress = async ({
	req,
	res,
    params
}) => {
	const pair = await Pair.findOne({_id: params.id, dateID: null, ended: false});
    if (pair){
        const partner = [pair.user.toString(), pair.partner.toString()].filter(a=>a!=req.user._id)
        const partnerObj = await User.findById(partner[0])
        // console.log(partnerObj)
        //@ts-ignore
        req.redisClient.rPush(`R${pair.round}REJECTED`, partner[0]);
        req.res.redirect("/home");
    }
	return { props: {} };
};