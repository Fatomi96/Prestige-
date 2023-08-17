import { parse } from "json2csv";
import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

export default async function handler(req, res) {
  const connection = await connectionPool.getConnection();
  const auth = await verifyToken(req, res, connection);
  if (!auth.success)
    return res.status(401).json({ success: false, error: auth.error });

  try {
    switch (req.method) {
      case "GET":
        const { fromDate, toDate } = req.query;
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate)
        let csv;
        if (!fromDate && !toDate) {
          const [guests] = await connection.execute(
            `SELECT id, fname, lname, telephone, email, band, checkin, checkout FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL ORDER BY checkin DESC`, [false]
          );
          const fields = [
            "id",
            "fname",
            "lname",
            "telephone",
            "email",
            "band",
            "checkin",
            "checkout",
          ];

          csv = parse(
            guests.map((item) => ({
              id: item.id,
              fname: item.fname,
              lname: item.lname,
              telephone: item.telephone,
              email: item.email,
              band: item.band,
              checkin: item.checkin,
              checkout: item.checkout,
            })),
            { fields }
          );
        } else {
          const [guests] = await connection.execute(
            `SELECT id, fname, lname, telephone, email, band, checkin, checkout FROM customers WHERE checkin IS NOT NULL AND isDeleted = ? AND checkin >= ? AND DATE(checkin) <= ? ORDER BY checkin DESC`,
            [false, startDate, endDate]
          );
          const fields = [
            "id",
            "fname",
            "lname",
            "telephone",
            "email",
            "band",
            "checkin",
            "checkout",
          ];

          csv = parse(
            guests.map((item) => ({
                id: item.id,
                fname: item.fname,
                lname: item.lname,
                telephone: item.telephone,
                email: item.email,
                band: item.band,
                checkin: item.checkin,
                checkout: item.checkout,
            })),
            { fields }
          );
        }

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="Recent_Guest_Record_${new Date().toISOString()}.csv"`
        );

        connection.release();

        res.send(csv);

        logger.info(`[Download Recent Guest]: Recent guest downloaded successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });

        break;
  
      default:
        logger.warn(`[Download Recent Guest]: Request method not allowed`, { method: this.req.method, url: this.req.url, status: 405 });
        res.status(405).json({ success: false, error: "Method Not Allowed" });
    }
  } catch (error) {
    await connection.rollback();
    logger.error(`[Download Recent Guest]: ${ error }`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
    return res
      .status(500)
      .json({ success: false, data: null, error: error.message });
  }
}
