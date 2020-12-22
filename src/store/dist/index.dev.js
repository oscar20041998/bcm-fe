"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var _state, _mutations, _getters;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_vue["default"].use(_vuex["default"]);

var _default = new _vuex["default"].Store({
  state: (_state = {
    roleUser: '',
    accountId: '',
    userName: ''
  }, _defineProperty(_state, "userName", ''), _defineProperty(_state, "tableId", ''), _defineProperty(_state, "isLogin", false), _defineProperty(_state, "listOrdered", []), _defineProperty(_state, "totalPrice", ''), _state),
  mutations: (_mutations = {
    setRoleUser: function setRoleUser(state, value) {
      state.roleUser = value;
    },
    setAccountId: function setAccountId(state, value) {
      state.accountId = value;
    },
    setUserName: function setUserName(state, value) {
      state.userName = value;
    },
    setIsLogin: function setIsLogin(state, value) {
      state.isLogin = value;
    }
  }, _defineProperty(_mutations, "setUserName", function setUserName(state, value) {
    state.userName = value;
  }), _defineProperty(_mutations, "setTableId", function setTableId(state, value) {
    state.tableId = value;
  }), _defineProperty(_mutations, "setListOrdered", function setListOrdered(state, value) {
    state.listOrdered = value;
  }), _defineProperty(_mutations, "setTotalPrice", function setTotalPrice(state, value) {
    state.totalPrice = value;
  }), _mutations),
  actions: {},
  modules: {},
  getters: (_getters = {
    getRoleUser: function getRoleUser(state) {
      return state.roleUser;
    },
    getAccountId: function getAccountId(state) {
      return state.accountId;
    },
    getUserName: function getUserName(state) {
      return state.userName;
    },
    getIsLogin: function getIsLogin(state) {
      return state.isLogin;
    }
  }, _defineProperty(_getters, "getUserName", function getUserName(state) {
    return state.userName;
  }), _defineProperty(_getters, "getTableId", function getTableId(state) {
    return state.tableId;
  }), _defineProperty(_getters, "getListOrdered", function getListOrdered(state) {
    return state.listOrdered;
  }), _defineProperty(_getters, "getTotalPrice", function getTotalPrice(state) {
    return state.totalPrice;
  }), _getters)
});

exports["default"] = _default;