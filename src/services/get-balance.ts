import { AppError } from '../errors/app-error'
import { AccountsRepository } from '../repositories/accounts-repository'
import { TransactionsRepository } from '../repositories/transactions-repository'

interface ServiceRequest {
  accountId: string
}

export interface ServiceResponse {
  balance: number
}

export class GetService {
  constructor (
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({ accountId }: ServiceRequest): Promise<ServiceResponse> {
    const accountExist  = await this.accountsRepository.findById(accountId)

    if (!accountExist) {
      throw new AppError('Invalid action.')
    }

    const { _sum } = await this.transactionsRepository.findAllValue(accountId)

    let balance = _sum.value

    if (balance === null) {
      balance = 0
    }

    return { balance: balance / 100 }
  }
}
