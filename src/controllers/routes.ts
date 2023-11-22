import { Router } from 'express'
import { registerPeople } from './register-people'
import { authenticate } from './authenticate'
import { verifyJWT } from '../middlewares/verify-jwt'
import { registerAccount } from './register-account'
import { accounts } from './accounts'
import { registerCard } from './register-card'
import { cardsByAccount } from './cards-account'
import { cards } from './cards'
import { registerTransaction } from './register-transaction'
import { transactions } from './transactions'
import { balance } from './balance'
import { errorHandle } from '../middlewares/error-handle'
require('express-async-errors')

export const routes = Router()

routes.post('/people', registerPeople)
routes.post('/login', authenticate)

routes.use(verifyJWT)

routes.post('/accounts', registerAccount)
routes.get('/accounts', accounts)
routes.post('/accounts/:accountId/cards', registerCard)
routes.get('/accounts/:accountId/cards', cardsByAccount)
routes.get('/accounts/cards', cards)
routes.post('/accounts/:accountId/transactions', registerTransaction)
routes.get('/accounts/:accountId/transactions', transactions)
routes.get('/accounts/:accountId/balance', balance)

routes.use(errorHandle)
