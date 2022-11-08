import Relationship from "../models/Relationship.js"
import User from "../models/User.js"

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId
    const users = await Relationship.findAll({
      where: { senderId: userId },
      include: [{ model: User, as: "following" }],
    })

    const following = []
    users.map((e) => {
      following.push({
        id: e.following.id,
        username: e.following.username,
        fullname: e.following.fullname,
        profilePicture: e.following.profilePicture,
      })
    })
    res.status(200).json({
      status: true,
      message: "Get data following",
      data: following,
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId
    const users = await Relationship.findAll({
      where: { receiverId: userId },
      include: [{ model: User, as: "followers" }],
    })

    const followers = []
    users.map((e) => {
      followers.push({
        id: e.followers.id,
        username: e.followers.username,
        fullname: e.followers.fullname,
        profilePicture: e.followers.profilePicture,
      })
    })
    res.status(200).json({
      status: true,
      message: "Get data followers",
      data: followers,
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

const store = async (req, res) => {
  try {
    const receiverId = req.body.userId
    const senderId = req.userId
    if (senderId === receiverId)
      throw { code: 400, message: "Cannot follow your self" }

    const receiverUser = await User.findOne({ where: { id: receiverId } })
    if (!receiverUser) throw { code: 404, message: "User Not Found" }

    const checkStatusFollow = await Relationship.findOne({
      where: {
        receiverId,
        senderId,
      },
    })
    if (checkStatusFollow)
      throw { code: 409, message: "Already follow this user" }

    const create = await Relationship.create({ senderId, receiverId })
    res.status(201).json({
      status: true,
      message: "Successfully followed user",
      data: create,
    })
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
    const senderId = req.userId
    const receiverId = req.body.userId

    const checkStatusFollow = await Relationship.findOne({
      where: { senderId, receiverId },
    })
    if (!checkStatusFollow) throw { code: 400, message: "Not yet follow user" }

    await checkStatusFollow.destroy()
    res.status(200).json({
      status: true,
      message: "Successfully unfollow user",
      data: {},
    })
  } catch (error) {
    res.status(error.code || 500).json({
      status: false,
      message: error.message || "Internal server error",
      data: {},
    })
  }
}

export { store, getFollowing, destroy, getFollowers }
