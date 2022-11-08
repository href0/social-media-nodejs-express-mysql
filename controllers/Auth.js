import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const register = async (req, res) => {
  try {
    // VALIDATE
    if (!req.body.username) throw { code: 400, message: "Username required" }
    if (!req.body.fullname) throw { code: 400, message: "Fullname required" }
    if (!req.body.password)
      throw { code: 400, message: "Password does not match" }
    if (req.body.password !== req.body.retypePassword)
      throw { code: 400, message: "Password does not match" }

    const { username, fullname, password: pass } = req.body

    // Check user if already exist
    const user = await User.findOne({ where: { username } })
    if (user) throw { code: 409, message: "Username already exist" }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(pass, salt)

    const create = await User.create({
      username,
      fullname,
      password: passwordHash,
    })
    const { password, ...other } = create._previousDataValues
    return res.status(201).json({
      status: true,
      message: "Register User Successfully",
      data: other,
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

const login = async (req, res) => {
  try {
    // VALIDATE
    if (!req.body.username) throw { code: 400, message: "Username required" }
    if (!req.body.password) throw { code: 400, message: "Password required" }

    const { username, password: pass } = req.body
    const user = await User.findOne({ where: { username } })
    if (!user) throw { code: 400, message: "wrong username or password" }

    const compare = await bcrypt.compare(pass, user.password)
    if (!compare) throw { code: 400, message: "wrong username or password" }

    const generateAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE }
    )
    const generateRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE }
    )

    res.cookie("refreshToken", generateRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // gunakan secure : true untuk https
    })

    await user.update({ refreshToken: generateRefreshToken })

    const { password, deletedAt, refreshToken, ...other } =
      user._previousDataValues

    res.status(200).json({
      status: true,
      message: "Login successfully",
      data: { user: other, accessToken: generateAccessToken },
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

export { register, login }
