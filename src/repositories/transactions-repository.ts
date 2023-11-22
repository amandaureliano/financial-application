import { PrismaClient, type Prisma } from '@prisma/client'
import { TransactionResponse } from '../services/register-transaction'

const prisma = new PrismaClient()

export class TransactionsRepository {
  async create (data: Prisma.TransactionUncheckedCreateInput): Promise<TransactionResponse> {
    const transaction = await prisma.transaction.create({ data })
    return transaction
  }

  async findAll (accountId: string, take: number, skip: number, search?: string, type?: string) {
    const transactions = await prisma.transaction.findMany({
      select: { id: true, createdAt: true, updatedAt: true, value: true, description: true },
      where: { accountId, description: { contains: search, mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    })

    const totalCount = await prisma.transaction.count({ where: { accountId } })
    return { transactions, totalCount }
  }

  async findAllValue (accountId: string) {
    const balance = await prisma.transaction.aggregate({ _sum: { value: true }, where: { accountId } })
    return balance
  }
}
