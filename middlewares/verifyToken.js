import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
  const authHeader = req.header("authorization") // mengambil header
  const token = authHeader && authHeader.split(" ")[1] // mengambil token, jika tidak ada maka null

  if (!token)
    return res
      .status(401)
      .json({ status: false, message: "Unauthorized", data: {} })

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ status: false, message: "Forbidden", data: {} })
    req.userId = decoded.userId
    next()
  })
}

export default verifyToken
