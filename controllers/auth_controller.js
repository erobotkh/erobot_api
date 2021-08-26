
import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import User from '../models/user_model.js'
import jsonwebtoken from 'jsonwebtoken'
import { generateRefreshToken, generateToken } from '../utils/token_generator.js'

const expiresIn = 7200;

const register = () => asyncHandler(async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).send({
        message: "All input is required"
      });
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send({
        message: "User Already Exist. Please Login",
      });
    }

    const encryptedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const accessToken = generateToken(
      user._id,
      user.email,
      expiresIn,
    )
    const refreshToken = generateRefreshToken(
      user._id,
      user.email,
    )

    res.status(201).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      created_at: Date.now(),
    })
  } catch (err) {
    res.status(500).send({
      message: err,
    })
  }
})

const login = () => asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send({
        message: "All input is required"
      });
    }

    const user = await User.findOne({ email });

    if (user && (await bcryptjs.compare(password, user.password))) {
      const accessToken = generateToken(
        user._id,
        user.email,
        expiresIn,
      )
      const refreshToken = generateRefreshToken(
        user._id,
        user.email,
      )

      await res.status(201).send({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: expiresIn,
        created_at: Date.now(),
      })

    } else {
      res.status(400).send({
        message: 'Invalid Credentials',
      })
    }
  } catch (err) {
    res.status(500).send({
      message: err,
    })
  }
})

const refreshToken = () => asyncHandler(async (req, res) => {
  if (req.body.grant_type === 'refresh_token') {
    const token = req.body.refresh_token

    if (!token) {
      res.status(401).send({
        message: 'Token not Found',
      })
    }


    jsonwebtoken.verify(token, process.env.JWT_REFRESH_SECRET, (error, user) => {
      if(error){
        res.status(401).send({
          message: 'Invalid Token',
        })
      } else {
        req.user = user;
      }
    });

    try {
      const accessToken = generateToken(
        req.user._id,
        req.user.email,
        expiresIn,
      )

      const refreshToken = generateRefreshToken(
        req.user._id,
        req.user.email,
      )

      res.status(201).json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: expiresIn,
        created_at: Date.now(),
      })
    } catch (err) {
      res.status(500).send({
        message: err,
      })
    }
  }
})

export { register, login, refreshToken }