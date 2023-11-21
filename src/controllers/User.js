import UserService from "../services/User";
import Helpers from "../utils/Helpers";
import { NoRecordFoundError } from "../utils/CustomErrors";
import logger from "../utils/Logger";

const User = {
  /**
   * Registers a new user account via the User service.
   * @requires Email and password as properties on express request.
   * @param {object} req
   * @param {object} res
   * @returns new JWT string as part of express response.
   */
  async register(req, res) {
    logger.info("received request in /users/register", {
      email: req.body.email,
      transactionId: req.transactionId,
    });
    if (!req.body.email || !req.body.password) {
      const message = "Username or password missing";
      logger.info(message, {
        email: req.body.email,
        transactionId: req.transactionId,
      });
      return res.status(400).send({ message });
    }
    if (!Helpers.isValidEmail(req.body.email)) {
      logger.info("email is not a valid format", {
        email: req.body.email,
        transactionId: req.transactionId,
      });
      return res
        .status(400)
        .send({ message: "Please enter a valid email address" });
    }

    try {
      const token = await UserService.register(
        req.body.email.trim().toLowerCase(),
        req.body.password
      );
      return res.status(201).send({ token });
    } catch (error) {
      logger.error("failed to register user", {
        error: error.message,
        errorCode: error.code,
        transactionId: req.transactionId,
      });
      return res.status(400).send({ message: error.message });
    }
  },
  /**
   * Logs user in via User service.
   * @requires Email and password as properties on express request.
   * @param {object} req
   * @param {object} res
   * @returns new JWT string as part of express response.
   */
  async login(req, res) {
    logger.info("received request in /users/login", {
      email: req.body.email,
      transactionId: req.transactionId,
    });
    if (!req.body.email || !req.body.password) {
      const message = "Username or password missing";
      logger.info(message, {
        email: req.body.email,
        transactionId: req.transactionId,
      });
      return res.status(400).send({ message });
    }
    if (!Helpers.isValidEmail(req.body.email)) {
      logger.info("email is not a valid format", {
        email: req.body.email,
        transactionId: req.transactionId,
      });
      return res
        .status(400)
        .send({ message: "Please enter a valid email address" });
    }
    try {
      const token = await UserService.login(
        req.body.email.trim().toLowerCase(),
        req.body.password
      );
      return res.status(200).send({ token });
    } catch (error) {
      logger.error("failed to login user", {
        error: error.message,
        errorCode: error.code,
        email: req.body.email,
        transactionId: req.transactionId,
      });
      return res.status(400).send({
        message: error.message,
      });
    }
  },
  /**
   * Delete the user associated with the JWT in request.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   */
  async delete(req, res) {
    logger.info("received request in /users/delete", {
      userId: req.user.id,
      transactionId: req.transactionId,
    });
    try {
      await UserService.delete(req.user.id);
      return res.status(204).send({ message: "User deleted" });
    } catch (error) {
      let statusCode = 400;
      if (error instanceof NoRecordFoundError) {
        statusCode = 404;
      }
      logger.error("failed to delete user", {
        error: error.message,
        errorCode: error.code,
        userId: req.user.id,
        transactionId: req.transactionId,
      });
      return res.status(statusCode).send({ message: error.message });
    }
  },
  /**
   * Send account deletion email
   * @param {*} req
   * @param {*} res
   */
  async sendAccountDeletionEmail(req, res) {
    logger.info("received request in /users/sendAccountDeletionEmail", {
      emailAddress: req.query.email,
      transactionId: req.transactionId,
    });
    try {
      await UserService.sendAccountDeletionEmail(req.query.email);
      return res.status(200).send({
        message: "Email sent, please allow 5 minutes for it to arrive",
      });
    } catch (error) {
      logger.error("failed to send account deletion email", {
        error: error.message,
        errorCode: error.code,
        emailAddress: req.query.email,
        transactionId: req.transactionId,
      });
      return res.status(500).send({ message: error.message });
    }
  },
};

export default User;
