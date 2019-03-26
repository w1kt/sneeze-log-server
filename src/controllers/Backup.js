import BackupService from "../services/Backup";
import { NoRecordFoundError } from "../utils/CustomErrors";

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
    if (!req.body.store) {
      return res.status(400).send({ message: "No store found in payload" });
    }

    try {
      const { store } = await BackupService.push(req.user.id, req.body.store);
      res
        .status(201)
        .send({ message: "Store successfully backed up", store: store });
    } catch (error) {
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
    try {
      const { store } = await BackupService.pull(req.user.id);
      return res.status(200).send(store);
    } catch (error) {
      let statusCode = 400;
      if (error instanceof NoRecordFoundError) {
        statusCode = 404;
      }
      return res.status(statusCode).send({ message: error.message });
    }
  }
};

export default Backup;
