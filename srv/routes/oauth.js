import { Router } from "express";
import { Oauth } from "../controllers/oauth.js";

const oauth = Router()

oauth.get('/google', Oauth.google)
oauth.get('/google/callback', Oauth.googleCallback)
oauth.get('/apple', Oauth.apple)

export default oauth;