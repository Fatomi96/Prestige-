import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

class RecentGuestHandler {
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

            const { page, per_page, fromDate, toDate } = this.req.query;
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);
            const _page = page ? parseInt(page) : 1;
            const _per_page = per_page ? parseInt(per_page) : 15;
            const _offset = (_page - 1) * _per_page;

            let guests = [];
            let results = [];
            let _total_records;
            let _total_page;

            if (fromDate && toDate) {
                const [guestsQuery, resultsQuery] = await Promise.all([
                    connection.execute(
                        `SELECT id, uuid, concat(fname, ' ', lname) AS name, telephone, email, band, concat (DATE_FORMAT(checkin, '%Y-%m-%d'), ' ',  DATE_FORMAT(checkin, '%h:%i:%s %p')) as checkin, concat (DATE_FORMAT(checkout, '%Y-%m-%d'), ' ',  DATE_FORMAT(checkout, '%h:%i:%s %p')) as checkout FROM customers WHERE checkin IS NOT NULL AND isDeleted = ? AND checkin >= ? AND DATE(checkin) <= ? ORDER BY STR_TO_DATE(checkin, '%Y-%m-%d %H:%i:%s') DESC LIMIT ?, ?`,
                        [false, startDate, endDate, _offset.toString(), _per_page.toString()]
                    ),
                    connection.execute(
                        `SELECT id FROM customers WHERE checkin IS NOT NULL AND isDeleted = ? AND checkin >= ? AND DATE(checkin) <= ? ORDER BY checkin DESC LIMIT ?, ?`,
                        [false, startDate, endDate, _offset.toString(), _per_page.toString()]
                    ),
                ]);

                guests = guestsQuery[0];
                results = resultsQuery[0];
                _total_records = results.length;
                _total_page = Math.ceil(_total_records / _per_page);
            } else {
                const [guestsQuery, resultsQuery] = await Promise.all([
                    connection.execute(
                        `SELECT id, uuid, concat(fname, ' ', lname) AS name, telephone, email, band, concat (DATE_FORMAT(checkin, '%Y-%m-%d'), ' ',  DATE_FORMAT(checkin, '%h:%i:%s %p')) as checkin, concat (DATE_FORMAT(checkout, '%Y-%m-%d'), ' ',  DATE_FORMAT(checkout, '%h:%i:%s %p')) as checkout FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL ORDER BY STR_TO_DATE(checkin, '%Y-%m-%d %H:%i:%s') DESC LIMIT ?, ?`,
                        [false, _offset.toString(), _per_page.toString()]
                    ),
                    connection.execute(`SELECT id FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL`, [false]),
                ]);

                guests = guestsQuery[0];
                results = resultsQuery[0];
                _total_records = results.length;
                _total_page = Math.ceil(_total_records / _per_page);
            }

            connection.release();

            return this.respondWithSuccess({
                guests,
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
        logger.error(`[Recent Guest]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error,
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Recent Guest]: Recent guest(s) fetched successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const recentGuestHandler = new RecentGuestHandler(req, res);
    return recentGuestHandler.handleRequest();
}
