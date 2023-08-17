import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

class CustomersHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async handleRequest() {
        try {
            if (this.req.method !== "GET") {
                return this.respondWithError(
                    400,
                    "Invalid HTTP request method"
                );
            }

            const connection = await connectionPool.getConnection();
            const auth = await verifyToken(this.req, this.res, connection);

            if (!auth.success) {
                return this.respondWithError(401, auth.error);
            }

            const model = "customers";

            const { page, per_page, fromDate, toDate } = this.req.query;
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);
            const _page = page ? parseInt(page) : 1;
            const _per_page = per_page ? parseInt(per_page) : 15;
            const _offset = (_page - 1) * _per_page;

            let customers;
            let results = [];
            let _total_records;
            let _total_page;

            if (fromDate && toDate) {
                const [customerQuery, resultsQuery] = await Promise.all([
                    connection.execute(
                        `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} WHERE (isDeleted = ?) AND (updated_at >= ?) AND (updated_at <= ?) ORDER BY updated_at DESC LIMIT ?, ?`, [true, startDate, endDate, _offset.toString(), _per_page.toString()]
                    ),
                    connection.execute(
                        `SELECT id FROM ${model} WHERE (isDeleted = ?) AND (updated_at >= ?) AND (updated_at <= ?) ORDER BY id DESC LIMIT ?, ?`, [true, startDate, endDate, _offset.toString(), _per_page.toString()]
                    ),
                ]);

                customers = customerQuery[0];
                results = resultsQuery[0];
                _total_records = results.length;
                _total_page = Math.ceil(_total_records / _per_page);
            } else {
                const [customerQuery, resultsQuery] = await Promise.all([
                    connection.execute(
                        `SELECT id, uuid, band, fname, lname, email, telephone, lastvisit, created_at, created_by, updated_at, updated_by FROM ${model} WHERE isDeleted = ? ORDER BY updated_by DESC LIMIT ?, ?`, [true, _offset.toString(), _per_page.toString()]
                    ),
                    connection.execute(
                        `SELECT id FROM ${model} WHERE isDeleted = ? ORDER BY id DESC LIMIT ?, ?`, [true, _offset.toString(), _per_page.toString()]
                    ),
                ]);

                customers = customerQuery[0];
                results = resultsQuery[0];
                _total_records = results.length;
                _total_page = Math.ceil(_total_records / _per_page);
            }

            connection.release();

            return this.respondWithSuccess({
                customers,
                pagination: {
                    current_page: _page,
                    total_pages: _total_page,
                    total_records: _total_records,
                    per_page: _per_page,
                }
            });
        } catch (error) {
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Deleted customer]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Deleted customer]: Customer deleted successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const customersHandler = new CustomersHandler(req, res);
    return customersHandler.handleRequest();
}
