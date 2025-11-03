import { OAuth2Client } from "google-auth-library";
import { Auth } from "./auth.js";
import jwt from "jsonwebtoken";
import { config } from '@dotenvx/dotenvx'
config()


const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export class Oauth {
    static client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "http://localhost:3000/oauth/google/callback"
    );

    static async google(req, res) {
        const authorizeUrl = Oauth.client.generateAuthUrl({
            access_type: "offline",
            scope: ["openid", "email", "profile"],
            prompt: "consent",
        });

        res.redirect(authorizeUrl);
    }

    static async googleCallback(req, res) {
        const { code } = req.query;
        if (!code) return res.status(400).send("Kein Code erhalten");

        try {
            const { tokens } = await Oauth.client.getToken(code);
            Oauth.client.setCredentials(tokens);

            const ticket = await Oauth.client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) return res.status(401).send("Ungültiges Token");


            const { sub, email, name, picture } = payload;

            if (!email) {
                return res.redirect(process.env.FAILED_LOGIN_NOT_ACCESSABLE || "/");
            }

            const authorized = await Auth.authorize(email);

            if (!authorized) {
                return res.redirect(process.env.FAILED_LOGIN_NOT_ACCESSABLE || "/");
            }

            const sessionJwt = jwt.sign(
                { sub, email, name, picture },
                process.env.SESSION_SECRET,
                { expiresIn: SESSION_TTL_SECONDS }
            );

            res.cookie("session", sessionJwt, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: SESSION_TTL_SECONDS * 1000,
                path: "/",
            });

            const to = process.env.AFTER_LOGIN_REDIRECT || "/";
            res.redirect(to);
        } catch (err) {
            console.error("Google Callback Error:", err);
            res.redirect((process.env.AFTER_LOGIN_FAIL_REDIRECT || "/") + "?login=failed");
        }
    }

    static async apple(req, res) {
        res.send("Apple Login noch nicht implementiert");
    }
}
