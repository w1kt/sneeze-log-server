import uuidv4 from "uuid/v4";
import moment from "moment";
import db from "../db";
import { NoRecordFoundError } from "../utils/CustomErrors";

const Backup = {
  /**
   * Pushes a redux store JSON in to the db.
   * Stores have a 1->1 relationship with users and will
   * be overwritten with subsequent push calls.
   * @requires authenticated request.
   * @param {string} id
   * @param {JSON} store
   * @returns {JSON} store
   */
  async push(id, store) {
    const query = `
    INSERT INTO
    backup(id, owner_id, store, created_date, modified_date)
    VALUES($1,$2,$3,$4,$5)
    ON CONFLICT (owner_id) DO UPDATE
      SET store = EXCLUDED.store,
          modified_date = EXCLUDED.modified_date
    RETURNING *
    `;
    const values = [
      uuidv4(),
      id,
      store,
      moment(new Date()),
      moment(new Date())
    ];
    try {
      const { rows } = await db.query(query, values);
      return { store: rows[0] };
    } catch (error) {
      throw Error(error);
    }
  },
  /**
   * Pulls the store JSON from the db associated with 
   * the provided user ID.
   * @param {string} id 
   * @returns {JSON} store
   */
  async pull(id) {
    const query = `SELECT store FROM backup WHERE owner_id = '${id}'`;
    try {
      const { rows } = await db.query(query);
      if (!rows[0]) {
        throw new NoRecordFoundError("No backup found");
      }
      return { store: rows[0] };
    } catch (error) {
      throw error;
    }
  }
};

export default Backup;
