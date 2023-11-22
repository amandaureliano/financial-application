import { User } from '@prisma/client'
import { UsersRepository } from '../repositories/users-repository'
import { compare } from 'bcryptjs'
import { AppError } from '../errors/app-error'

interface AuthenticateServiceRequest {
  document: string
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ document, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    document = document.replace(/[./-]/g, '')

    const user = await this.usersRepository.findByDocument(document)

    if (!user) {
      throw new AppError('User does not exist.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new AppError('Password does not meet the parameters.')
    }

    return { user }
  }
}
