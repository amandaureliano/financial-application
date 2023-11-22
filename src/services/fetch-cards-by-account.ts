import { AppError } from '../errors/app-error'
import { AccountsRepository } from '../repositories/accounts-repository'
import { type CardsRepository } from '../repositories/cards-repository'

interface ServiceRequest {
  accountId: string,
  currentPage: number,
  itemsPerPage: number
}

export interface ServiceResponse {
  cards: object
  pagination: object
}

export class FetchService {
  constructor (
    private readonly cardsRepository: CardsRepository,
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({ itemsPerPage, currentPage, accountId }: ServiceRequest): Promise<ServiceResponse> {
    const accountExist  = await this.accountsRepository.findById(accountId)

    if (!accountExist) {
      throw new AppError('Invalid action.')
    }

    itemsPerPage = !itemsPerPage ? 10 : itemsPerPage
    currentPage = !currentPage ? 1 : currentPage

    const take = itemsPerPage
    const skip = (itemsPerPage * currentPage) - itemsPerPage

    const { cards, totalCount } = await this.cardsRepository.findAll(accountId, take, skip)
    const pageCount = Math.ceil(totalCount / itemsPerPage)

    cards.forEach((card) => {
      card.number = card.number.slice(-4)
    })

    return { cards, pagination: { totalCount, itemsPerPage, currentPage, pageCount } }
  }
}
