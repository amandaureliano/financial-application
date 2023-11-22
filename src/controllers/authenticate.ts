import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { type Request, type Response } from 'express'
import { AuthenticateService } from '../services/authenticate'
import { UsersRepository } from '../repositories/users-repository'
import { env } from 'process'
import { AppError } from '../errors/app-error'

export async function authenticate (req: Request, res: Response) {
  const usersRepository = new UsersRepository()
  const authenticateService = new AuthenticateService(usersRepository)

  try {
    const registerBodySchema = z.object({
      document: z.string()
        .min(11, 'Document does not meet the parameters')
        .max(18, 'Document does not meet the parameters'),
      password: z.string()
    }).parse(req.body)

    const { user } = await authenticateService.execute(registerBodySchema)

    if (!env.JWT_SECRET) {
      throw new AppError('Invalid action.')
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '10min' })

    return res.status(200).send({ token: `Bearer ${token}` })
  } catch (error) {
    return res.status(400).send(error)
  }
}
