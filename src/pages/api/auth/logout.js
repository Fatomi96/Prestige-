import { connectionPool } from "@/lib/mysql";
import { hasCookie, deleteCookie } from "cookies-next";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

class LogoutHandler {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async handleLogout() {
    try {
      if (this.req.method !== "POST") {
        return this.respondBadRequest("Invalid HTTP request method");
      }

      const connection = await connectionPool.getConnection();
      const auth = await verifyToken(this.req, this.res, connection);

      if (hasCookie("authorization", { req: this.req, res: this.res })) {
        deleteCookie("authorization", { req: this.req, res: this.res });
      }

      if (!auth.success) {
        connection.release();
        return this.respondUnauthorized(auth.error);
      }

      const user = auth.data;

      await connection.execute(`UPDATE users SET token = ? WHERE uuid = ?`, [
        "",
        user.uuid,
      ]);

      delete user.password;
      delete user.token;

      connection.release();

      return this.respondWithSuccess(user);
    } catch (error) {
      return this.respondWithError(error.message);
    }
  }

  respondWithSuccess(data) {
    logger.info(`[Logout]: Admin logged out successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
    return this.res.status(200).json({
      success: true,
      data: data,
      error: null,
    });
  }

  respondUnauthorized(error) {
    logger.warn(`[Logout]: ${ error }`, { method: this.req.method, url: this.req.url, status: 401 });
    return this.res.status(401).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondBadRequest(error) {
    logger.warn(`[Logout]: ${ error }`, { method: this.req.method, url: this.req.url, status: 400 });
    return this.res.status(400).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondWithError(error) {
    logger.error(`[Logout]: ${ error }`, { method: this.req.method, url: this.req.url, status: 500 });
    return this.res.status(500).json({
      success: false,
      data: null,
      error: error,
    });
  }
}

export default async function handler(req, res) {
  const logoutHandler = new LogoutHandler(req, res);
  return logoutHandler.handleLogout();
}
