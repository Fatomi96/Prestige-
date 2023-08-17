import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { validateEmail, getCustomer, verifyToken, msisdn, validatePhoneNumber } from "@/lib/utilities";

class CustomerHandler {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async handleRequest() {
    try {
      const connection = await connectionPool.getConnection();
      const auth = await verifyToken(this.req, this.res, connection);

      if (!auth.success) {
        connection.release();
        return this.respondUnauthorized(auth.error);
      }

      const user = auth.data;
      const method = this.req.method;
      const queryParams = this.req.query.cuuid;

      if ((method === "PUT" || method === "DELETE") && !queryParams) {
        connection.release();
        return this.respondBadRequest("Invalid/missing payload");
      }

      if (queryParams) {
        const [cuuid] = queryParams;

        switch (method) {
          case "GET":
            return this.getSingleCustomer(cuuid, connection);

          case "PUT":
            return this.updateCustomer(cuuid, user, connection);

          case "DELETE":
            return this.deleteCustomer(cuuid, connection);
        }
      } else {
        switch (method) {
          case "GET":
            return this.getAllCustomers(connection);

          case "POST":
            return this.createCustomer(user, connection);
        }
      }
    } catch (error) {
      return this.respondWithError(500, error);
    }
  }

  async getSingleCustomer(cuuid, connection) {
    try {
      const customer = await getCustomer(cuuid, connection);

      if (!customer) {
        connection.release();
        return this.respondNotFound("Customer not found");
      }

      connection.release();
      return this.respondSuccess({ customer });
    } catch (error) {
      connection.release();
      return this.respondWithError(500, error);
    }
  }

  async updateCustomer(cuuid, user, connection) {
    try {
      const updateData = this.req.body;

      if (!updateData.fname) {
        connection.release();
        return this.respondBadRequest("Firstname is required");
      }

      if (!updateData.lname) {
        connection.release();
        return this.respondBadRequest("Lastname is required");
      }

      if (updateData.email && !validateEmail(updateData.email)) {
        connection.release();
        return this.respondBadRequest("Email is invalid");
      }

      if (!updateData.telephone) {
        connection.release();
        return this.respondBadRequest("Telephone is required");
      }

      const isValidPhoneNumber = validatePhoneNumber(updateData.telephone);

      if (!isValidPhoneNumber) {
        return this.respondBadRequest("Invalid Telephone");
      }

      const customer = await getCustomer(cuuid, connection);
      if (!customer) {
        connection.release();
        return this.respondNotFound("Customer not found");
      }

      const [check] = await connection.execute(
        `SELECT id FROM customers WHERE telephone = ? AND uuid <> ?`,
        [msisdn(updateData.telephone), cuuid]
      );

      if (check.length > 0) {
        connection.release();
        return this.respondBadRequest("Customer with the same MSISDN already exists");
      }

      const [update] = await connection.execute(
        `UPDATE customers SET fname = ?, lname = ?, email = ?, telephone = ?, updated_at = ?, updated_by = ? WHERE uuid = ?`,
        [
          updateData.fname,
          updateData.lname,
          updateData.email,
          msisdn(updateData.telephone),
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          user.uuid,
          cuuid,
        ]
      );

      if (update.affectedRows) {
        connection.release();
        return this.respondSuccess({
          customer: { ...customer, ...updateData },
          affectedrows: update.affectedRows,
        });
      }

      connection.release();
    } catch (error) {
      connection.rollback();
      return this.respondWithError(500, error);
    }
  }

  async deleteCustomer(cuuid, connection) {
    try {
      const customer = await getCustomer(cuuid, connection);

      if (!customer) {
        connection.release();
        return this.respondNotFound("Customer not found");
      }

      const [del] = await connection.execute(
        `UPDATE customers SET isDeleted = ? WHERE uuid = ?`,
        [true, cuuid]
      );

      if (del.affectedRows) {
        connection.release();
        return this.respondSuccess({
          customer,
          affectedrows: del.affectedRows,
        });
      }

      connection.release();
    } catch (error) {
      connection.rollback();
      return this.respondWithError(500, error);
    }
  }

