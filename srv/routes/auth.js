import { Router } from "express";
import { Auth } from "../controllers/auth.js";

const auth = Router()

auth.head('/check', Auth.check)

export default auth;