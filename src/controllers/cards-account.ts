import { type Request, type Response } from 'express'
import { z } from 'zod'
import { FetchService } from '../services/fetch-cards-by-account'
import { CardsRepository } from '../repositories/cards-repository'
import { fromZodError } from 'zod-validation-error'
import { AccountsRepository } from '../repositories/accounts-repository'

export async function cardsByAccount (req: Request, res: Response) {
  const cardsRepository = new CardsRepository()
  const accountsRepository = new AccountsRepository()
  const listService = new FetchService(cardsRepository, accountsRepository)

  const querySchema = z.object({
    itemsPerPage: z.string().optional(),
    currentPage: z.string().optional()
  })

  const { accountId } = z.object({
    accountId: z.string()
  }).parse(req.params)

  const result = querySchema.safeParse(req.query)

  if (!result.success) {
    return res.status(400).send(fromZodError(result.error))
  } else {
    const currentPage = Number(result.data.currentPage)
    const itemsPerPage = Number(result.data.itemsPerPage)

    const data = await listService.execute({ itemsPerPage, currentPage, accountId })

    return res.status(200).send(data)
  }
}
