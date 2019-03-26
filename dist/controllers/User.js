"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../services/User"));

var _Helpers = _interopRequireDefault(require("../utils/Helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const User = {
  /**
   * Registers a new user account via the User service.
   * @requires Email and password as properties on express request.
   * @param {object} req
   * @param {object} res
   * @returns new JWT string as part of express response.
   */
  async register(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Username or password missing"
      });
    }

    if (!_Helpers.default.isValidEmail(req.body.email)) {
      return res.status(400).send({
        message: "Please enter a valid email address"
      });
    }

    try {
      const token = await _User.default.register(req.body.email, req.body.password);
      return res.status(201).send({
        token
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },

  /**
   * Logs user in via User service.
   * @requires Email and password as properties on express request.
   * @param {object} req
   * @param {object} res
   * @returns new JWT string as part of express response.
   */
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Username or password missing"
      });
    }

    if (!_Helpers.default.isValidEmail(req.body.email)) {
      return res.status(400).send({
        message: "Please enter a valid email address"
      });
    }

    try {
      const token = await _User.default.login(req.body.email, req.body.password);
      return res.status(200).send({
        token
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  },

  /**
   * Delete the user associated with the JWT in request.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   */
  async delete(req, res) {
    try {
      await _User.default.delete(req.user.id);
      return res.status(204).send({
        message: "User deleted"
      });
    } catch (error) {
      return res.status(400).send({
        message: error.message
      });
    }
  }

};
var _default = User;
exports.default = _default;