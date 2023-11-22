import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { type Request, type Response } from 'express'
import { RegisterService } from '../services/register-user'
import { UsersRepository } from '../repositories/users-repository'

export async function registerPeople (req: Request, res: Response) {
  const usersRepository = new UsersRepository()
  const registerService = new RegisterService(usersRepository)

  const userSchema = z.object({
    name: z.string(),
    document: z.string()
      .regex(/^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, 'Document does not meet the parameters.'),
    password: z.string()
  }).safeParse(req.body)

  if (!userSchema.success) {
    return res.status(400).send(fromZodError(userSchema.error))
  } else {
    const user = await registerService.execute(userSchema.data)

    return res.status(201).send(user)
  }
}
