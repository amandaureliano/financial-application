import { NextFunction, Request, Response } from 'express'
import { env } from 'process'
import jwt from 'jsonwebtoken'

export interface CustomRequest extends Request {
  id: string
}

export async function verifyJWT(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token || !env.JWT_SECRET) {
      throw new Error()
    }

    req.id = jwt.verify(token, env.JWT_SECRET).id

    next()
  } catch (error) {
    return res.status(401).send({ message: 'Not authorized.' })
  }
}
