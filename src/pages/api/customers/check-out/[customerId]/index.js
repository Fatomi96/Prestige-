import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import dayjs from "dayjs";
import { verifyToken } from "@/lib/utilities";

class CustomersHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async handleRequest() {
        try {
            if (this.req.method !== "PUT") {
                return this.respondWithError(
                    400,
                    "Invalid request method. Only PUT requests are allowed for this endpoint."
                );
            }
            
            const connection = await connectionPool.getConnection();
            const auth = await verifyToken(this.req, this.res, connection);

            if (!auth.success) {
                return this.respondWithError(401, auth.error);
            }

            const model = "customers";

            const { customerId } = this.req.query;

            const [guest] = await connection.execute(`SELECT * FROM customers WHERE uuid = ? AND isDeleted = ?`, [customerId, false]);

            if (guest.length == 0) {
                return this.respondWithError(404, `Customer is not a prestige member`);
            }

            if (!guest[0].checkin) {
                return this.respondWithError(406, `${ guest[0]?.telephone } has not checked-in to the lounge`);
            }

            if (guest[0].checkout) {
                return this.respondWithError(406, `${ guest[0]?.telephone } has already checked out of the lounge`);
            }

            await connection.execute(
                `UPDATE ${model} SET checkout = ? WHERE uuid = ?`,
                [
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    customerId
                ]
            )

            connection.release();

            return this.respondWithSuccess({ message: `${ guest[0]?.telephone } has checked out succesfully` });
        } catch (error) {
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Check-out customer]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Check-out customer]: Customer checked-out successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
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
