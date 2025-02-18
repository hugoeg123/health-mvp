import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Health MVP API is running' })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})