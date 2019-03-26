"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Reflections = _interopRequireDefault(require("./Reflections"));

var _User = _interopRequireDefault(require("./User"));

var _Backup = _interopRequireDefault(require("./Backup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use('/reflections', _Reflections.default);
router.use('/users', _User.default);
router.use('/backup', _Backup.default);
var _default = router;
exports.default = _default;