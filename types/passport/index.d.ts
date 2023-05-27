import { UserDocument } from "../../models/User";
declare global {
    namespace Express {
        // type User = import("../../models/User").UserDocument;
        export interface User extends UserDocument {}
    }
}