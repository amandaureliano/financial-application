import { z } from 'zod'
import { type Request, type Response } from 'express'
import { RegisterService } from '../services/register-card'
import { CardsRepository } from '../repositories/cards-repository'
import { Type } from '@prisma/client'
import { fromZodError } from 'zod-validation-error'
import { AccountsRepository } from '../repositories/accounts-repository'

export async function registerCard (req: Request, res: Response) {
  const cardsRepository = new CardsRepository()
  const accountsRepository = new AccountsRepository()
  const registerService = new RegisterService(cardsRepository, accountsRepository)

  const cardSchema = z.object({
    type: z.nativeEnum(Type),
    number: z.string()
      .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Number does not meet the parameters.'),
    cvv: z.string()
      .regex(/^\d{3}$/, 'Cvv does not meet the parameters')
  }).safeParse(req.body, req.params)

  const { accountId } = z.object({
    accountId: z.string()
  }).parse(req.params)

  if (!cardSchema.success) {
    return res.status(400).send(fromZodError(cardSchema.error))
  } else {
    const { type, number, cvv } = cardSchema.data
    const card = await registerService.execute({ type, number, cvv, accountId })

    return res.status(201).send(card)
  }
}
