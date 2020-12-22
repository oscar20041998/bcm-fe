"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _axios["default"].create({
  baseURL: "http://192.168.31.125:1510"
}); // domain API:https://qat-bcm-api-v1.herokuapp.com/
// local: http://192.168.31.125:1510


exports["default"] = _default;