"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _Reflections = _interopRequireDefault(require("../controllers/Reflections"));

var _Auth = _interopRequireDefault(require("../middleware/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.post('/', _Auth.default.verifyToken, _Reflections.default.create);
router.get('/', _Auth.default.verifyToken, _Reflections.default.getAll);
router.get('/:id', _Auth.default.verifyToken, _Reflections.default.getOne);
router.put('/:id', _Auth.default.verifyToken, _Reflections.default.update);
router.delete('/:id', _Auth.default.verifyToken, _Reflections.default.delete);
var _default = router;
exports.default = _default;