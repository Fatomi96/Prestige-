import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken, msisdn, validatePhoneNumber } from "@/lib/utilities";
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs";

class AddCompanionHandler {
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

            if (!auth.success)
                return this.respondWithError(401, auth.error);

            const admin = auth?.data;
            const { memberId, firstName, lastName, phoneNumber } = this.req.body;

            if (memberId && firstName && lastName && phoneNumber) {
                const isValidPhoneNumber = validatePhoneNumber(phoneNumber);

                if (!isValidPhoneNumber) {
                    return this.respondWithError(400, 'Invalid Phone Number');
                }
                const [guest] = await connection.execute(`SELECT * FROM customers WHERE uuid = ? AND isDeleted = ?`, [memberId, false]);

                if (guest.length == 0) {
                    return this.respondWithError(404, `This user is not a prestige member`);
                }

                if (!guest[0].checkin) {
                    return this.respondWithError(406, 'Prestige member must be admitted before admitting companion');
                }

                const [companion] = await connection.execute(`SELECT * FROM companions WHERE telephone = ? AND isDeleted = ?`, [msisdn(phoneNumber), false]);

                if (companion.length > 0) {
                    await connection.execute(
                        `UPDATE companions SET checkout = ?, checkin = ?, updated_at = ?, updated_by = ?, customerId = ? WHERE telephone = ?`,
                        [
                            null,
                            dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            admin.uuid,
                            guest[0].uuid,
                            msisdn(phoneNumber)
                        ]
                    );
                } else {
                    const uuid = uuidv4();
                    await connection.execute(
                        `INSERT INTO companions SET uuid = ?, firstname = ?, lastname = ?, telephone = ?, created_at = ?, created_by = ?, updated_at = ?, updated_by = ?, checkin = ?, customerId = ?`,
                        [
                            uuid,
                            firstName,
                            lastName,
                            msisdn(phoneNumber),
                            dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            admin.uuid,
                            dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            admin.uuid,
                            dayjs().format("YYYY-MM-DD HH:mm:ss"),
                            guest[0].uuid,
                        ]
                    );
                }

                connection.release();

                return this.respondWithSuccess({ message: `Companion has been added to the lounge succesfully` });
            }
            return this.respondWithError(400, 'Invalid/missing payload');
        } catch (error) {
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Add companion]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Add companion]: Companion added successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const addCompanionHandler = new AddCompanionHandler(req, res);
    return addCompanionHandler.handleRequest();
}