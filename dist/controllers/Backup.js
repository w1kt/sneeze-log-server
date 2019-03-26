"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Backup = _interopRequireDefault(require("../services/Backup"));

var _CustomErrors = require("../utils/CustomErrors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Backup = {
  /**
   * Push a redux store into db via Backup service.
   * @requires store JSON property in express request.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   * @returns store JSON as part of express response.
   */
  async push(req, res) {
    if (!req.body.store) {
      return res.status(400).send({
        message: "No store found in payload"
      });
    }

    try {
      const {
        store
      } = await _Backup.default.push(req.user.id, req.body.store);
      res.status(201).send({
        message: "Store successfully backed up",
        store: store
      });
    } catch (error) {
      res.status(400).send({
        message: error.message
      });
    }
  },

  /**
   * Pulls a redux store from db via Backup service.
   * @requires authenticated request.
   * @param {object} req
   * @param {object} res
   * @returns JSON store as part of express response.
   */
  async pull(req, res) {
    try {
      const {
        store
      } = await _Backup.default.pull(req.user.id);
      return res.status(200).send(store);
    } catch (error) {
      if (error instanceof _CustomErrors.NoRecordFoundError) {
        return res.status(404).send({
          message: error.messsage
        });
      }

      console.log(error instanceof _CustomErrors.NoRecordFoundError, error.constructor.name);
      return res.status(400).send({
        message: error.message
      });
    }
  }

};
var _default = Backup;
exports.default = _default;