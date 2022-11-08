import { Sequelize } from "sequelize"
import db from "../config/database.js"
import Post from "./Post.js"
import User from "./User.js"

const { DataTypes } = Sequelize

const Relationship = db.define(
  "relationship",
  {},
  {
    // freezeTableName: true,
    timestamps: true,
    paranoid: true,
    // createdAt: "created_at",
    // updatedAt: "updated_at",
    // deletedAt: "deleted_at",
  }
)

// USER - POST
User.hasMany(Post, { foreignKey: { allowNull: false } })
Post.belongsTo(User)

// FOLLOWERS
User.hasMany(Relationship, {
  foreignKey: { name: "senderId", allowNull: false },
})
Relationship.belongsTo(User, { as: "followers", foreignKey: "senderId" })

// FOLLOWING
User.hasMany(Relationship, {
  foreignKey: { name: "receiverId", allowNull: false },
})
Relationship.belongsTo(User, { as: "following", foreignKey: "receiverId" })

export default Relationship
