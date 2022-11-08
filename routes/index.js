import express from "express"
import user from "./user.js"
import auth from "./auth.js"
import relationship from "./relationship.js"
import post from "./post.js"

const router = express.Router()

router.get("/", (req, res) => {
  res.send("tes")
})
router.use("/users", user)
router.use("/auth", auth)
router.use("/relationships", relationship)
router.use("/posts", post)

export default router
