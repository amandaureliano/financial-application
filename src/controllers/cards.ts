import { Request, Response } from 'express'
import { z } from 'zod'
import { FetchService } from '../services/fetch-cards'
import { CardsRepository } from '../repositories/cards-repository'
import { fromZodError } from 'zod-validation-error'

export async function cards (req: Request, res: Response) {
  const cardsRepository = new CardsRepository()
  const listService = new FetchService(cardsRepository)

  const querySchema = z.object({
    itemsPerPage: z.string().optional(),
    currentPage: z.string().optional()
  })

  const result = querySchema.safeParse(req.query)

  if (!result.success) {
    return res.status(400).send(fromZodError(result.error))
  } else {
    const currentPage = Number(result.data.currentPage)
    const itemsPerPage = Number(result.data.itemsPerPage)

    const data = await listService.execute({ currentPage, itemsPerPage, userId: req.userId })

    return res.status(200).send(data)
  }
}
