import { Sequelize } from "sequelize"
import db from "../config/database.js"

const { DataTypes } = Sequelize

const Post = db.define(
  "post",
  {
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    // freezeTableName: true,
    timestamps: true,
    paranoid: true,
    // createdAt: "created_at",
    // updatedAt: "updated_at",
    // deletedAt: "deleted_at",
  }
)

export default Post
