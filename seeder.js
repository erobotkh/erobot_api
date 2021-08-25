import connectDB from './configs/db_configs.js'
import Post from './models/posts_model.js'
import User from './models/user_model.js'
import users from './examples/users_example.js'
import posts from './examples/posts_example.js'

connectDB()

const createPost = async () => {
  try {
    await Post.deleteMany()
    await User.deleteMany()

    let createUsers = await User.insertMany(users)
    let _posts = posts.map((post) => {
      let author = createUsers.find((user) => {
        return post.author.first_name == user.first_name
      })
      return { ...post, author: author._id }
    })

    await Post.insertMany(_posts)
    console.log('Post imported')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

createPost()