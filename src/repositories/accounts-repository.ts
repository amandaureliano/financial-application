import { PrismaClient, type Prisma } from '@prisma/client'
import { AccountResponse } from '../services/register-account'

const prisma = new PrismaClient()

export class AccountsRepository {
  async create (data: Prisma.AccountUncheckedCreateInput): Promise<AccountResponse> {
    const account = await prisma.account.create({ data })
    return account
  }

  async findById (id: string) {
    const account = await prisma.account.findFirst({ where: { id } })
    return account
  }

  async findAll (userId: string, take: number = 10, skip: number = 1) {
    const accounts = await prisma.account.findMany({
      select: { id: true, createdAt: true, updatedAt: true,  branch: true, account: true },
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    })

    const totalCount = await prisma.account.count({ where: { userId }, orderBy: { createdAt: 'desc' } })
    return { accounts, totalCount }
  }
}
