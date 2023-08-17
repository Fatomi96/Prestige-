import { connectionPool } from "@/lib/mysql";
import logger from "@/lib/logger";
import { verifyToken } from "@/lib/utilities";

class GuestsHandler {
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


            if (this.req.query?.guestId?.length > 0) {
                const [guestId] = this.req.query.guestId;
                const [guestWithCompanions] = await connection.execute(
                    `SELECT c.id, c.uuid, c.fname, c.lname, c.telephone, c.checkin, c.checkout, c.created_at, c.updated_at,
                            com.id AS companion_id, com.uuid AS companion_uuid, com.firstname AS companion_firstname, com.lastname AS companion_lastname, com.telephone AS companion_telephone, com.checkin AS companion_checkin, com.checkout AS companion_checkout
                     FROM customers c
                     LEFT JOIN companions com ON c.uuid = com.customerId
                     WHERE c.uuid = ? AND c.isDeleted = ?`,
                    [guestId, false]
                );

                if (guestWithCompanions.length === 0) {
                    return this.respondWithError(404, `Guest not found`);
                }

                const guest = {
                    id: guestWithCompanions[0].id,
                    uuid: guestWithCompanions[0].uuid,
                    fname: guestWithCompanions[0].fname,
                    lname: guestWithCompanions[0].lname,
                    telephone: guestWithCompanions[0].telephone,
                    checkin: guestWithCompanions[0].checkin,
                    checkout: guestWithCompanions[0].checkout,
                    created_at: guestWithCompanions[0].created_at,
                    updated_at: guestWithCompanions[0].updated_at,
                    companions: [],
                };

                guestWithCompanions.forEach(row => {
                    if (row.companion_id) {
                        guest.companions.push({
                            id: row.companion_id,
                            firstname: row.companion_firstname,
                            lastname: row.companion_lastname,
                            uuid: row.companion_uuid,
                            telephone: row.companion_telephone,
                            checkin: row.companion_checkin,
                            checkout: row.companion_checkout,
                        });
                    }
                });

                connection.release();

                return this.respondWithSuccess(guest);
            } else {
                const { page, per_page } = this.req.query;
                const _page = page ? parseInt(page) : 1;
                const _per_page = per_page ? parseInt(per_page) : 15;
                const _offset = (_page - 1) * _per_page;
                let totalGuestToday;
                let _total_records;
                let _total_page;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const [guestTodayQuery, guestTodayCountQuery] = await Promise.all([
                    connection.execute(
                        `SELECT c.id, c.uuid, c.fname, c.lname, c.telephone, c.checkin, c.checkout, c.created_at, c.updated_at,
                                com.id AS companion_id, com.uuid AS companion_uuid, com.firstname AS companion_firstname, com.lastname AS companion_lastname, com.telephone AS companion_telephone, com.checkin AS companion_checkin, com.checkout AS companion_checkout
                         FROM customers c
                         LEFT JOIN companions com ON c.uuid = com.customerId
                         WHERE c.isDeleted = ? AND c.checkin IS NOT NULL AND DATE(c.checkin) = ? ORDER BY c.checkin DESC LIMIT ?, ?`,
                        [false, today, _offset.toString(), _per_page.toString()]
                    ),
                    connection.execute(`SELECT id FROM customers WHERE isDeleted = ? AND checkin IS NOT NULL AND DATE(checkin) = ?`, [false, today]),
                ]);


                totalGuestToday = guestTodayQuery[0];
                const customersMap = new Map(); 

                totalGuestToday.forEach(row => {
                    const customerId = row.uuid;

                    if (!customersMap.has(customerId)) {
                        customersMap.set(customerId, {
                            id: row.id,
                            uuid: customerId,
                            fname: row.fname,
                            lname: row.lname,
                            telephone: row.telephone,
                            checkin: row.checkin,
                            checkout: row.checkout,
                            created_at: row.created_at,
                            updated_at: row.updated_at,
                            companions: [],
                        });
                    }

                    if (row.companion_id) {
                        const companion = {
                            id: row.companion_id,
                            uuid: row.companion_uuid,
                            firstname: row.companion_firstname,
                            lastname: row.companion_lastname,
                            telephone: row.companion_telephone,
                            checkin: row.companion_checkin,
                            checkout: row.companion_checkout,
                        };
                        customersMap.get(customerId).companions.push(companion);
                    }
                });

                const guestToday = Array.from(customersMap.values());
                const guestTodayCount = guestTodayCountQuery[0]?.length;
                _total_records = guestTodayCount;
                _total_page = Math.ceil(_total_records / _per_page);

                connection.release();

                return this.respondWithSuccess({
                    guestToday,
                    guestTodayCount,
                    pagination: {
                        current_page: _page,
                        total_pages: _total_page,
                        total_records: _total_records,
                        per_page: _per_page,
                    },
                });
            }
        } catch (error) {
            return this.respondWithError(500, error.message);
        }
    }

    respondWithError(statusCode, error) {
        logger.error(`[Today's Guest]: ${ error }`, { method: this.req.method, url: this.req.url, status: statusCode });
        return this.res.status(statusCode).json({
            success: false,
            data: null,
            error: error
        });
    }

    respondWithSuccess(data) {
        logger.info(`[Today's Guest]: Today's guest fetched successfully`, { method: this.req.method, url: this.req.url, status: this.res.statusCode });
        return this.res.status(200).json({
            success: true,
            data: data,
            error: null,
        });
    }
}

export default async function handler(req, res) {
    const guestsHandler = new GuestsHandler(req, res);
    return guestsHandler.handleRequest();
}
