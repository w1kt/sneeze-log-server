"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Reflection = {
  /**
   * Create A Reflection
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async create(req, res) {
    const query = `
    INSERT INTO 
    reflections(id, success, low_point, take_away, owner_id, created_date, modified_date)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    returning *
    `;
    const values = [(0, _v.default)(), req.body.success, req.body.low_point, req.body.take_away, req.user.id, (0, _moment.default)(new Date()), (0, _moment.default)(new Date())];

    try {
      const {
        rows
      } = await _db.default.query(query, values);
      return res.status(201).send(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get All Reflection
   * @param {object} req
   * @param {object} res
   * @returns {object} reflections array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM reflections where owner_id = $1';

    try {
      const {
        rows,
        rowCount
      } = await _db.default.query(findAllQuery, [req.user.id]);
      return res.status(200).send({
        rows,
        rowCount
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Get A Reflection
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async getOne(req, res) {
    const query = 'SELECT * FROM reflections WHERE id = $1 AND owner_id = $2';

    try {
      const {
        rows
      } = await _db.default.query(query, [req.params.id, req.user.id]);

      if (!rows[0]) {
        return res.status(404).send({
          message: 'reflection not found'
        });
      }

      return res.status(200).send(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  /**
   * Update A Reflection
   * @param {object} req
   * @param {object} res
   * @returns {object} updated reflection
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM reflections WHERE id=$1 AND owner_id = $2';
    const updateOneQuery = `UPDATE reflections
      SET success=$1,low_point=$2,take_away=$3,modified_date=$4
      WHERE id=$5 AND owner_id = $6 returning *`;

    try {
      const {
        rows
      } = await _db.default.query(findOneQuery, [req.params.id, req.user.id]);

      if (!rows[0]) {
        return res.status(404).send({
          message: 'reflection not found'
        });
      }

      const values = [req.body.success || rows[0].success, req.body.low_point || rows[0].low_point, req.body.take_away || rows[0].take_away, (0, _moment.default)(new Date()), req.params.id, req.user.id];
      const response = await _db.default.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  /**
   * Delete A Reflection
   * @param {object} req
   * @param {object} res
   * @returns {void} return statuc code 204
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM reflections WHERE id=$1 AND owner_id = $2 returning *';

    try {
      const {
        rows
      } = await _db.default.query(deleteQuery, [req.params.id, req.user.id]);

      if (!rows[0]) {
        return res.status(404).send({
          message: 'reflection not found'
        });
      }

      return res.status(204).send({
        message: 'deleted'
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

};
var _default = Reflection;
exports.default = _default;