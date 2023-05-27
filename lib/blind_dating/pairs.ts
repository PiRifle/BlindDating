import { MatchRelationsDocument } from "../../models/MatchRelations";
import { Pair } from "../../models/Pair";
import {compile} from "../stable-roommates"

// export async function createPairs(matchings: MatchRelationsDocument[]){
//     const formattedMatching = matchings.map(matchR=>([(matchR.user).toString(), matchR.partners.map(partners=>partners.toString())]))
//     // console.log(formattedMatching);
//     const a = import("E:/data.json")
//     console.log(
//         await compile((await a).default)
//     );
// }