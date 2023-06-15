import { mysql, dbConfig } from "@/lib/mysql"
import { verifyToken } from "@/lib/utilities"
import { hasCookie, deleteCookie } from "cookies-next"

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res
        .status(400)
        .json({ success: false, error: "Invalid HTTP request method" })

    const connection = await mysql.createPool(dbConfig)

    const auth = await verifyToken(req, res, connection)

    if (hasCookie("authorization", { req, res }))
      deleteCookie("authorization", { req, res })

    if (!auth.success)
      return res.status(401).json({ success: false, error: auth.error })
    const User = auth.data

    await connection.execute(`UPDATE users SET token = ? WHERE uuid = ?`, [
      "",
      User.uuid,
    ])

    delete User.password
    delete User.token

    return res.status(200).json({
      success: true,
      data: User,
      error: null,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message })
  }
}
