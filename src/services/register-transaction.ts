import { type TransactionsRepository } from '../repositories/transactions-repository'
import { AccountsRepository } from '../repositories/accounts-repository'
import { AppError } from '../errors/app-error'

interface ServiceRequest {
  value: number
  description: string
  accountId: string
}

export interface TransactionResponse {
  id: string
  createdAt: Date
  updatedAt: Date
  accountId?: string
  value: number
  description: string
}

export class RegisterService {
  constructor (
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository
  ) {}

  async execute({ value, description, accountId }: ServiceRequest): Promise<TransactionResponse> {
    const accountExist  = await this.accountsRepository.findById(accountId)

    if (!accountExist) {
      throw new AppError('Invalid action.')
    }

    if (value.toString().includes('.')) {
      value = value * 100
    }

    if (value.toString().startsWith('-')){
      const realValue = Number(value.toString().slice(1))
      const { _sum } = await this.transactionsRepository.findAllValue(accountId)

      if (_sum.value === null) {
        _sum.value = 0
      }

      if (_sum.value < realValue) {
        throw new AppError('Invalid action.')
      }
    }

    const transaction = await this.transactionsRepository.create({ value, description, accountId })
    delete transaction.accountId
    transaction.value = transaction.value / 100

    return transaction
  }
}
