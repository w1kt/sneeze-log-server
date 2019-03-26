"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Auth = _interopRequireDefault(require("../middleware/Auth"));

var _Backup = _interopRequireDefault(require("../controllers/Backup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.post('/push', _Auth.default.verifyToken, _Backup.default.push);
router.get('/pull', _Auth.default.verifyToken, _Backup.default.pull);
var _default = router;
exports.default = _default;