import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db_configs.js'

dotenv.config()
connectDB();

const app = express()
app.use(express.json())

app.get('/', function (req, res) {
  res.send('API is running....')
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} `)
}) 