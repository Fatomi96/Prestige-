import { connectionPool } from "@/lib/mysql";
import { parse } from "json2csv";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

export default async function handler(req, res) {
  const connection = await connectionPool.getConnection();
  const auth = await verifyToken(req, res, connection);
  if (!auth.success)
    return res.status(401).json({ success: false, error: auth.error });

  const model = "customers";

  try {
    switch (req.method) {
      case "GET":
        const { fromDate, toDate } = req.query;
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate)
        let csv;
        if (!fromDate && !toDate) {
          const [customers] = await connection.execute(
            `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} WHERE isDeleted = ? ORDER BY id DESC`, [false]
          );
          const fields = [
            "id",
            "uuid",
            "fname",
            "lname",
            "band",
            "email",
            "telephone",
            "lastvisit",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
          ];

          csv = parse(
            customers.map((item) => ({
              id: item.id,
              uuid: item.uuid,
              fname: item.fname,
              lname: item.lname,
              band: item.band,
              email: item.email,
              telephone: item.telephone,
              lastvisit: item.lastvisit,
              created_at: item.created_at,
              created_by: item.created_by,
              updated_at: item.updated_at,
              updated_by: item.updated_by,
            })),
            { fields }
          );
        } else {
          const [customers] = await connection.execute(
            `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} WHERE (isDeleted = ?) AND (updated_at >= ? OR updated_at = ?) AND (updated_at <= ? OR updated_at = ?) ORDER BY id DESC`,
            [false, startDate, startDate, endDate, endDate]
          );
          const fields = [
            "id",
            "uuid",
            "fname",
            "lname",
            "band",
            "email",
            "telephone",
            "lastvisit",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
          ];

          csv = parse(
            customers.map((item) => ({
              id: item.id,
              uuid: item.uuid,
              fname: item.fname,
              lname: item.lname,
              band: item.band,
              email: item.email,
              telephone: item.telephone,
              lastvisit: item.lastvisit,
              created_at: item.created_at,
              created_by: item.created_by,
              updated_at: item.updated_at,
              updated_by: item.updated_by,
            })),
            { fields }
          );
        }

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="Customers_Record_${new Date().toISOString()}.csv"`
        );

        connection.release();

        res.send(csv);

        logger.info(`[Download customers]: Customers downloaded successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });

        break;
  
      default:
        logger.warn(`[Download customers]: Request method not allowed`, { method: this.req.method, url: this.req.url, status: 405 });
        res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
  } catch (error) {
    connection.rollback();
    logger.error(`[Download customers]: ${ error }`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
    return res
      .status(400)
      .json({ success: false, data: null, error: error.message });
  }
}
