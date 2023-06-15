import { mysql, dbConfig } from "@/lib/mysql"
import {
  validateEmail,
  getCustomer,
  verifyToken,
  msisdn,
} from "@/lib/utilities"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

export default async function handler(req, res) {
  try {
    const connection = await mysql.createPool(dbConfig)
    const auth = await verifyToken(req, res, connection)
    if (!auth.success)
      return res.status(401).json({ success: false, error: auth.error })
    const User = auth.data

    const model = "customers"
    let customer
    const params = req.query.cuuid
    if ((req.method === "PUT" || req.method === "DELETE") && !params)
      return res
        .status(400)
        .json({ success: false, error: "Customer not specified" })

    if (params) {
      const [cuuid] = params

      switch (req.method) {
        // GET SINGLE CUSTOMER
        case "GET":
          customer = await getCustomer(cuuid, connection)
          if (!customer)
            return res
              .status(404)
              .json({ success: false, data: {}, error: "Customer not found" })

          return res
            .status(200)
            .json({ success: true, data: { customer }, error: null })

        // UPDATE CUSTOMER
        case "PUT":
          const updateData = req.body
          if (!updateData.fname)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Firstname is required",
            })

          if (updateData.email && !validateEmail(updateData.email))
            return res
              .status(400)
              .json({ success: false, data: null, error: "Email is invalid" })
          if (!updateData.telephone)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Telephone is required",
            })
          customer = await getCustomer(cuuid, connection)
          if (!customer)
            return res
              .status(404)
              .json({ success: false, data: {}, error: "Customer not found" })

          const [check] = await connection.execute(
            `SELECT id FROM customers WHERE telephone = ? AND uuid <> ?`,
            [msisdn(postData.telephone), cuuid]
          )
          if (check.length > 0)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Customer with the same MSISDN already exists",
            })

          const [update] = await connection.execute(
            `UPDATE ${model} SET fname = ?, lname = ?, email = ?, telephone = ?, updated_at = ?, updated_by = ? WHERE uuid = ?`,
            [
              updateData.fname,
              updateData.lname,
              updateData.email,
              msisdn(updateData.telephone),
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              User.uuid,
              cuuid,
            ]
          )
          if (update.affectedRows)
            return res.status(201).json({
              success: true,
              data: {
                customer: { ...customer, ...updateData },
                affectedrows: update.affectedRows,
              },
              error: null,
            })

          return res.status(200).json({
            success: false,
            data: null,
            error: "Something went wrong",
          })

        // DELETE CUSTOMER
        case "DELETE":
          customer = await getCustomer(cuuid, connection)
          if (!customer)
            return res
              .status(404)
              .json({ success: false, data: {}, error: "Customer not found" })

          const [del] = await connection.execute(
            `DELETE FROM ${model} WHERE uuid = ?`,
            [cuuid]
          )
          if (del.affectedRows)
            return res.status(201).json({
              success: true,
              data: { customer, affectedrows: del.affectedRows },
            })

          return res.status(200).json({
            success: false,
            data: null,
            error: "Something went wrong",
          })
      }
    } else {
      switch (req.method) {
        // GET ALL CUSTOMERS
        case "GET":
          const { page, per_page } = req.query
          const _page = page ? parseInt(page) : 1
          const _per_page = per_page ? parseInt(per_page) : 15
          const [results] = await connection.execute(`SELECT id FROM ${model}`)
          const _total_records = results.length
          const _total_page = Math.ceil(_total_records / _per_page)
          const _offset = (_page - 1) * _per_page
          const path = `${req.headers.host}/api/customers`
          const [customers] = await connection.execute(
            `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} ORDER BY id DESC limit ?, ?`,
            [_offset.toString(), _per_page.toString()]
          )
          const _next_page = _page < _total_page ? _page + 1 : null
          const _prev_page = _page > 1 ? _page - 1 : null
          const pagination = {
            current_page: _page,
            per_page: _per_page,
            total_page: _total_page,
            from: _offset + 1,
            to: _offset + customers.length,
            current_records: customers.length,
            total_records: _total_records,
            first_page_url: _page > 1 ? `${path}/?page=1` : null,
            last_page_url:
              _page < _total_page ? `${path}/?page=${_total_page}` : null,
            next_page_url: _next_page ? `${path}/?page=${_next_page}` : null,
            prev_page_url: _prev_page ? `${path}/?page=${_prev_page}` : null,
            path: path,
          }
          return res.status(200).json({
            success: true,
            data: { customers, pagination },
            error: null,
          })

        // CREATE CUSTOMER
        case "POST":
          const postData = req.body
          if (!postData.fname)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Firstname is required",
            })
          if (postData.email && !validateEmail(postData.email))
            return res
              .status(400)
              .json({ success: false, data: null, error: "Email is invalid" })
          if (!postData.telephone)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Telephone is required",
            })
          if (!postData.band)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Customer band is required",
            })

          const [check] = await connection.execute(
            `SELECT id FROM customers WHERE telephone = ?`,
            [msisdn(postData.telephone)]
          )
          if (check.length > 0)
            return res.status(400).json({
              success: false,
              data: null,
              error: "Customer with the same MSISDN already exists",
            })

          const uuid = uuidv4()

          const [post] = await connection.execute(
            `INSERT INTO ${model} SET uuid = ?, fname = ?, lname = ?, email = ?, band = ?, telephone = ?, lastvisit = ?, created_at = ?, created_by = ?, updated_at = ?, updated_by = ?`,
            [
              uuid,
              postData.fname,
              postData.lname,
              postData.email,
              postData.band,
              msisdn(postData.telephone),
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              User.uuid,
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              "",
            ]
          )
          if (post.insertId) {
            customer = await getCustomer(uuid, connection)
            return res.status(201).json({
              success: true,
              data: { customer },
              error: null,
            })
          }
          return res.status(400).json({
            success: false,
            data: null,
            error: "Something went wrong",
          })
      }
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message })
  }

  return res
    .status(400)
    .json({ success: false, data: null, error: "No request was recieved" })
}
