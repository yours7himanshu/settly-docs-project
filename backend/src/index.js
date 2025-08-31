import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectToDatabase } from './config/db.js'
import router from './routes/index.js'
import { errorHandler } from './middlewares/error.js'
import { validateEnv } from './config/env.js'
import dotenv from 'dotenv'
const app = express()

dotenv.config();
const allowedOrigins = [process.env.CLIENT_ORIGIN || 'http://localhost:5173', process.env.ADMIN_ORIGIN || 'http://localhost:5174']
app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Server is running fine');
})

app.use('/api', router)
app.use(errorHandler)

const port = process.env.PORT || 3000

validateEnv()
connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
})

