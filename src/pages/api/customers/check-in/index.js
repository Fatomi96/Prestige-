import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import dayjs from "dayjs";
import { verifyToken, msisdn, validatePhoneNumber } from "@/lib/utilities";

class CustomersHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async handleRequest() {
        try {
            if (this.req.method !== "POST") {
                return this.respondWithError(
                    400,
                    "Invalid request method. Only POST requests are allowed for this endpoint."
                );
            }

            const connection = await connectionPool.getConnection();
            const auth = await verifyToken(this.req, this.res, connection);

            if (!auth.success) {
                return this.respondWithError(401, auth.error);
            }

            const model = "customers";
            const { phoneNumber } = this.req.body;

            const isValidPhoneNumber = validatePhoneNumber(phoneNumber);

            if (!isValidPhoneNumber) {
                return this.respondWithError(400, 'Invalid Phone Number');
            }

            const [guest] = await connection.execute(`SELECT * FROM customers WHERE telephone = ? AND isDeleted = ?`, [msisdn(phoneNumber), false]);

            if (guest.length == 0) {
                return this.respondWithError(404, `${ msisdn(phoneNumber) } is not a prestige member`);
            }

            if (guest[0].checkout) {
                await connection.execute(
                    `UPDATE ${model} SET checkout = ?, checkin = ? WHERE telephone = ?`,
                    [
                        null,
                        null,
                        msisdn(phoneNumber)
                    ]
                )
            }

            await connection.execute(
                `UPDATE ${model} SET checkin = ? WHERE telephone = ?`,
                [
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    msisdn(phoneNumber)
                ]
            )

            const [checkedInGuest] = await connection.execute(`SELECT * FROM customers WHERE telephone = ?`, [msisdn(phoneNumber)]);

            connection.release();

            return this.respondWithSuccess(checkedInGuest);
        } catch (error) {
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Check-in customer]: ${error}`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Check-in customer]: Customer checked-in successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
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
