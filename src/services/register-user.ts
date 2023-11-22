import { hash } from 'bcryptjs'
import { type UsersRepository } from '../repositories/users-repository'
import { AppError } from '../errors/app-error'

interface ServiceRequest {
  name: string
  document: string
  password: string
}

export interface UserResponse {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  document: string
  password?: string
}

export class RegisterService {
  constructor (private readonly usersRepository: UsersRepository) {}

  async execute({ name, document, password }: ServiceRequest): Promise<UserResponse> {
    document = document.replace(/[./-]/g, '')
    const userExist = await this.usersRepository.findByDocument(document)

    if (userExist) {
      throw new AppError('The user already exists.')
    }

    password = await hash(password, 6)
    const user = await this.usersRepository.create({ name, document, password })
    delete user.password

    return user
  }
}
