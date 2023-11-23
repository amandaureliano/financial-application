import { NextFunction, Request, Response } from "express";

export async function errorHandle (err: any, req: Request, res: Response, next: NextFunction) {
  if (err.message.includes('Unique')) {
    return res.status(400).send({ message: 'The resource already exists.'})
  }

  if (err.message) {
    return res.status(400).send({ message: err.message })
  }

  return res.status(500).send({ message: 'Internal server error.'})
}