  async getAllCustomers(connection) {
    try {
      const { page, per_page, fromDate, toDate } = this.req.query;
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      const _page = page ? parseInt(page) : 1;
      const _per_page = per_page ? parseInt(per_page) : 15;
      const _offset = (_page - 1) * _per_page;

      let _total_records;
      let _total_page;

      let customersQuery;
      let customersCountQuery;

      if (fromDate && toDate) {
        [customersQuery] = await connection.execute(
          `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM customers WHERE (isDeleted = ?) AND (updated_at >= ? OR updated_at = ?) AND (updated_at <= ? OR updated_at = ?) ORDER BY id DESC LIMIT ?, ?`,
          [
            false,
            startDate,
            startDate,
            endDate,
            endDate,
            _offset.toString(),
            _per_page.toString(),
          ]
        );
      } else {
        [customersQuery, customersCountQuery] = await Promise.all([
          connection.execute(
            `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM customers WHERE isDeleted = ? ORDER BY id DESC LIMIT ?, ?`,
            [false, _offset.toString(), _per_page.toString()]
          ),
          connection.execute(`SELECT id FROM customers WHERE isDeleted = ?`, [false])
        ])
      }

      const customers = customersQuery[0];
      _total_records = customersCountQuery[0]?.length;
      _total_page = Math.ceil(_total_records / _per_page);

      connection.release();
      return this.respondSuccess({
        customers,
        pagination: {
          current_page: _page,
          total_pages: _total_page,
          total_records: _total_records,
          per_page: _per_page,
        }
      });
    } catch (error) {
      connection.release();
      return this.respondWithError(500, error);
    }
  }

  async createCustomer(user, connection) {
    try {
      const postData = this.req.body;

      if (!postData.fname) {
        connection.release();
        return this.respondBadRequest("Firstname is required");
      }

      if (postData.email && !validateEmail(postData.email)) {
        connection.release();
        return this.respondBadRequest("Email is invalid");
      }

      if (!postData.telephone) {
        connection.release();
        return this.respondBadRequest("Telephone is required");
      }

      if (!postData.band) {
        connection.release();
        return this.respondBadRequest("Customer band is required");
      }

      const isValidPhoneNumber = validatePhoneNumber(postData.telephone);

      if (!isValidPhoneNumber) {
        return this.respondBadRequest("Invalid Telephone");
      }

      const [check] = await connection.execute(
        `SELECT id FROM customers WHERE telephone = ?`,
        [msisdn(postData.telephone)]
      );

      if (check.length > 0) {
        connection.release();
        return this.respondBadRequest("Customer with the same MSISDN already exists");
      }

      const cuuid = uuidv4();
      const [post] = await connection.execute(
        `INSERT INTO customers SET uuid = ?, fname = ?, lname = ?, email = ?, band = ?, telephone = ?, lastvisit = ?, created_at = ?, created_by = ?, updated_at = ?, updated_by = ?`,
        [
          cuuid,
          postData.fname,
          postData.lname,
          postData.email,
          postData.band,
          msisdn(postData.telephone),
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          user.uuid,
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
          "",
        ]
      );

      if (post.insertId) {
        const customer = await getCustomer(cuuid, connection);
        connection.release();
        return this.respondSuccess({ customer });
      }

      connection.release();
    } catch (error) {
      connection.rollback();
      return this.respondWithError(500, error);
    }
  }

  respondSuccess(data) {
    logger.info(`[Customer [FETCH, UPDATE, DELETE, CREATE]]: Operation successful`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
    return this.res.status(200).json({
      success: true,
      data: data,
      error: null,
    });
  }

  respondUnauthorized(error) {
    logger.warn(`[Unauthorized access - customer]`, { method: this.req.method, url: this.req.url, status: 401 });
    return this.res.status(401).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondBadRequest(error) {
    logger.warn(`[Bad Request - customer]`, { method: this.req.method, url: this.req.url, status: 400 });
    return this.res.status(400).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondWithError(statusCode, error) {
    logger.error(`[Customer [FETCH, UPDATE, DELETE, CREATE]]: ${error}`, { method: this.req.method, url: this.req.url, status: statusCode });
    return this.res.status(500).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondNotFound(error) {
    logger.warn(`[Customer [FETCH, UPDATE, DELETE, CREATE]]: Resource not found`, { method: this.req.method, url: this.req.url, status: 404 });
    return this.res.status(404).json({
      success: false,
      data: {},
      error: error,
    });
  }
}

export default async function handler(req, res) {
  const customerHandler = new CustomerHandler(req, res);
  return customerHandler.handleRequest();
}
