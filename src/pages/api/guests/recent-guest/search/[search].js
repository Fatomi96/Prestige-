import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

class SearchRecentGuestHandler {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async handleRequest() {
    try {
      if (this.req.method !== "GET") {
        return this.respondWithError(400, "Invalid HTTP request method");
      }

      const connection = await connectionPool.getConnection();
      const auth = await verifyToken(this.req, this.res, connection);

      if (!auth.success) {
        return this.respondWithError(401, auth.error);
      }

      const model = "customers";
      const { page, per_page } = this.req.query;
      const _page = page ? parseInt(page) : 1;
      const _per_page = per_page ? parseInt(per_page) : 15;
      const _offset = (_page - 1) * _per_page;

      const search = this.req.query.search;
      const terms = search ? decodeURIComponent(search).split(" ") : [];
      if (terms.length === 0) {
        return this.respondWithError(400, "Search term not specified");
      }

      const query = [];
      const bind = [];
      terms.forEach((term) => {
        query.push(
          "checkin IS NOT NULL AND isDeleted = ? AND (uuid = ? OR LCASE(fname) LIKE ? OR LCASE(lname) LIKE ? OR LCASE(telephone) LIKE ? OR LCASE(email) LIKE ?)"
        );
        bind.push(false, ...Array.from({ length: 5 }, () => `%${term.toLowerCase()}%`));
      });

      const [resultsQuery] = await connection.execute(
        `SELECT id FROM ${model} WHERE ${query.join(" OR ")}`,
        bind
      );

      const _total_records = resultsQuery.length;
      const _total_page = Math.ceil(_total_records / _per_page);

      const [searchResult] = await connection.execute(
        `SELECT id, uuid, concat(fname, ' ', lname) AS name, telephone, email, telephone, band, checkin, checkout FROM ${model} WHERE ${query.join(" OR ")} ORDER BY checkin DESC LIMIT ?, ?`,
        [...bind, _offset.toString(), _per_page.toString()]
      );

      connection.release();

      return this.respondWithSuccess({
        searchResult,
        pagination: {
            current_page: _page,
            total_pages: _total_page,
            total_records: _total_records,
            per_page: _per_page,
        },
      });
    } catch (error) {
      return this.respondWithError(400, error.message);
    }
  }

  respondWithError(statusCode, error) {
    logger.error(`[Search Guests]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
    return this.res.status(statusCode).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondWithSuccess(data) {
    logger.info(`[Search Guests]: Guest search successful`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
    return this.res.status(200).json({
      success: true,
      data: data,
      error: null,
    });
  }
}

export default async function handler(req, res) {
  const searchRecentGuestHandler = new SearchRecentGuestHandler(req, res);
  return searchRecentGuestHandler.handleRequest();
}
