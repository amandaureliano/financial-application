import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { routes } from './controllers/routes'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(routes)
