import jwt from "jsonwebtoken";
import db from "../db";
import PasswordRecoveryService from "../services/PasswordRecovery";
import logger from "../utils/Logger";

const PasswordRecovery = {
  /**
   * Checks that the given email exists in the Users table
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async checkEmailExists(req, res, next) {
    let email = req.body.email || req.query.email;
    if (!email) {
      return res
        .status(403)
        .send({ message: "Please provide an email address" });
    }
    email = email.trim().toLowerCase();
    try {
      const query = `SELECT * FROM users WHERE email = '${email}'`;
      const { rows } = await db.query(query);
      if (!rows[0]) {
        return res.status(404).send({
          message: "There is no account associated with that email address",
        });
      }
      req.userEmail = email;
      next();
    } catch (error) {
      logger.error("failed to check if email exists", {
        error: error.message,
        errorCode: error.code,
        email: req.query.email,
        transactionId: req.transactionId,
      });
      return res.status(500).send("An error has occurred");
    }
  },
  /**
   * Verifies that a supplied verification code matches the supplied email by checking db.
   * If valid will set req.vCodIsValid to true.
   * This middleware will not call next() if the vCode is not valid
   * @param {*} req expects req.userEmail to be set
   * @param {*} res
   */
  async verifyVCode(req, res, next) {
    logger.info("verifying verification code", {
      transactionId: req.transactionId,
      email: req.userEmail,
    });
    if (!req.body.vCode) {
      logger.info("no vCode provided", {
        transactionId: req.transactionId,
        email: req.userEmail,
      });
      return res
        .status(403)
        .send({ message: "Please provide a verification code" });
    }
    try {
      const query = `SELECT vcode_jwt FROM password_recovery WHERE email = '${req.userEmail}'`;
      const { rows } = await db.query(query);
      if (!rows[0]) {
        return res.status(403).send({ message: "Verification code invalid" });
      }
      let vCodeJWT = rows[0].vcode_jwt;
      vCodeJWT = jwt.verify(vCodeJWT, process.env.ACCOUNT_SECRET);
      const vCode = vCodeJWT.vCode;
      if (vCode !== req.body.vCode) {
        logger.info("verification code is invalid", {
          transactionId: req.transactionId,
          email: req.userEmail,
        });
        return res.status(403).send({
          message: "Code invalid. Please try getting a new verification code",
        });
      }
      req.vCodeIsValid = true;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        logger.info("jwt matching verification code is expired", {
          transactionId: req.transactionId,
          email: req.userEmail,
        });
        // Clean up the expired vCode from db
        PasswordRecoveryService.deleteVCode(req.userEmail);
        return res.status(403).send({
          message: "Code expired. Please try getting a new verification code",
        });
      }
      logger.error("failed to verify verification code", {
        error: error.message,
        errorCode: error.code,
        email: req.userEmail,
        transactionId: req.transactionId,
      });
      return res.status(500).send({ message: "An error has occurred" });
    }
  },
};

export default PasswordRecovery;
