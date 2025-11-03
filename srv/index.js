import express from 'express'
import proxy from './routes/routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { db } from './db/connection.js'
import { config } from '@dotenvx/dotenvx'
config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())
app.use(proxy)

app.listen(PORT, () => {
    db
    console.log(`http://localhost:${PORT}`);
})