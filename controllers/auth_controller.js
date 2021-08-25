
import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import User from '../models/user_model.js'

const register = () => asyncHandler(async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcryptjs.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // Create token
    const token = jsonwebtoken.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    // save user token
    user.token = token;

    res.status(201).json({
      access_token: user.token,
      token_type: "Bearer",
      expires_in: 2 * 3600
    });
  } catch (err) {
    console.log(err);
  }
})

const login = () => asyncHandler(async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcryptjs.compare(password, user.password))) {
      const token = jsonwebtoken.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      // save user token
      user.token = token;

      res.status(200).json({
        access_token: user.token,
        token_type: "Bearer",
        expires_in: 2 * 3600
      });
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
})

export { register, login }