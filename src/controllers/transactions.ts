import { type Request, type Response } from 'express'
import { z } from 'zod'
import { FetchService } from '../services/fetch-transactions'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { fromZodError } from 'zod-validation-error'
import { AccountsRepository } from '../repositories/accounts-repository'

export async function transactions (req: Request, res: Response) {
  const transactionsRepository = new TransactionsRepository()
  const accountsRepository = new AccountsRepository()
  const listService = new FetchService(transactionsRepository, accountsRepository)

  const querySchema = z.object({
    itemsPerPage: z.string().optional(),
    currentPage: z.string().optional(),
    search: z.string().optional(),
    type: z.enum(['credit', 'debit']).optional()
  })

  const { accountId } = z.object({
    accountId: z.string()
  }).parse(req.params)

  const result = querySchema.safeParse(req.query)

  if (!result.success) {
    return res.status(400).send(fromZodError(result.error))
  } else {
    const { search, type } = result.data
    const currentPage = Number(result.data.currentPage)
    const itemsPerPage = Number(result.data.itemsPerPage)

    const data = await listService.execute({ currentPage, itemsPerPage, search, type, accountId })

    return res.status(200).send(data)
  }
}
