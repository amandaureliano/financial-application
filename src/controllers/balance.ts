import { type Request, type Response } from 'express'
import { z } from 'zod'
import { GetService } from '../services/get-balance'
import { fromZodError } from 'zod-validation-error'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { AccountsRepository } from '../repositories/accounts-repository'

export async function balance (req: Request, res: Response) {
  const transactionsRepository = new TransactionsRepository()
  const accountsRepository = new AccountsRepository()
  const detailService = new GetService(transactionsRepository, accountsRepository)

  const accountIdSchema = z.object({
    accountId: z.string()
  }).safeParse(req.params)

  if (!accountIdSchema.success) {
    return res.status(400).send(fromZodError(accountIdSchema.error))
  } else {
    const data = await detailService.execute(accountIdSchema.data)

    return res.status(200).send(data)
  }
}
