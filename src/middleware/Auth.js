import jwt from "jsonwebtoken";
import db from "../db";
import logger from "../utils/Logger";

const Auth = {
  /**
   * Verify Account Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyAccountToken(req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "Token is not provided" });
    }
    try {
      const decoded = await jwt.verify(token, process.env.ACCOUNT_SECRET);
      const query = `SELECT * FROM users WHERE id = $1`;
      const { rows } = await db.query(query, [decoded.userId]);
      if (!rows[0]) {
        logger.warn(`cannot find user using id from provided access token`, {
          transactionId: req.transactionId,
          userId: decoded.userId,
        });
        return res
          .status(400)
          .send({ message: "The token you provided is invalid" });
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      logger.error(`error when decoding access token`, error, {
        error: error.message,
      });
      return res.status(400).send(error);
    }
  },
  /**
   * Verify App Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyAppToken(req, res, next) {
    const token = req.headers["x-app-token"];
    if (!token) {
      return res.status(403).send({ message: "Token is not provided" });
    }
    try {
      const secret = process.env.APP_SECRET;
      if (token !== secret) {
        logger.warn(`provided app-token does not match with app secret`, {
          transactionId: req.transactionId,
        });
        return res
          .status(400)
          .send({ message: "The token you provided is invalid" });
      }
      next();
    } catch (error) {
      logger.error(`error when comparing app token with secret`, {
        error: error.message,
      });
      return res.status(400).send(error);
    }
  },
};

export default Auth;
