import { type AccountsRepository } from '../repositories/accounts-repository'

interface ServiceRequest {
  branch: string
  account: string
  userId: string
}

export interface AccountResponse {
  id: string
  createdAt: Date
  updatedAt: Date
  branch: string
  account: string
  userId?: string
}

export class RegisterService {
  constructor (private readonly accountsRepository: AccountsRepository) {}

  async execute({ branch, account, userId }: ServiceRequest): Promise<AccountResponse> {
    const accountCreated = await this.accountsRepository.create({ branch, account, userId })
    accountCreated.account = account.slice(0, 7)+'-'+account.slice(7)
    delete accountCreated.userId

    return accountCreated
  }
}
