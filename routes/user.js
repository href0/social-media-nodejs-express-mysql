import express from "express"
import { store, update, getAll, get, destroy } from "../controllers/User.js"
import verifyToken from "../middlewares/verifyToken.js"

const router = express.Router()

router.get("/", getAll)
router.get("/:id", get)
router.post("/", verifyToken, store)
router.put("/:id", verifyToken, update)
router.delete("/:id", destroy)

export default router
