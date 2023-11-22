import { type AccountsRepository } from '../repositories/accounts-repository'

interface ServiceRequest {
  userId: string,
  currentPage: number,
  itemsPerPage: number
}

export interface ServiceResponse {
  accounts: object
  pagination: object
}

export class FetchService {
  constructor (private readonly accountsRepository: AccountsRepository) {}

  async execute({ currentPage, itemsPerPage, userId }: ServiceRequest): Promise<ServiceResponse> {
    itemsPerPage = !itemsPerPage ? 10 : itemsPerPage
    currentPage = !currentPage ? 1 : currentPage

    const take = itemsPerPage
    const skip = (itemsPerPage * currentPage) - itemsPerPage

    const { accounts, totalCount } = await this.accountsRepository.findAll(userId, take, skip)
    const pageCount = Math.ceil(totalCount / itemsPerPage)

    accounts.forEach((account) => account.account = account.account.slice(0, 7)+'-'+account.account.slice(7))

    return { accounts, pagination: { totalCount, itemsPerPage, currentPage, pageCount } }
  }
}
