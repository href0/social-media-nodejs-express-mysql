import { Sequelize } from "sequelize"
import db from "../config/database.js"

const { DataTypes } = Sequelize

const User = db.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
    },
    fullname: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
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

export default User
