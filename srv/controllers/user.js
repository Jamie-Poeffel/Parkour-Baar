import { findUserByEmail } from "../models/userModel.js";

export class User {
    static async Get(req, res) {
        const { email } = req.query;

        if (!email) {
            return res.send("Error")
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.json({ "error": "User not found" })
        }

        return res.json(user)
    }
}