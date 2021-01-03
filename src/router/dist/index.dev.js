"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Home = _interopRequireDefault(require("../views/Home.vue"));

var _Login = _interopRequireDefault(require("../views/Login.vue"));

var _NavigationBar = _interopRequireDefault(require("../NavigationBar.vue"));

var _NotFound = _interopRequireDefault(require("../views/NotFound.vue"));

var _ProfileUser = _interopRequireDefault(require("../components/ProfileUser.vue"));

var _AccountUser = _interopRequireDefault(require("../views/AccountUser.vue"));

var _User = _interopRequireDefault(require("../views/User.vue"));

var _FoodAndDrink = _interopRequireDefault(require("../views/FoodAndDrink.vue"));

var _Position = _interopRequireDefault(require("../views/Position.vue"));

var _Unauthorize = _interopRequireDefault(require("../views/Unauthorize.vue"));

var _TransactionList = _interopRequireDefault(require("../views/TransactionList.vue"));

var _OrderProduct = _interopRequireDefault(require("../views/OrderProduct.vue"));

var _PaymentConfig = _interopRequireDefault(require("../views/PaymentConfig.vue"));

var _PaymentProduct = _interopRequireDefault(require("../components/PaymentProduct.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  name: 'Login',
  component: _Login["default"]
}, {
  path: '/home/',
  name: 'Home',
  component: _Home["default"]
}, {
  path: '/accounts-user/',
  name: 'AccountUser',
  component: _AccountUser["default"]
}, {
  path: '/not-found',
  name: 'NotFound',
  component: _NotFound["default"]
}, {
  path: '/profile-user/',
  name: 'ProfileUser',
  component: _ProfileUser["default"]
}, {
  path: '/users/',
  name: 'User',
  component: _User["default"]
}, {
  path: '/food-and-drink-management/',
  name: 'FoodAndDrink',
  component: _FoodAndDrink["default"]
}, {
  path: '/positions/',
  name: 'Position',
  component: _Position["default"]
}, {
  path: '/unauthorize/',
  name: 'Unauthorize',
  component: _Unauthorize["default"]
}, {
  path: '/transaction-list/',
  name: 'TransactionList',
  component: _TransactionList["default"]
}, {
  path: '/order-product-page/',
  name: 'OrderProduct',
  component: _OrderProduct["default"]
}, {
  path: '/payment-configurtion/',
  name: 'PaymentConfig',
  component: _PaymentConfig["default"]
}, {
  path: '/payment-product/',
  name: 'PaymentProduct',
  component: _PaymentProduct["default"]
}];
var router = new _vueRouter["default"]({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
});
var _default = router;
exports["default"] = _default;