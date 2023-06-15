import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { getCookie, hasCookie, deleteCookie } from "cookies-next"

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
}
export const validate = (data, req, res) => {
  if (!data.fname)
    return res.status(400).json({
      success: false,
      data: null,
      error: "Firstname is required",
    })
  if (!data.lname)
    return res
      .status(400)
      .json({ success: false, data: null, error: "Lastname is required" })
  if (!data.email)
    return res
      .status(400)
      .json({ success: false, data: null, error: "Email is required" })
  else if (!validateEmail(data.email))
    return res
      .status(400)
      .json({ success: false, data: null, error: "Email is invalid" })
  if (!data.telephone)
    return res.status(400).json({
      success: false,
      data: null,
      error: "Telephone is required",
    })
}
export async function hashPassword(plaintextPassword) {
  return await bcrypt.hash(plaintextPassword, 10)
}
// compare password
export async function comparePassword(plaintextPassword, hash) {
  return await bcrypt.compare(plaintextPassword, hash)
}
export const getCustomer = async (uuid, connection) => {
  const [customer] = await connection.execute(
    `SELECT uuid, fname, lname, email, telephone, band, lastvisit, created_at, created_by, updated_at, updated_by FROM customers WHERE uuid = ? OR  telephone = ? OR  email = ?`,
    [uuid, uuid, uuid]
  )
  if (customer.length > 0) return customer[0]
  return null
}
export const getUser = async (uuid, connection) => {
  const [user] = await connection.execute(
    `SELECT * FROM users WHERE uuid = ? OR LCASE(username) = ? OR telephone = ? OR  LCASE(email) = ?`,
    [uuid, uuid.toLowerCase(), uuid, uuid.toLowerCase()]
  )
  if (user.length > 0) {
    return user[0]
  }
  return null
}
export const msisdn = (telephone) => {
  if (!telephone) return null
  if (telephone.startsWith("234")) return telephone
  if (telephone.startsWith("0")) return `234${telephone.substring(1)}` // 08090956548
  if (telephone.startsWith("+")) return telephone.replace("+", "") // +2348090956548
  return `234${telephone}` // 8090956548
}
export async function verifyToken(req, res, connection) {
  try {
    if (!hasCookie("authorization", { req, res }))
      return {
        success: false,
        error: "MISSING_TOKEN",
      }
    let token = getCookie("authorization", { req, res })
    if (!token) {
      const authorization = req.headers.authorization.split
      token = authorization[1] || authorization[0]
    }

    if (!token)
      return {
        success: false,
        error: "MISSING_TOKEN",
      }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const decodedUser = decoded.user
    if (!decodedUser?.uuid) {
      if (hasCookie("authorization", { req, res }))
        deleteCookie("authorization", { req, res })
      return {
        success: false,
        error: "INVALID_TOKEN",
      }
    }
    const expiry = new Date(decoded.exp)
    const now = Date.now() //Date.now()
    if (expiry - now < 0) {
      if (hasCookie("authorization", { req, res }))
        deleteCookie("authorization", { req, res })
      return {
        success: false,
        error: "EXPIRED_TOKEN",
      }
    }
    if (!connection) connection = await mysql.createPool(dbConfig)
    const User = await getUser(decodedUser.uuid, connection)
    if (!User.uuid) {
      if (hasCookie("authorization", { req, res }))
        deleteCookie("authorization", { req, res })
      return {
        success: false,
        error: "INVALID_TOKEN",
      }
    }
    const tokenMatched = User.token
      ? await comparePassword(decodedUser.token, User.token)
      : false
    if (!tokenMatched) {
      if (hasCookie("authorization", { req, res }))
        deleteCookie("authorization", { req, res })
      return {
        success: false,
        error: "INVALID_TOKEN",
      }
    }
    delete User.password
    delete User.token

    return {
      success: true,
      data: User,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
export const isArray = (data) => {
  return Array.isArray(data)
}
export const isObject = (data) => {
  return typeof data === "object" && data !== null && !Array.isArray(data)
}
export const isString = (data) => {
  return typeof data === "string"
}
export const isNumber = (data) => {
  return typeof data === "number"
}
export const isBoolean = (data) => {
  return typeof data === "boolean"
}
export const isEmpty = (obj) => {
  if (!obj || typeof obj === "undefined") return true
  return Object.keys(obj).length === 0
}
