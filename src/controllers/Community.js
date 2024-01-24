/**
 * THIS CONTROLLER IS DEPRECATED, WILL BE REMOVED ONCE ENOUGH UPGRADE TO NEWEST RN APP
 */
import CommunityService from "../services/Community";
import logger from "../utils/Logger";


const Community = {
  /**
   * Updated the community stats for one or more categories.
   * Malformed community stats are ignored.
   * @requires comStats JSON property in express request.
   * @requires authenticated request (app-token).
   * @param {object} req
   * @param {object} res
   * @returns updated stats as part of express response.
   */
  async sync(req, res) {
    logger.info("received request in /community/sync", {
      transactionId: req.transactionId,
    });
    let comStats = req.body.comStats;
    if (!comStats) {
      logger.info("no community stats in request", {
        transactionId: req.transactionId,
      });
      return res
        .status(400)
        .send({ message: "No community stats found payload" });
    }
    comStats = comStats.filter(
      (currComStats) =>
        typeof currComStats.category === "string" &&
        typeof currComStats.avgPerDay === "number" &&
        typeof currComStats.avgPerDayNominal === "number" &&
        typeof currComStats.mode === "number" &&
        typeof currComStats.avgHoursBetweenLogs === "number"
    );
    if (comStats.length === 0) {
      logger.info("no valid community stats in request", {
        transactionId: req.transactionId,
        comStats,
      });
      return res.status(400).send({
        message:
          "No valid community stats found in payload. Check required properties and data types.",
      });
    }
    try {
      logger.info("updating community stats", {
        transactionId: req.transactionId,
        comStats,
      });
      const updatedComStats = await CommunityService.sync(comStats);
      res.status(200).send({
        comStats: updatedComStats.map((currComStats) => ({
          category: currComStats.category,
          count: currComStats.count,
          avgPerDay: currComStats.avg_per_day,
          avgPerDayNominal: currComStats.avg_per_day_nominal,
          avgMode: currComStats.avg_mode,
          avgHoursBetweenLogs: currComStats.avg_hours_between_logs,
        })),
      });
    } catch (error) {
      logger.error("failed to sync community stats", {
        error: error.message,
        errorCode: error.code,
        comStats,
        transactionId: req.transactionId,
      });
      res.status(400).send({ message: error.message });
    }
  },
};

export default Community;
