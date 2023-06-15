import { mysql, dbConfig } from "@/lib/mysql"
import { hashPassword, isEmpty } from "@/lib/utilities"
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
    console.log({ req: req.body, url: process.env.AD_AUTH_URL })

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
    // return res.status(500).json({
    //   success: false,
    //   data: { user: {} },
    //   error: results,
    // })
    if (results.length > 0) {
      const user = results[0]

      if (!isEmpty(user)) {
        // LOGIN TO AD
        let adlogin

        try {
          adlogin = await fetch(process.env.AD_AUTH_URL, {
            method: "POST",
            headers: {
              apiKey: "qVyqiUlzH8pps7aEetrG8ADUUXZzMNXL7TblSFDlu7g=", //process.env.AD_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userName: username,
              password: password,
            }),
            timeout: 120000,
          })
        } catch (error) {
          console.log({ error })
          return res.status(401).json({
            success: false,
            data: { user: {} },
            error: "Unauthenticated (AD)",
          })
        }

        // console.log({ adlogin })
        if (adlogin?.status !== 200)
          return res.status(401).json({
            success: false,
            data: { user: {} },
            error: "Unauthenticated (41)",
          })
        const adloginData = await adlogin.json()
        if (!adloginData.isSuccessful)
          return res.status(401).json({
            success: false,
            data: { user: {} },
            error: "Unauthenticated (42)",
          })
        const ADuser = adloginData.data

        if (!ADuser)
          return res.status(401).json({
            success: false,
            data: { user: {} },
            error: "Unauthenticated (43)",
          })
        if (!user.fullname || !user.fname || !user.lname) {
          const userFirstNameAndLastName = ADuser.displayName.split(' ');
          const firstName = userFirstNameAndLastName[0];
          const lastName = userFirstNameAndLastName[1];
          const [update] = await connection.execute(
            `UPDATE users SET fullname = ?, fname = ?, lname = ? WHERE uuid = ?`,
            [ADuser.displayName, firstName, lastName, user.uuid]
          )
          if (!update.affectedRows)
            return res.status(500).json({
              success: false,
              data: { user: {} },
              error: "Unable to update user details",
            })
        }

        // UPDATE TOKEN
        const tokenUuid = uuidv4()
        const hashTokenUuid = await hashPassword(tokenUuid)
        const [update] = await connection.execute(
          `UPDATE users SET token = ?, lastlogin = ? WHERE uuid = ?`,
          [hashTokenUuid, dayjs().format("YYYY-MM-DD HH:mm:ss"), user.uuid]
        )
        if (!update.affectedRows)
          return res.status(500).json({
            success: false,
            data: { user: {} },
            error: "Unable to create token",
          })
        const exp = parseInt(process.env.JWT_EXPIRE) * 1000 // 5minutes
        const expiry = parseInt(Date.now() + exp)
        
        const [updatedRow] = await connection.execute(`SELECT * FROM users WHERE uuid = ?`, [user.uuid]);
        const updatedUser = updatedRow[0];
        delete updatedUser.password;

        const tokenData = { user: { ...updatedUser, token: tokenUuid }, exp: expiry }
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
            user: updatedUser,
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
    console.log({ "error.message": error.message })
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message })
  }
}
