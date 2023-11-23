import { NextFunction, Request, Response } from 'express'
import { env } from 'process'
import jwt from 'jsonwebtoken'

declare module 'jsonwebtoken' {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
      id: string
  }
}

export async function verifyJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token || !env.JWT_SECRET) {
      throw new Error()
    }

    const jwtPayload = <jwt.UserIDJwtPayload>jwt.verify(token, env.JWT_SECRET)
    req.userId = jwtPayload.id

    next()
  } catch (error) {
    return res.status(401).send({ message: 'Not authorized.' })
  }
}
