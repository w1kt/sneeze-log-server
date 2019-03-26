"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(400).send({
        message: 'Token is not provided'
      });
    }

    try {
      const decoded = await _jsonwebtoken.default.verify(token, process.env.SECRET);
      const query = `SELECT * FROM users WHERE id = $1`;
      const {
        rows
      } = await _db.default.query(query, [decoded.userId]);

      if (!rows[0]) {
        return res.status(400).send({
          message: 'The token you provided is invalid'
        });
      }

      req.user = {
        id: decoded.userId
      };
      next();
    } catch (error) {
      return res.status(400).send(error);
    }
  }

};
var _default = Auth;
exports.default = _default;