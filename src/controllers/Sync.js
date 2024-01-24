import CommunityService from "../services/Community";
import User from "../services/User";
import logger from "../utils/Logger";
import LevelService from "../services/Level";
import SyncService from "../services/Sync";

const Sync = {
  /**
   * Sync a guest (user with no account)
   * Malformed community stats are ignored.
   * @requires comStats JSON property in express request.
   * @requires authenticated request (app-token).
   * @param {object} req
   * @param {object} res
   * @returns updated stats as part of express response.
   */
  async guest(req, res) {
    const { transactionId } = req;
    logger.info("received request in /community/sync/guest", {
      transactionId,
    });
    let updatedComStats = null;
    let comStatsError = null;
    try {
      logger.info("updating community stats", {
        transactionId,
        comStats: req.body.comStats,
      });
      updatedComStats = await validateAndSyncComStats(
        req.body.comStats,
        transactionId
      );
      if (!updatedComStats) {
        comStatsError = true;
      }
    } catch (error) {
      logger.error("failed to sync community stats for guest", {
        error: error.message,
        errorCode: error.code,
        comStats: req.body.comStats,
        transactionId,
      });
      comStatsError = error;
    }

    res.status(200).send({
      comStats: {
        success: !comStatsError,
        data:
          updatedComStats &&
          updatedComStats.map((currComStats) => ({
            category: currComStats.category,
            count: currComStats.count,
            avgPerDay: currComStats.avg_per_day,
            avgPerDayNominal: currComStats.avg_per_day_nominal,
            avgMode: currComStats.avg_mode,
            avgHoursBetweenLogs: currComStats.avg_hours_between_logs,
          })),
      },
      levelRules: LevelService.getRules(),
      levelDataVersion: LevelService.getDataVersion(),
      ...SyncService.getSyncRules(),
    });
  },

  async member(req, res) {
    const { transactionId } = req;
    const userId = req.user.id;
    logger.info("received request in /community/sync/member", {
      transactionId,
      userId,
    });

    // validate level properties in request
    // TODO replace this and comStats validation with validation libary e.g. joi
    const { level, logPoints } = req.body;
    if (!level || !(logPoints || logPoints === 0)) {
      const msg = "Request is missing required level properties";
      logger.info(msg, {
        transactionId,
        level: level,
        logPoints: logPoints,
      });
      return res.status(400).send(msg);
    }

    // sync comStats
    let updatedComStats = null;
    let comStatsError = null;
    try {
      logger.info("updating community stats", {
        transactionId,
        comStats: req.body.comStats,
      });
      updatedComStats = await validateAndSyncComStats(
        req.body.comStats,
        transactionId
      );
      if (!updatedComStats) {
        comStatsError = true;
      }
    } catch (error) {
      logger.error("failed to sync community stats for member", {
        error: error.message,
        errorCode: error.code,
        comStats: req.body.comStats,
        transactionId,
        userId,
      });
      comStatsError = error;
    }

    // sync user level and accrued LP
    let levelError = null;
    let updatedLevelProperties = null;
    try {
      updatedLevelProperties = await User.updateLevel(userId, level, logPoints);
      updatedLevelProperties = {
        level: updatedLevelProperties.level,
        logPoints: updatedLevelProperties.log_points,
      };
    } catch (error) {
      logger.error("failed to sync level properties for member", {
        error: error.message,
        errorCode: error.code,
        transactionId,
        userId,
        level,
        logPoints,
      });
      levelError = error;
    }

    res.status(200).send({
      comStats: {
        success: !comStatsError,
        data:
          updatedComStats &&
          updatedComStats.map((currComStats) => ({
            category: currComStats.category,
            count: currComStats.count,
            avgPerDay: currComStats.avg_per_day,
            avgPerDayNominal: currComStats.avg_per_day_nominal,
            avgMode: currComStats.avg_mode,
            avgHoursBetweenLogs: currComStats.avg_hours_between_logs,
          })),
      },
      levelProperties: {
        success: !levelError,
        data: updatedLevelProperties,
      },
      levelRules: LevelService.getRules(),
      levelDataVersion: LevelService.getDataVersion(),
      ...SyncService.getSyncRules(),
    });
  },
};

/**
 * Validates comStats before asking commynity service to sync the data
 * @param {*} comStats
 * @returns
 */
const validateAndSyncComStats = async (comStats, transactionId) => {
  if (!comStats) {
    logger.info("no community stats in request, skipping comStats sync", {
      transactionId,
    });
    return null;
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
    logger.info(
      "community stats malformed in request, skipping comStats sync",
      {
        transactionId,
        comStats,
      }
    );
    return null;
  }
  return await CommunityService.sync(comStats);
};

export default Sync;
