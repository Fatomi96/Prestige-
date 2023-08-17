import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken, getCompanion } from "@/lib/utilities";

class CompanionsHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async handleRequest() {
        try {
            if (this.req.method !== "GET") {
                return this.respondWithError(
                    400,
                    "Invalid request method. Only GET requests are allowed for this endpoint."
                );
            }

            const connection = await connectionPool.getConnection();
            const auth = await verifyToken(this.req, this.res, connection);

            if (!auth.success) {
                return this.respondWithError(401, auth.error);
            }

            if (this.req.query?.companionId?.length > 0) {
                const [companionId] = this.req.query.companionId;

                switch (this.req.method) {
                    // FETCH ONE COMPANION
                    case "GET":
                        const companion = await getCompanion(companionId, connection)

                        if (!companion)
                            return this.respondWithError(404, `Companion does not exist`);

                        connection.release();

                        return this.respondWithSuccess({ companion });
                }
            } else {
                // FETCH ALL COMPANIONS
                if (this.req.method === 'GET') {
                    const { page, per_page, fromDate, toDate } = this.req.query;
                    const startDate = new Date(fromDate);
                    const endDate = new Date(toDate);
                    const _page = page ? parseInt(page) : 1;
                    const _per_page = per_page ? parseInt(per_page) : 15;
                    const _offset = (_page - 1) * _per_page;

                    let companions = [];
                    let results = [];
                    let _total_records;
                    let _total_page;

                    if (fromDate && toDate) {
                        const [companionsQuery, resultsQuery] = await Promise.all([
                            connection.execute(
                                `SELECT co.id, co.uuid, co.firstname, co.lastname, co.telephone, co.checkin, co.checkout, co.created_at, co.updated_at, co.customerId AS guest_uuid, CONCAT(c.fname, ' ', c.lname) AS guest_name FROM companions co left join customers c on c.uuid = co.customerId WHERE (co.isDeleted = ?) AND (co.updated_at >= ? OR co.updated_at = ?) AND (co.updated_at <= ? OR co.updated_at = ?) ORDER BY co.id DESC LIMIT ?, ?`, [false, startDate, startDate, endDate, endDate, _offset.toString(), _per_page.toString()]
                            ),
                            connection.execute(
                                `SELECT id FROM companions WHERE (isDeleted = ?) AND (updated_at >= ? OR updated_at = ?) AND (updated_at <= ? OR updated_at = ?) ORDER BY id DESC LIMIT ?, ?`, [false, startDate, startDate, endDate, endDate, _offset.toString(), _per_page.toString()]
                            ),
                        ]);
        
                        companions = companionsQuery[0];
                        results = resultsQuery[0];
                        _total_records = results.length;
                        _total_page = Math.ceil(_total_records / _per_page);
                    } else {
                        const [companionsQuery, resultsQuery] = await Promise.all([
                            connection.execute(
                                `SELECT co.id, co.uuid, co.firstname, co.lastname, co.telephone, co.checkin, co.checkout, co.created_at, co.updated_at, co.customerId AS guest_uuid, CONCAT(c.fname, ' ', c.lname) AS guest_name FROM companions co left join customers c on c.uuid = co.customerId WHERE co.isDeleted = ? ORDER BY co.id DESC LIMIT ?, ?`, [false, _offset.toString(), _per_page.toString()]
                            ),
                            connection.execute(
                                `SELECT id FROM companions WHERE isDeleted = ? ORDER BY id DESC LIMIT ?, ?`, [false, _offset.toString(), _per_page.toString()]
                            ),
                        ]);
        
                        companions = companionsQuery[0];
                        results = resultsQuery[0];
                        _total_records = results.length;
                        _total_page = Math.ceil(_total_records / _per_page);
                    }

                    connection.release();

                    return this.respondWithSuccess({
                        companions,
                        pagination: {
                            current_page: _page,
                            total_pages: _total_page,
                            total_records: _total_records,
                            per_page: _per_page,
                        }
                    });
                }
            }
        } catch (error) {
            console.log(error);
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Fetch companions]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Fetch companions]: Companions fetched successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const companionsHandler = new CompanionsHandler(req, res);
    return companionsHandler.handleRequest();
}
