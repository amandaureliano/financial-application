import { type CardsRepository } from '../repositories/cards-repository'

interface ServiceRequest {
  userId: string,
  currentPage: number,
  itemsPerPage: number
}

export interface ServiceResponse {
  cards: object
  pagination: object
}

export class FetchService {
  constructor (private readonly cardsRepository: CardsRepository) {}

  async execute({ userId, currentPage, itemsPerPage }: ServiceRequest): Promise<ServiceResponse> {
    itemsPerPage = !itemsPerPage ? 10 : itemsPerPage
    currentPage = !currentPage ? 1 : currentPage

    const take = itemsPerPage
    const skip = (itemsPerPage * currentPage) - itemsPerPage

    const { cards, totalCount } = await this.cardsRepository.findAllByUser(userId, take, skip)
    const pageCount = Math.ceil(totalCount / itemsPerPage)

    cards.forEach((card) => {
      card.number = card.number.slice(-4)
    })

    return { cards, pagination: { totalCount, itemsPerPage, currentPage, pageCount } }
  }
}
