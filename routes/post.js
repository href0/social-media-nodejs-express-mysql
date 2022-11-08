import express from "express"
import { store, update, getAll, get, destroy } from "../controllers/Post.js"
import { uploadCloudinary } from "../middlewares/uploadImage.js"
import verifyToken from "../middlewares/verifyToken.js"
const router = express.Router()

router.get("/", getAll)
router.get("/:id", get)
router.post("/", verifyToken, uploadCloudinary, store)
router.patch("/:id", update)
router.delete("/:id", destroy)

export default router
