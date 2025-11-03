import { Router } from "express";
import { User } from "../controllers/user.js";

const user = Router();

user.get('/', User.Get)

export default user