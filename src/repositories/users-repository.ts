import { PrismaClient, type Prisma, User } from '@prisma/client'
import { UserResponse } from '../services/register-user'

const prisma = new PrismaClient()

export class UsersRepository {
  async create (data: Prisma.UserCreateInput): Promise<UserResponse> {
    const user = await prisma.user.create({ data })
    return user
  }

  async findByDocument (document: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { document } })
    return user
  }
}
