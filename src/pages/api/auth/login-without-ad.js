import { mysql, dbConfig } from "@/lib/mysql"
import { hashPassword, comparePassword } from "@/lib/utilities"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"
import { setCookie } from "cookies-next"

export default async function handler(req, res) {
  try {
    if (req.method !== "POST")
      return res
        .status(400)
        .json({ success: false, error: "Invalid HTTP request method" })

    const connection = await mysql.createPool(dbConfig)
    const { username, password } = req.body
    console.log({ req: req.body })

    if (!username)
      return res.status(400).json({
        success: false,
        error: "Username is required",
      })
    if (!password)
      return res.status(400).json({
        success: false,
        error: "Password is required",
      })

    const [results] = await connection.execute(
      `SELECT * FROM  users WHERE LCASE(username) = ? OR  LCASE(email) = ? OR  LCASE(telephone) = ?`,
      [username, username, username]
    )
    if (results.length > 0) {
      const user = results[0]
      const passwordMatched = await comparePassword(password, user.password)
      if (passwordMatched) {
        const tokenUuid = uuidv4()
        const hashTokenUuid = await hashPassword(tokenUuid)
        const [update] = await connection.execute(
          `UPDATE users SET token = ?, lastlogin = ? WHERE uuid = ?`,
          [hashTokenUuid, dayjs().format("YYYY-MM-DD HH:mm:ss"), user.uuid]
        )
        if (!update.affectedRows)
          return res.status(500).json({
            success: false,
            data: {},
            error: "Unable to create token",
          })
        const exp = parseInt(process.env.JWT_EXPIRE) * 1000
        const expiry = parseInt(Date.now() + exp)
        delete user.password
        const tokenData = {
          user: { ...user, token: tokenUuid },
          exp: expiry,
        }
        var token = jwt.sign(tokenData, process.env.JWT_SECRET)

        if (token) {
          setCookie("authorization", `${token}`, {
            req,
            res,
            maxAge: expiry ?? 60 * 60 * 24, // would expire after 1 day
            httpOnly: true,
            signed: true,
            path: "/",
            sameSite: "strict",
          })
        }
        return res.status(200).json({
          success: true,
          data: {
            user,
            token,
            ttl: process.env.JWT_EXPIRE,
            expiry: new Date(expiry),
          },
          error: null,
        })
      }
    }
    return res.status(401).json({
      success: false,
      data: { user: {} },
      error: "Unauthenticated",
    })
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message })
  }
}
