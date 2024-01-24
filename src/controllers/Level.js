import logger from "../utils/Logger";
import LevelService from "../services/Level";

const Level = {
  /**
   * Gets the level data from db
   * @param {*} req
   * @param {*} res
   */
  async data(req, res) {
    logger.info("received request in /level/data", {
      transactionId: req.transactionId,
    });
    try {
      const data = await LevelService.getData();
      res.status(200).send(data);
    } catch (error) {
      const msg = "failed to get level data";
      logger.error(`${msg}: ${error.message}`, {
        transactionId: req.transactionId,
      });
      res.status(500).send(msg);
    }
  },
};

export default Level;
