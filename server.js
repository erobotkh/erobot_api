import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db_configs.js'
import postRoutes from './routes/post_routes.js'
import authRoutes from './routes/auth_routes.js'
import renderEmailTemplate from './controllers/email_template_controller.js'

dotenv.config()
connectDB();

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/posts', postRoutes)

app.get('/email_template', renderEmailTemplate());

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} `);
})