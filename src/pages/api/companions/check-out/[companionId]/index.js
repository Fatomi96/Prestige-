import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";
import dayjs from "dayjs";

class CompanionCheckoutHandler {
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

            if (!auth.success)
                return this.respondWithError(401, auth.error);

            const model = "companions";
            const { companionId } = this.req.query;
            const [companion] = await connection.execute(`SELECT * FROM companions WHERE uuid = ? AND isDeleted = ?`, [companionId, false]);

            if (companion.length == 0)
                return this.respondWithError(404, `Companion does not exist`);

            if (companion[0].checkout)
                return this.respondWithError(406, `${companion[0]?.telephone} has already checked out of the lounge`);

            await connection.execute(
                `UPDATE ${model} SET checkout = ?, lastvisit = ? WHERE uuid = ?`,
                [
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    dayjs().format("YYYY-MM-DD HH:mm:ss"),
                    companionId
                ]
            )

            connection.release();

            return this.respondWithSuccess({ message: `${companion[0]?.telephone} has checked out succesfully` });
        } catch (error) {
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Check-out companion]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Check-out companion]: Companion checked-out successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const companionCheckoutHandler = new CompanionCheckoutHandler(req, res);
    return companionCheckoutHandler.handleRequest();
}
