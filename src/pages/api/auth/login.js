import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { isEmpty } from "@/lib/utilities";
import dayjs from "dayjs";

class AuthenticationHandler {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  async handleRequest() {
    try {
      if (this.req.method !== "POST") {
        return this.respondWithError(400, "Invalid HTTP request method");
      }

      const connection = await connectionPool.getConnection();
      const { username, password } = this.req.body;

      if (!username) {
        return this.respondWithError(400, "Username is required");
      }

      if (!password) {
        return this.respondWithError(400, "Password is required");
      }

      const [results] = await connection.execute(`SELECT * FROM users WHERE LCASE(username) = ?`, [username]);

      if (results.length > 0) {
        const user = results[0];

        if (!isEmpty(user)) {
          const isAuthenticated = await this.authenticateWithAD(username, password);

          if (!isAuthenticated?.isSuccessful) {
            return this.respondWithError(401, "Invalid credentials");
          }

          if (!user.fullname || !user.fname || !user.lname) {
            const userFirstNameAndLastName = isAuthenticated.data?.displayName.split(' ');
            const [firstName, lastName] = userFirstNameAndLastName;
            const fullName = isAuthenticated.data?.displayName;

            const [update] = await connection.execute(
              `UPDATE users SET fullname = ?, fname = ?, lname = ?, lastlogin = ? WHERE uuid = ?`,
              [fullName, firstName, lastName, dayjs().format("YYYY-MM-DD HH:mm:ss"), user.uuid]
            );

            if (!update.affectedRows) {
              throw new Error("Unable to update user details");
            }
          }

          connection.release();

          return this.respondWithSuccess({
            admin: {
              uuid: results[0]?.uuid
            },
            message: 'Please proceed to send otp to login',
            isAuthorized: true
          })
        }
      }

      return this.respondWithError(404, "User with this details does not exist");
    } catch (error) {
      console.log({ "error.message": error.message });
      return this.respondWithError(400, error.message);
    }
  }

  async authenticateWithAD(username, password) {
    try {
      const adLogin = await fetch(process.env.AD_AUTH_URL, {
        method: "POST",
        headers: {
          apiKey: process.env.AD_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
        timeout: 120000,
      });

      if (adLogin.status !== 200) {
        return false;
      }

      const adLoginData = await adLogin.json();
      return adLoginData;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  respondWithError(statusCode, error) {
    logger.error(`[AD Login]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
    return this.res.status(statusCode).json({
      success: false,
      data: null,
      error: error,
    });
  }

  respondWithSuccess(data) {
    logger.info(`[AD Login]: AD login successful`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
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
