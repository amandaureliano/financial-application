import { PrismaClient, type Prisma, Type } from '@prisma/client'
import { CardResponse } from '../services/register-card'

const prisma = new PrismaClient()

export class CardsRepository {
  async create (data: Prisma.CardUncheckedCreateInput): Promise<CardResponse> {
    const card = await prisma.card.create({ data })
    return card
  }

  async findAll (accountId: string, take: number = 10, skip: number = 1) {
    const cards = await prisma.card.findMany({
      select: { id: true, createdAt: true, updatedAt: true, type: true, number: true, cvv: true },
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    })

    const totalCount = await prisma.card.count({ where: { accountId }, orderBy: { createdAt: 'desc' } })
    return { cards, totalCount }
  }

  async countByType(accountId: string, type: Type) {
    return await prisma.card.count({ where: { accountId, type } })
  }

  async findAllByUser (userId: string, take: number = 10, skip: number = 1) {
    const accounts = await prisma.account.findMany({ select: { id: true }, where: { userId } })

    const cards = await prisma.card.findMany({
      select: { id: true, createdAt: true, updatedAt: true, type: true, number: true, cvv: true },
      where: { accountId: { in: accounts.map((account) => account.id ) } },
      orderBy: { createdAt: 'desc' },
      take,
      skip
    })

    const totalCount = await prisma.card.count({
      where: { accountId: { in: accounts.map((account) => account.id ) } },
      orderBy: { createdAt: 'desc' }
    })

    return { cards, totalCount }
  }
}
