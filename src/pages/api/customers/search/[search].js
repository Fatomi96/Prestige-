import { mysql, dbConfig } from "@/lib/mysql"
import { verifyToken } from "@/lib/utilities"

export default async function handler(req, res) {
  try {
    const connection = await mysql.createPool(dbConfig)
    const auth = await verifyToken(req, res, connection)
    if (!auth.success)
      return res.status(401).json({ success: false, error: auth.error })

    const model = "customers"
    switch (req.method) {
      case "GET":
        const search = req.query.search
        let terms = []
        if (search) terms = decodeURIComponent(req.query.search).split(" ")
        if (terms?.length === 0)
          return res
            .status(400)
            .json({ success: false, error: "Search term not specified" })

        const { page, per_page } = req.query
        const _page = page ? parseInt(page) : 1
        const _per_page = per_page ? parseInt(per_page) : 15
        const query = []
        const bind = []
        if (terms.length !== 2) {
          terms.map((term) => {
            query.push(
              `uuid = ? OR  LCASE(fname) LIKE ? OR  LCASE(lname) LIKE ? OR  LCASE(telephone) LIKE ? OR  LCASE(email) LIKE ?`
            )
            for (let i = 0; i < 5; i++) bind.push(`%${term.toLowerCase()}%`)
          })
        }
        let resultArr = []
        if (terms?.length !== 2) {
          resultArr = await connection.execute(
            `SELECT id FROM  ${model} WHERE ${query.join(" OR ")}`,
            bind
          )
        } else {
          resultArr = await connection.execute(
            `SELECT id FROM  ${model} WHERE (LCASE(fname) LIKE ? AND LCASE(lname) LIKE ?) OR (LCASE(fname) LIKE ? AND LCASE(lname) LIKE ?)`,
            [
              `%${terms[0].toLowerCase()}%`,
              `%${terms[1].toLowerCase()}%`,
              `%${terms[1].toLowerCase()}%`,
              `%${terms[0].toLowerCase()}%`,
            ]
          )
        }
        const [results] = resultArr
        const _total_records = results.length
        const _total_page = Math.ceil(_total_records / _per_page)
        const _offset = (_page - 1) * _per_page
        const path = `${req.headers.host}/api/customers/search/${search}`

        let customersArr = []
        if (terms.length !== 2) {
          customersArr = await connection.execute(
            `SELECT id, uuid, fname, lname, email, band, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} WHERE ${query.join(
              " OR "
            )} ORDER BY fname ASC`,
            bind
          )
        } else {
          customersArr = await connection.execute(
            `SELECT id, uuid, fname, lname, email, band, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} WHERE (LCASE(fname) LIKE ? AND LCASE(lname) LIKE ?) OR (LCASE(fname) LIKE ? AND LCASE(lname) LIKE ?) ORDER BY fname ASC`,
            [
              `%${terms[0].toLowerCase()}%`,
              `%${terms[1].toLowerCase()}%`,
              `%${terms[1].toLowerCase()}%`,
              `%${terms[0].toLowerCase()}%`,
            ]
          )
        }
        const [customers] = customersArr
        const _next_page = _page < _total_page ? _page + 1 : null
        const _prev_page = _page > 1 ? _page - 1 : null
        const pagination = {
          current_page: _page,
          per_page: _per_page,
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
