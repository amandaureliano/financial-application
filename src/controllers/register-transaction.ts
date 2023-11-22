import { z } from 'zod'
import { type Request, type Response } from 'express'
import { RegisterService } from '../services/register-transaction'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { fromZodError } from 'zod-validation-error'
import { AccountsRepository } from '../repositories/accounts-repository'

export async function registerTransaction (req: Request, res: Response) {
  const transactionsRepository = new TransactionsRepository()
  const accountsRepository = new AccountsRepository()
  const registerService = new RegisterService(transactionsRepository, accountsRepository)

  const transactionSchema = z.object({
    value: z.number(),
    description: z.string()
  }).safeParse(req.body)

  const { accountId } = z.object({
    accountId: z.string()
  }).parse(req.params)

  if (!transactionSchema.success) {
    return res.status(400).send(fromZodError(transactionSchema.error))
  } else {
    const { value, description } = transactionSchema.data
    const transaction = await registerService.execute({ value, description, accountId })

    return res.status(201).send(transaction)
  }
}
