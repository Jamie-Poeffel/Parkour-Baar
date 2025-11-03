import { Router } from "express";
import oauth from "./oauth.js";
import auth from "./auth.js";
import user from "./user.js";
import { Message } from "../controllers/message.js";

const proxy = Router();

proxy.use('/oauth', oauth);
proxy.use('/auth', auth);
proxy.use('/user', user);
proxy.post('/message', Message.Send);

export default proxy