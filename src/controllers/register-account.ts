import { z } from 'zod'
import { type Response } from 'express'
import { RegisterService } from '../services/register-account'
import { AccountsRepository } from '../repositories/accounts-repository'
import { fromZodError } from 'zod-validation-error'
import { CustomRequest } from '../middlewares/verify-jwt'

export async function registerAccount (req: CustomRequest, res: Response) {
  const accountsRepository = new AccountsRepository()
  const registerService = new RegisterService(accountsRepository)

  const accountSchema = z.object({
    branch: z.string()
      .regex(/^\d{3}$/, 'Branch does not meet the parameters.'),
    account: z.string()
      .regex(/^\d{8}$/, 'Account does not meet the parameters')
  }).safeParse(req.body)

  if (!accountSchema.success) {
    return res.status(400).send(fromZodError(accountSchema.error))
  } else {
    const { branch, account } = accountSchema.data
    const accountCreated = await registerService.execute({ branch, account, userId: req.id })

    return res.status(201).send(accountCreated)
  }
}
