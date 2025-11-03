import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";
import { config } from '@dotenvx/dotenvx'
config()

export class Auth {
    static check(req, res) {
        try {
            const token = req.cookies.session;
            console.log(token)
            if (!token) return res.sendStatus(401);

            const decoded = jwt.verify(token, process.env.SESSION_SECRET);
            if (decoded) {
                return res.sendStatus(204);
            } else {
                return res.sendStatus(401);
            }
        } catch (err) {
            return res.sendStatus(401);
        }
    }

    static async authorize(email) {
        const user = await findUserByEmail(email.toLowerCase());
        return !!user;
    }
}
