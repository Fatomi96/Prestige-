import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

class CurrentGuestsHandler {
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

            const { page, per_page } = this.req.query;
            const _page = page ? parseInt(page) : 1;
            const _per_page = per_page ? parseInt(per_page) : 15;
            const _offset = (_page - 1) * _per_page;

            let currentGuest = [];
            let results = [];
            let totalGuestToday;
            let _total_records;
            let _total_page;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [guestsQuery, resultsQuery, guestTodayQuery] = await Promise.all([
                connection.execute(
                    `SELECT id, uuid, concat(fname, ' ', lname) AS name, telephone, email, band, concat (DATE_FORMAT(checkin, '%Y-%m-%d'), ' ',  DATE_FORMAT(checkin, '%h:%i:%s %p')) as checkin, concat (DATE_FORMAT(checkout, '%Y-%m-%d'), ' ',  DATE_FORMAT(checkout, '%h:%i:%s %p')) as checkout FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL AND checkout IS NULL ORDER BY STR_TO_DATE(checkin, '%Y-%m-%d %H:%i:%s') DESC LIMIT ?, ?`,
                    [false, _offset.toString(), _per_page.toString()]
                ),
                connection.execute(`SELECT id FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL AND checkout IS NULL`, [false]),
                connection.execute(`SELECT id FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL AND DATE(checkin) = ?`, [false, today]),
            ]);

            currentGuest = guestsQuery[0];
            totalGuestToday = guestTodayQuery[0]?.length;
            results = resultsQuery[0];
            _total_records = results.length;
            _total_page = Math.ceil(_total_records / _per_page);

            connection.release();

            return this.respondWithSuccess({
                currentGuest,
                totalGuestToday: totalGuestToday,
                totalCurrentGuest: _total_records,
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
        logger.error(`[Current Guests]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error,
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Current Guests]: Current guest fetched successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const currentGuestsHandler = new CurrentGuestsHandler(req, res);
    return currentGuestsHandler.handleRequest();
}
