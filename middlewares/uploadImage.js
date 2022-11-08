// import fs from "fs"
// import multer from "multer"
import removeTmp from "../helpers/removeTmp.js"

// const upload = async (req, res, next) => {
//   try {
//     // menentukan lokasi pengunggahan
//     const diskStorage = multer.diskStorage({
//       destination: function (req, file, cb) {
//         cb(null, "./public/images/posts/")
//       },
//       filename: function (req, file, cb) {
//         const originalName = file.originalname
//         const fileName = originalName.replace(/\s/g, "_")
//         cb(null, new Date().getTime() + "-" + fileName)
//       },
//     })

//     const fileFilter = (req, file, cb) => {
//       const type = ["image/png", "image/jpeg", "image/jpg"]
//       if (!type.includes(file.mimetype))
//         return cb(new Error("Only png jpg jpeg are allowed"))
//       cb(null, true)
//     }

//     multer({
//       storage: diskStorage,
//       fileFilter,
//       limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
//     }).single("image")(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         return res.status(406).json({
//           status: false,
//           message: err.message,
//           data: {},
//         })
//       } else if (err) {
//         return res.status(400).json({
//           status: false,
//           message: err.message,
//           data: {},
//         })
//       }

//       //   req.title = req.body.title
//       // req.fileCompress = filePath;
//       next()
//     })
//   } catch (error) {
//     res.status(error.code || 500).json({
//       status: false,
//       message: error.message || "Internal server error",
//       data: {},
//     })
//   }
// }

const uploadCloudinary = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0)
      throw { code: 404, message: "No files is selected." }
    const file = req.files.image
    // console.log(file)
    if (file.size > 1024 * 1024) {
      removeTmp(file.tempFilePath)
      throw { code: 400, message: "Size too large" }
    } // 1MB
    const allowedFile = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedFile.includes(file.mimetype)) {
      removeTmp(file.tempFilePath)
      throw { code: 400, message: "Only jpg jpeg png are allowed" }
    }
    next()
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

export { uploadCloudinary }
