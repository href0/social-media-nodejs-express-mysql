import Post from "../models/Post.js"
import dotenv from "dotenv"
import cloudinary from "cloudinary"
import removeTmp from "../helpers/removeTmp.js"
import "../config/cloudinary.js"

dotenv.config()
const getAll = async (req, res) => {
  try {
    res.send("get All")
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
    res.send("get single")
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

const store = async (req, res) => {
  const images = req.files.image

  try {
    if (!req.body.description) {
      removeTmp(images.tempFilePath)
      throw { code: 400, message: "Description is required" }
    }
    const upload = await cloudinary.v2.uploader.upload(images.tempFilePath, {
      folder: "social-media/posts",
      // use_filename: true,
      unique_filename: true,
      overwrite: true,
      transformation: [{ quality: 50, crop: "fill" }],
    })
    removeTmp(images.tempFilePath)
    const userId = req.userId
    // UPLOAD DENGAN MULTER
    // if (!req.file) throw { code: 400, message: "No file is selected" }
    // if (!req.body.description) {
    //   fs.unlink(req.file.path, (err) => {
    //     if (err)
    //       return res.status(400).json({
    //         status: false,
    //         message: err,
    //         data: {},
    //       })
    //     res.status(400).json({
    //       status: false,
    //       message: "Description is required",
    //       data: {},
    //     })
    //   })
    //   // throw { code: 400, message: "Description is required" }
    // }

    const description = req.body.description
    const image = upload.secure_url
    // return console.log(description)
    const create = await Post.create({ description, image, userId })
    return res.status(201).json({
      status: true,
      message: "Post created successfully",
      data: create,
    })
  } catch (error) {
    removeTmp(images.tempFilePath)
    res.status(error.code || 500).json({
      status: false,
      message: error || error.message || "Internal server error",
      data: {},
    })
  }
}

const update = async (req, res) => {
  try {
    res.send("update")
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
