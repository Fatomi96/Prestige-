import { mysql, dbConfig } from "@/lib/mysql"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

export default async function handler(req, res) {
  const now = dayjs().format("YYYY-MM-DD HH:mm:ss")
  const connection = await mysql.createPool(dbConfig)

  try {
    const [results] = await connection.execute(
      `SELECT id FROM  prestigecustomers WHERE uuid = '' LIMIT 100000`
    )
    let i = 0
    if (results.length > 0) {
      results.map(async (result) => {
        const [update] = await connection.execute(
          `UPDATE prestigecustomers SET uuid = ?, created_at = ? WHERE id = ?`,
          [uuidv4(), now, result.id]
        )
        i++
        console.log(`${i} -> ${result.id} updated`)
      })
      return res.status(201).json({
        success: true,
        data: `${i} of ${results.length} records updated`,
        error: null,
      })
    } else {
      return res.status(201).json({
        success: true,
        data: `${i} data updated`,
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
