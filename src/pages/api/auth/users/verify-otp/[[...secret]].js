import { connectionPool } from "@/lib/mysql";
import { setCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import logger from "@/lib/logger";
import { hashPassword, comparePassword } from "@/lib/utilities";

class AuthenticationHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async handleRequest() {
        try {
            if (this.req.method !== "POST") {
                return this.respondWithError(
                    400,
                    "Invalid http request method."
                );
            }

            const connection = await connectionPool.getConnection();
            const { otp } = this.req.body;
            const [secret] = this.req.query?.secret;

            if (!otp || !secret) {
                return this.respondWithError(400, "Invalid/missing payload");
            }

            const [user] = await connection.execute(`SELECT id, uuid, fname, lname, fullname, username, email, telephone, lastlogin, created_by, created_at, updated_at, otp FROM users WHERE secret = ? AND otp_expiry > NOW()`, [secret]);

            if (!user.length) {
                return this.respondWithError(401, "OTP has expired or is invalid");
            }

            const tokenUuid = uuidv4();
            const decryptedOtp = await comparePassword(otp, user[0].otp);

            if (!decryptedOtp) {
                return this.respondWithError(401, "OTP has expired or is invalid");
            }

            const hashTokenUuid = await hashPassword(tokenUuid);

            const [update] = await connection.execute(
                `UPDATE users SET token = ?, lastlogin = ?, secret = NULL, otp_expiry = NULL, otp = NULL WHERE uuid = ?`,
                [hashTokenUuid, dayjs().format("YYYY-MM-DD HH:mm:ss"), user[0]?.uuid]
            );

            if (!update.affectedRows) {
                return this.respondWithError(500, "Unable to create token");
            }

            delete user[0].otp;

            const exp = parseInt(process.env.JWT_EXPIRE) * 1000;
            const expiry = parseInt(Date.now() + exp);
            const tokenData = { user: { ...user[0], token: tokenUuid }, exp: expiry };
            let token = jwt.sign(tokenData, process.env.JWT_SECRET);

            if (token) {
                setCookie("authorization", `${token}`, {
                  req: this.req,
                  res: this.res,
                  secure: true,
                  maxAge: expiry ?? 60 * 60 * 24, // would expire after 1 day
                  httpOnly: true,
                  signed: true,
                  path: "/",
                  sameSite: "strict",
                })
            }

            connection.release();

            return this.respondWithSuccess({
                user: user[0],
                token,
                ttl: process.env.JWT_EXPIRE,
                expiry: new Date(expiry),
            })
        } catch (error) {
            console.log(error);
            return this.respondWithError(400, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[OTP verification]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[OTP verification]: OTP verification successful`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const authHandler = new AuthenticationHandler(req, res);
    return authHandler.handleRequest();
}
  