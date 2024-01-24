import db from "../db";

const Level = {
  /**
   * Get all level data
   */
  async getData() {
    const query = "SELECT * from level";
    const { rows } = await db.query(query);
    return rows;
  },
  getDataVersion() {
    return parseInt(process.env.LEVEL_DATA_VERSION) || 1;
  },
  /**
   * Get Level rules from env
   */
  getRules() {
    return {
      baseLp: parseInt(process.env.LEVEL_RULE_BASE_LP) || 10,
      lpCooldownPeriod: parseInt(process.env.LEVEL_RULE_LP_COOLDOWN_PERIOD) || 5,
      lpCooldownPeriodType: process.env.LEVEL_RULE_LP_COOLDOWN_PERIOD_TYPE || "minutes",
      firstOfXBonus: parseInt(process.env.LEVEL_RULE_FIRST_OF_X_BONUS) || 3,
      firstOfXPeriod: parseInt(process.env.LEVEL_RULE_FIRST_OF_X_PERIOD) || 1,
      firstOfXPeriodType:
        process.env.LEVEL_RULE_FIRST_OF_X_PERIOD_TYPE || "days",
      momentumBonus: parseFloat(process.env.LEVEL_RULE_MOMENTUM_BONUS) || 1.25,
      momentumMax: parseFloat(process.env.LEVEL_RULE_MOMENTUM_MAX) || 1.5,
    };
  },
};

export default Level;
