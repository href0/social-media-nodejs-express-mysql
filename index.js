import express, { urlencoded } from "express"
import dotenv from "dotenv"
import db from "./config/database.js"
import cors from "cors"
import fileUpload from "express-fileupload"

// ROUTES
import routes from "./routes/index.js"

// MODELS
import User from "./models/User.js"
import Post from "./models/Post.js"
import Relationship from "./models/Relationship.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

// MIDDLEWARE
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(fileUpload({ useTempFiles: true }))

// DATABASE
const connect = async () => {
  try {
    await db.authenticate()
    // await User.sync({ alter: true })
    // await Post.sync({ alter: true })
    // await Relationship.sync({ alter: true })
    console.log("database connected")
  } catch (error) {
    console.error("Database Error: " + error)
  }
}
connect()

// ROUTES
app.use("/", routes)

app.listen(PORT, () => console.log(`Server runnint at port ${PORT}`))
