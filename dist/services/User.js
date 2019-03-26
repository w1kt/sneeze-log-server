"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Helpers = _interopRequireDefault(require("../utils/Helpers"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _moment = _interopRequireDefault(require("moment"));

var _db = _interopRequireDefault(require("../db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const User = {
  /**
   * Creates a new user in the db with user email and hashed password.
   * Signs a new JWT using user id.
   * @param {string} email
   * @param {string} password
   * @returns {string} JWT Token
   */
  async register(email, password) {
    const hashedPassword = _Helpers.default.hashPassword(password);

    const query = `
    INSERT INTO
    users(id, email, password, created_date, modified_date)
    VALUES($1, $2, $3, $4, $5)
    returning *
    `;
    const values = [(0, _v.default)(), email, hashedPassword, (0, _moment.default)(new Date()), (0, _moment.default)(new Date())];

    try {
      const {
        rows
      } = await _db.default.query(query, values);

      const token = _Helpers.default.generateToken(rows[0].id);

      return token;
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        throw Error("A user with that email already exists");
      }

      throw error;
    }
  },

  /**
   * Logs user in by checking db for matching email, 
   * verifying password and signing a new JWT.
   * @param {string} email 
   * @param {string} password 
   * @returns {string} JWT Token
   */
  async login(email, password) {
    const query = `
    SELECT * FROM users WHERE email = $1
  `;

    try {
      const {
        rows
      } = await _db.default.query(query, [email]);

      if (!rows[0]) {
        throw Error("The email address that you've entered doesn't match any account");
      }

      if (!_Helpers.default.comparePassword(rows[0].password, password)) {
        throw Error("Incorrect email or password");
      }

      const token = _Helpers.default.generateToken(rows[0].id);

      return token;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * Finds user by ID and removes the account and all associated data.
   * @param {string} id 
   */
  async delete(id) {
    const query = `DELETE FROM users WHERE id=$1 returning *`;

    try {
      const {
        rows
      } = await _db.default.query(query, [id]);

      if (!rows[0]) {
        throw Error("User not found");
      }
    } catch (error) {
      throw Error(error);
    }
  }

};
var _default = User;
exports.default = _default;