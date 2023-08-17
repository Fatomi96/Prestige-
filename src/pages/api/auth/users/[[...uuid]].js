import { connectionPool } from "@/lib/mysql";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import logger from "@/lib/logger";
import { validateEmail, getUser, verifyToken, msisdn, validatePhoneNumber } from "@/lib/utilities";

export default async function handler(req, res) {
  try {
    const connection = await connectionPool.getConnection();
    const auth = await verifyToken(req, res, connection);

    if (!auth.success) {
      logger.warn(`[Authentication]: ${auth.error}`, { method: req.method, url: req.url, status: 401 });

      return res.status(401).json({ success: false, error: auth.error })
    }

    const User = auth.data
    const params = req.query.uuid;

    let user;

    if ((req.method === "PUT" || req.method === "DELETE") && !params) {
      logger.warn(`[Bad Request]: Invalid/missing payload`, { method: req.method, url: req.url, status: 400 });

      return res.status(400).json({ success: false, error: "Invalid/missing payload" })
    }

    if (params) {
      const [uuid] = params

      switch (req.method) {
        // GET SINGLE USER
        case "GET":
          user = await getUser(uuid, connection)
          if (!user) {
            logger.warn(`[Resource not found]: User not found`, { method: req.method, url: req.url, status: 404 });

            return res.status(404).json({ success: false, data: {}, error: "User not found" })
          }
          delete user.token

          connection.release();

          logger.info(`[Admin]: Admin fetched successfully`, { method: req.method, url: req.url, status: 200 });
          return res.status(200).json({ success: true, data: { user }, error: null })

        // UPDATE USER
        case "PUT":
          const updateData = req.body
          if (!updateData.username) {
            logger.warn(`[Bad Request]: Username is required`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({
              success: false,
              data: null,
              error: "Username is required",
            })
          }

          if (!updateData.email) {
            logger.warn(`[Bad Request]: Email is required`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({ success: false, data: null, error: "Email is required" })
          }

          if (!validateEmail(updateData.email)) {
            logger.warn(`[Bad Request]: Email is invalid`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({ success: false, data: null, error: "Email is invalid" })
          }

          if (!updateData.telephone) {
            logger.warn(`[Bad Request]: Telephone is required`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({
              success: false,
              data: null,
              error: "Telephone is required",
            })
          }

          const isValidPhoneNumber = validatePhoneNumber(updateData.telephone);

          if (!isValidPhoneNumber) {
            logger.warn(`[Bad Request]: Invalid Telephone`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({
              success: false,
              data: null,
              error: "Invalid Telephone",
            })
          }

          const [check] = await connection.execute(
            `SELECT * FROM users WHERE (LCASE(username) = ? OR telephone = ? OR  LCASE(email) = ?) AND uuid <> ?`,
            [
              updateData.username.toLowerCase(),
              msisdn(updateData.telephone),
              updateData.email.toLowerCase(),
              uuid,
            ]
          )
          if (check.length > 0) {
            logger.warn(`[Resource Exist]: A user with the same username, email or telephone already exist`, { method: req.method, url: req.url, status: 406 });

            return res.status(406).json({
              success: false,
              data: null,
              error:
                "A user with the same username, email or telephone already exist",
            })
          }

          user = await getUser(uuid, connection)
          if (!user) {
            logger.warn(`[Resource not found]: User not found`, { method: req.method, url: req.url, status: 404 });

            return res.status(404).json({ success: false, data: {}, error: "User not found" })
          }

          delete user.token

          const [update] = await connection.execute(
            `UPDATE users SET username = ?, email = ?, telephone = ?, updated_at = ?, updated_by = ? WHERE uuid = ?`,
            [
              updateData.username,
              updateData.email,
              msisdn(updateData.telephone),
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              User.uuid,
              uuid,
            ]
          )

          if (update.affectedRows) {
            logger.info(`[Update Admin]: Admin updated successfully`, { method: req.method, url: req.url, status: 200 });

            return res.status(201).json({
              success: true,
              data: {
                user: { ...user, ...updateData },
                affectedrows: update.affectedRows,
              },
              error: null,
            })
          }

          connection.release();

          logger.error(`[Update Admin]: Update Admin failed`, { method: req.method, url: req.url, status: 500 });

          return res.status(500).json({
            success: false,
            data: null,
            error: "Update Admin failed.",
          })

        // DELETE A USER
        case "DELETE":
          user = await getUser(uuid, connection);

          if (!user) {
            logger.warn(`[Resource not found]: User not found`, { method: req.method, url: req.url, status: 404 });

            return res.status(404).json({ success: false, data: {}, error: "User not found" })
          }

          delete user.token

          const [del] = await connection.execute(
            `DELETE FROM users WHERE uuid = ?`,
            [uuid]
          )
          if (del.affectedRows) {
            logger.info(`[Delete Admin]: Deleted admin successfully`, { method: req.method, url: req.url, status: 200 });

            return res.status(200).json({
              success: true,
              data: { user, affectedrows: del.affectedRows },
            })
          }

          connection.release();

          logger.error(`[Delete Admin]: Delete Admin failed`, { method: req.method, url: req.url, status: 500 });

          return res.status(500).json({
            success: false,
            data: null,
            error: "Delete Admin failed",
          })
      }
    } else {
      switch (req.method) {
        // GET ALL USERS
        case "GET":
          const { page, per_page } = req.query
          const _page = page ? parseInt(page) : 1
          const _per_page = per_page ? parseInt(per_page) : 15
          const [results] = await connection.execute(`SELECT id FROM users`)
          const _total_records = results.length
          const _total_page = Math.ceil(_total_records / _per_page)
          const _offset = (_page - 1) * _per_page
          const path = `${req.headers.host}/api/auth/users`

          const [users] = await connection.execute(
            `SELECT id, uuid, username, fullname, email, telephone, lastlogin, created_at, created_by, updated_at, updated_by FROM users ORDER BY id DESC limit ?, ?`,
            [_offset.toString(), _per_page.toString()]
          )
          const _next_page = _page < _total_page ? _page + 1 : null
          const _prev_page = _page > 1 ? _page - 1 : null
          const pagination = {
            current_page: _page,
            per_page: _per_page,
            total_page: _total_page,
            from: _offset + 1,
            to: _offset + users.length,
            current_records: users.length,
            total_records: _total_records,
            first_page_url: _page > 1 ? `${path}/?page=1` : null,
            last_page_url:
              _page < _total_page ? `${path}/?page=${_total_page}` : null,
            next_page_url: _next_page ? `${path}/?page=${_next_page}` : null,
            prev_page_url: _prev_page ? `${path}/?page=${_prev_page}` : null,
            path: path,
          }

          connection.release();

          logger.info(`[Fetch all admin]: Admin fetched successfully`, { method: req.method, url: req.url, status: 200 });

          return res.status(200).json({
            success: true,
            data: { users, pagination },
            error: null,
          })

        // ADD NEW USER
        case "POST":
          const postData = req.body
          if (!postData.username) {
            logger.warn(`[Bad Request]: Username is required`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({
              success: false,
              data: null,
              error: "Username is required",
            })
          }

          if (!postData.email) {
            logger.warn(`[Bad Request]: Email is required`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({ success: false, data: null, error: "Email is required" })
          }

          if (!validateEmail(postData.email)) {
            logger.warn(`[Bad Request]: Email is invalid`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({ success: false, data: null, error: "Email is invalid" })
          }

          if (!postData.telephone) {
            logger.warn(`[Bad Request]: Telephone is required`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({
              success: false,
              data: null,
              error: "Telephone is required",
            })
          }

          const isValidPhoneNumber = validatePhoneNumber(postData.telephone);

          if (!isValidPhoneNumber) {
            logger.warn(`[Bad Request]: Invalid Telephone`, { method: req.method, url: req.url, status: 400 });

            return res.status(400).json({
              success: false,
              data: null,
              error: "Invalid Telephone",
            })
          }

          const [check] = await connection.execute(
            `SELECT * FROM users WHERE LCASE(username) = ? OR telephone = ? OR  LCASE(email) = ?`,
            [
              postData.username.toLowerCase(),
              msisdn(postData.telephone),
              postData.email.toLowerCase(),
            ]
          )

          if (check.length > 0) {
            logger.warn(`[Resource Exist]: A user with the same username, email or telephone already exist`, { method: req.method, url: req.url, status: 406 });

            return res.status(400).json({
              success: false,
              data: null,
              error:
                "A user with the same username, email or telephone already exist",
            })
          }

          const uuid = uuidv4()

          const [post] = await connection.execute(
            `INSERT INTO users SET uuid = ?, username = ?, token = ?, email = ?, password = ?, telephone = ?, created_at = ?, created_by = ?, updated_at = ?, updated_by = ?`,
            [
              uuid,
              postData.username,
              "",
              postData.email,
              "",
              msisdn(postData.telephone),
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              User.uuid,
              dayjs().format("YYYY-MM-DD HH:mm:ss"),
              "",
            ]
          )
          if (post.insertId) {
            user = await getUser(uuid, connection);

            delete user.token;

            logger.info(`[Create Admin]: Admin created successfully`, { method: req.method, url: req.url, status: 201 });

            return res.status(201).json({
              success: true,
              data: { user },
              error: null,
            })
          }

          connection.release();

          logger.error(`[Create Admin]: Create Admin failed`, { method: req.method, url: req.url, status: 500 });

          return res.status(500).json({
            success: false,
            data: null,
            error: "Create Admin failed",
          })
      }
    }
  } catch (error) {
    logger.error(`[Admin]: ${error?.message}`, { method: req.method, url: req.url, status: 500 });
    return res.status(500).json({ success: false, data: null, error: error.message })
  }
}
