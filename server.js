import express from 'express'
import dotenv from 'dotenv'
import connectDB from './configs/db_configs.js'
import postRoutes from './routes/post_routes.js'
import commentRoutes from './routes/comment_routes.js'
import memberRoutes from './routes/member_routes.js'
import categoryRoute from './routes/category_route.js'
import bookmarkRoute from './routes/bookmark_routes.js'
import userRoute from './routes/user_routes.js'
import authRoutes from './routes/auth_routes.js'
import renderEmailTemplate from './controllers/email_template_controller.js'

dotenv.config()
connectDB();

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/members', memberRoutes)
app.use('/categories', categoryRoute)

app.use('/user', userRoute)
app.use('/user/bookmarks', bookmarkRoute)

app.use((error, req, res, next) => {
  res.send({
    message: 'Something fail',
    error: error,
  })
})


app.get('/email_template', renderEmailTemplate());

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} `);
})