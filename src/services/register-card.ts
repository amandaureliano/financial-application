import { Type } from '@prisma/client'
import { type CardsRepository } from '../repositories/cards-repository'
import { AccountsRepository } from '../repositories/accounts-repository'
import { AppError } from '../errors/app-error'

interface ServiceRequest {
  type: Type
  number: string
  cvv: string
  accountId: string
}

export interface CardResponse {
  id: string
  createdAt: Date
  updatedAt: Date
  accountId?: string
  type: Type
  number: string
  cvv: string
}

export class RegisterService {
  constructor (
    private readonly cardsRepository: CardsRepository,
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({ type, number, cvv, accountId }: ServiceRequest): Promise<CardResponse> {
    const accountExist  = await this.accountsRepository.findById(accountId)

    if (!accountExist) {
      throw new AppError('Invalid action.')
    }

    if (type === Type.physical) {
      const count = await this.cardsRepository.countByType(accountId, Type.physical)

      if (count > 0) {
        throw new AppError('Invalid action.')
      }
    }

    const card = await this.cardsRepository.create({ type, number, cvv, accountId })
    card.number = card.number.slice(-4)
    delete card.accountId

    return card
  }
}
