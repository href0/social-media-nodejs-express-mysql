import express from "express"
import {
  store,
  getFollowing,
  getFollowers,
  destroy,
} from "../controllers/Relationship.js"
import verifyToken from "../middlewares/verifyToken.js"

const router = express.Router()

router.post("/", verifyToken, store)
router.delete("/", verifyToken, destroy)
router.get("/following/:userId", getFollowing)
router.get("/followers/:userId", getFollowers)

export default router
