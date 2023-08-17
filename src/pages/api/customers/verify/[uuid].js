import { connectionPool } from "@/lib/mysql"
import { getCustomer, verifyToken } from "@/lib/utilities"
import dayjs from "dayjs"

export default async function handler(req, res) {
  const connection = await connectionPool.getConnection();
  const auth = await verifyToken(req, res, connection)
  if (!auth.success)
    return res.status(401).json({ success: false, error: auth.error })
  const User = auth.data

  const logmodel = "verifylog"
  const model = "customers"
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
  let customer

  try {
    switch (req.method) {
      case "GET":
        const uuid = req.query.uuid
        // return res.status(400).json({ success: false, error: uuid })
        if (!uuid)
          return res
            .status(400)
            .json({ success: false, error: "Customer not specified" })

        customer = await getCustomer(uuid, connection)
        if (!customer)
          return res.status(404).json({
            success: false,
            data: { uuid },
            error: "Customer not found",
          })

        await connection.beginTransaction()
        await connection.execute(
          `INSERT INTO ${logmodel} SET cuuid = ?, verified_date = ?, verified_by = ?`,
          [customer.uuid, now, User.uuid]
        )
        await connection.execute(
          `UPDATE ${model} SET lastvisit = ? WHERE uuid = ?`,
          [now, customer.uuid]
        )
        await connection.commit()

        connection.release();

        return res.status(201).json({
          success: true,
          data: { customer: { ...customer, lastvisit: now } },
          error: null,
        })
    }
  } catch (error) {
    await connection.rollback()
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message })
  }
  return res
    .status(400)
    .json({ success: false, data: null, error: "No request was recieved" })
}
