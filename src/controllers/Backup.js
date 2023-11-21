import BackupService from "../services/Backup";
import { NoRecordFoundError } from "../utils/CustomErrors";
import logger from "../utils/Logger";

const Backup = {
  /**
   * Push a redux store into db via Backup service.
   * @requires store JSON property in express request.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   * @returns store JSON as part of express response.
   */
  async push(req, res) {
    logger.info("received request in /backup/push", {
      transactionId: req.transactionId,
    });
    if (!req.body.store) {
      logger.info("no store found in request body", {
        transactionId: req.transactionId,
        requestBody: req.body
      });
      return res.status(400).send({ message: "No store found in payload" });
    }

    try {
      const { store } = await BackupService.push(req.user.id, req.body.store);
      res
        .status(201)
        .send({ message: "Store successfully backed up", store: store });
    } catch (error) {
      logger.error("failed to push backup", {
        error: error.message,
        errorCode: error.code,
        userId: req.user.id,
        store: req.body.store,
        transactionId: req.transactionId,
      });
      res.status(400).send({ message: error.message });
    }
  },
  /**
   * Pulls a redux store from db via Backup service.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   * @returns JSON store as part of express response.
   */
  async pull(req, res) {
    logger.info("received request in /backup/pull", {
      transactionId: req.transactionId,
    });
    try {
      const { store } = await BackupService.pull(req.user.id);
      return res.status(200).send(store);
    } catch (error) {
      let statusCode = 400;
      if (error instanceof NoRecordFoundError) {
        statusCode = 404;
      }
      logger.error("failed to pull backup", {
        error: error.message,
        errorCode: error.code,
        userId: req.user.id,
        transactionId: req.transactionId,
      });
      return res.status(statusCode).send({ message: error.message });
    }
  },
};

export default Backup;
