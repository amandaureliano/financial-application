import { app } from './app'
import { env } from 'process'
import 'dotenv/config'

app.listen(env.PORT, () => { console.log(`🚀 HTTP Server running port ${env.PORT}`) })
