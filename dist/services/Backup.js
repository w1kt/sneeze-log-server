"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

var _moment = _interopRequireDefault(require("moment"));

var _db = _interopRequireDefault(require("../db"));

var _CustomErrors = require("../utils/CustomErrors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const values = [(0, _v.default)(), id, store, (0, _moment.default)(new Date()), (0, _moment.default)(new Date())];

    try {
      const {
        rows
      } = await _db.default.query(query, values);
      return {
        store: rows[0]
      };
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
      const {
        rows
      } = await _db.default.query(query);

      if (!rows[0]) {
        const error = new _CustomErrors.NoRecordFoundError("No backup found");
        console.log(error instanceof _CustomErrors.NoRecordFoundError, error.constructor.name);
        throw error;
      }

      return {
        store: rows[0]
      };
    } catch (error) {
      throw Error(error);
    }
  }

};
var _default = Backup;
exports.default = _default;