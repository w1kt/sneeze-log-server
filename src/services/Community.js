import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import logger from '../utils/Logger';

const Community = {
  /**
   * Updates community stats for 1 or more categories.
   * If category does not exist in the database a new entry will be created.
   * A flag can be set on each category that indicated whether to update the count of the category.
   * @requires authenticated request (app-token).
   * @param {JSON} comStatsArray
   */
  async sync(comStatsArray, transactionId) {
    const queries = await comStatsArray.map(async comStats => {
      let query = `SELECT * FROM community WHERE category = '${
        comStats.category
      }'`;
      let values = [];
      try {
        let { rows } = await db.query(query);
        const categoryExists = !!rows.length;
        if (!categoryExists) {
          logger.info('creating new community stats category', { transactionId, comStats.category })
          query = `
          INSERT INTO 
          community(id, category, count, avg_per_day, avg_per_day_nominal,
            avg_mode, avg_hours_between_logs, created_date, modified_date)
          values($1,$2,$3,$4,$5,$6,$7,$8, $9) 
          RETURNING *
        `;
          values = [
            uuidv4(),
            comStats.category,
            1,
            comStats.avgPerDay,
            comStats.avgPerDayNominal,
            comStats.mode,
            comStats.avgHoursBetweenLogs,
            moment(new Date()),
            moment(new Date())
          ];
        } else {
          logger.info('updating community stats category', { transactionId, comStats.category })
          query = `
            UPDATE community
            SET avg_per_day=$1, avg_per_day_nominal=$2, avg_mode=$3,
              avg_hours_between_logs=$4, modified_date=$5, count=$6
            WHERE category = $7
            RETURNING *
          `;
          const currComstats = rows[0];
          let count = parseInt(currComstats.count);
          if (comStats.isFirstSubmission) {
            count++;
          }
          values = [
            this.updateAverage(
              currComstats.avg_per_day,
              comStats.avgPerDay,
              count
            ),
            this.updateAverage(
              currComstats.avg_per_day_nominal,
              comStats.avgPerDayNominal,
              count
            ),
            this.updateAverage(currComstats.avg_mode, comStats.mode, count),
            this.updateAverage(
              currComstats.avg_hours_between_logs,
              comStats.avgHoursBetweenLogs,
              count
            ),
            moment(new Date()),
            count,
            comStats.category
          ];
        }

        const res = await db.query(query, values);
        return res.rows[0];
      } catch (error) {
        throw error;
      }
    });
    const res = await Promise.all(queries);
    return res;
  },
  /**
   * Updates a running mean 
   * @param {string | number} curr 
   * @param {string | number} newVal 
   * @param {string | number} count 
   */
  updateAverage(curr, newVal, count) {
    curr = parseFloat(curr);
    newVal = parseFloat(newVal);
    count = parseInt(count);
    let newAvg = curr + (newVal - curr) / count;
    if (newAvg % 1 !== 0) {
      newAvg = parseFloat(newAvg.toFixed(2));
    }
    return newAvg;
  }
};

export default Community;
