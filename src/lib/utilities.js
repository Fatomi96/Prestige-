import axios from 'axios';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectionPool } from './mysql';
import logger from "@/lib/logger";
import { getCookie, hasCookie, deleteCookie } from "cookies-next";

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
    `SELECT uuid, fname, lname, email, telephone, band, checkin, checkout, created_at, created_by, updated_at, updated_by FROM customers WHERE isDeleted = ? AND (uuid = ? OR telephone = ? OR email = ?)`,
    [false, uuid, uuid, uuid]
  );

  if (customer.length > 0) return customer[0]
  return null
}

export const getCompanion = async (uuid, connection) => {
  const [companion] = await connection.execute(
    `SELECT co.id, co.uuid, co.firstname, co.lastname, co.telephone, co.checkin, co.checkout, co.created_at, co.updated_at, co.customerId AS guest_uuid, CONCAT(c.fname, ' ', c.lname) AS guest_name FROM companions co left join customers c on c.uuid = co.customerId WHERE co.isDeleted = ? AND (co.uuid = ? OR co.telephone = ? OR co.customerId = ?)`,
    [false, uuid, uuid, uuid]
  );

  if (companion.length > 0) return companion[0]
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
  if (!telephone) return null;

  if (typeof telephone !== "string") {
    telephone = telephone.toString();
  }

  if (telephone.startsWith("234")) return telephone;

  if (telephone.startsWith("0")) return `234${telephone.substring(1)}`;

  if (telephone.startsWith("+")) return telephone.replace("+", "");

  return `234${telephone}`
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
    if (!connection) connection = await connectionPool.getConnection()
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

export const smsSender = async (data) => {
  const smsUrl = 'https://preprod-nigeria.api.mtn.com/v3/sms/messages/sms/outbound'
  const SMS_ENDPOINT = smsUrl;
  const { message } = data;

  let receiverAddress = data?.receiverAddress;

  if (!receiverAddress?.startsWith('234')) {
    receiverAddress = `234${receiverAddress?.slice(1)}`;
  }

  const requestData = {
    senderAddress: 'MTN PRESTIGE',
    receiverAddress: [receiverAddress],
    message,
    keyword: 'Aftersales',
    clientCorrelatorId:
      process.env.SMS_TRANSACTION_ID ||
      'a3ae03d0-2101-43e3-b6a6-89fb219c1c66',
    requestDeliveryReceipt: false,
    serviceCode: process.env.SMS_SERVICE_CODE || '11221',
  }

  try {
    const response = await axios.post(SMS_ENDPOINT, requestData, {
      headers: {
        Accept: 'application/json',
        'x-api-key':
          process.env.MADAPI_SMS_X_API_KEY ||
          'dUv1UWNUt2nuZDCwPAMn3E7NjyYndyWh',
      },
    })

    return {
      message: 'SMS sent successfully!',
      data: response?.data || {},
    }
  } catch (error) {
    logger.error(`[SMS service]: ${error}`, { method: this.req.method, url: this.req.url, status: 500 });
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message })
  }
}

export const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
}

export const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber.startsWith("234") && phoneNumber.length == 13) {
    return true;
  }  
  
  if (phoneNumber.startsWith("0") && phoneNumber.length == 11) {
    return true;
  }  
    
  return false;
}
