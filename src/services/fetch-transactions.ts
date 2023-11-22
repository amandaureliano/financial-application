import { AppError } from '../errors/app-error'
import { AccountsRepository } from '../repositories/accounts-repository'
import { type TransactionsRepository } from '../repositories/transactions-repository'

interface ServiceRequest {
  accountId: string,
  currentPage: number,
  itemsPerPage: number,
  search?: string,
  type?: string
}

export interface ServiceResponse {
  transactions: object
  pagination: object
}

export class FetchService {
  constructor (
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({ accountId, currentPage, search, type, itemsPerPage }: ServiceRequest): Promise<ServiceResponse> {
    const accountExist  = await this.accountsRepository.findById(accountId)

    if (!accountExist) {
      throw new AppError('Invalid action.')
    }

    itemsPerPage = !itemsPerPage ? 10 : itemsPerPage
    currentPage = !currentPage ? 1 : currentPage

    const take = itemsPerPage
    const skip = (itemsPerPage * currentPage) - itemsPerPage

    const { transactions, totalCount } = await this.transactionsRepository.findAll(accountId, take, skip, search, type)
    const pageCount = Math.ceil(totalCount / itemsPerPage)

    return { transactions, pagination: { totalCount, itemsPerPage, currentPage, pageCount } }
  }
}
