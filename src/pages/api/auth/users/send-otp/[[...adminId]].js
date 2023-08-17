import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";
import { generateRandomNumber, smsSender, hashPassword } from "@/lib/utilities";

class AuthenticationHandler {
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
      const [adminId] = this.req.query?.adminId;

      if (!adminId) {
        return this.respondWithError(400, "Invalid/missing payload");
      }

      const [results] = await connection.execute(
        `SELECT * FROM users WHERE uuid = ?`,
        [adminId]
      );

      if (results.length > 0 && results[0]?.telephone) {
        const { telephone } = results[0];
        const secret = uuidv4();
        const otp = generateRandomNumber();
        const hashedOtp = await hashPassword(`${otp}`);
        const expiryTimestamp = new Date();
        expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + 5);

        await connection.execute(
          `UPDATE users SET secret = ?, otp = ?, otp_expiry = ?, updated_at = NOW() WHERE uuid = ?`,
          [
            secret,
            hashedOtp,
            expiryTimestamp,
            adminId,
          ]
        );
        
        const response = await smsSender({
          receiverAddress: `${ telephone }`,
          senderAddress: process.env.SMS_SENDER,
          message: `Your MTN prestige airport login otp is ${ otp } `,
        });
        console.log('hytytyy');

        connection.release();

        if (response.data.statusMessage === 'Success.') {
          return this.respondWithSuccess({ secret });
        }
      }

      return this.respondWithError(404, "User with this details does not exist");
    } catch (error) {
      if (error.status === 504) {
        return this.respondWithError(504, 'Sms service failed');
      } else {
        return this.respondWithError(500, error.message);
      }
    }
  }

  respondWithError(statusCode, error) {
    logger.error(`[Send Otp]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
    return this.res.status(statusCode).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondWithSuccess(data) {
    logger.info(`[Send Otp]: OTP sent successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
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
