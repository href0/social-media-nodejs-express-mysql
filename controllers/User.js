import User from "../models/User.js"
import bcrypt from "bcrypt"

const userAttributes = ["id", "username", "fullname", "createdAt", "updatedAt"]
const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: userAttributes,
    })
    res.status(200).json({
      status: true,
      message: "Get Users",
      data: users,
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

const get = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const user = await User.findOne({
      attributes: userAttributes,
      where: { id },
    })

    if (!user) throw { code: 404, message: "User not found" }

    res.status(200).json({
      status: true,
      message: "Get single user",
      data: user,
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

const store = async (req, res) => {
  try {
    const userId = req.userId
    const checkUser = await User.findOne({ where: { id: userId } })
    if (!checkUser.isAdmin) throw { code: 403, message: "Forbidden", data: {} }
    // VALIDATE
    if (!req.body.username) throw { code: 400, message: "Username is required" }
    if (!req.body.fullname) throw { code: 400, message: "Fullname is required" }
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

const update = async (req, res) => {
  try {
    let user = null
    const checkUser = await User.findOne({
      where: { id: req.userId },
      attributes: ["isAdmin", "id", "username", "fullname", "profilePicture"],
    })

    // check params.id dan id yang login tidak sama dan bukan admin
    if (Number(req.params.id) !== req.userId && !checkUser.isAdmin)
      throw { code: 403, message: "Not your accout!" }

    // jika sama ambil data dan masukkan ke user
    if (checkUser.id === Number(req.params.id)) user = checkUser

    // jika tidak sama, yang login adalah admin dan dapatkan data user yang ingin di update
    user = await User.findOne({
      attributes: ["id", "username", "fullname", "profilePicture"],
      where: { id: req.params.id },
    })

    if (!user) throw { code: 404, message: "User Not Found" }

    if (req.body.password) {
      if (req.body.password !== req.body.retypePassword)
        throw { code: 400, message: "Password does not match" }
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    const update = await user.update(req.body)
    const { password, ...other } = update._previousDataValues
    res.status(200).json({
      status: true,
      message: "Update user successfully",
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

const destroy = async (req, res) => {
  try {
    res.send("delete")
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

export { store, update, getAll, get, destroy }
