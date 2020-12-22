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

var token = JSON.parse(localStorage.getItem('user')) != null || JSON.parse(localStorage.getItem('user')) != '' ? btoa(JSON.parse(localStorage.getItem('user')).key) : '';

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/navigation-bar',
  name: 'NavigationBar',
  component: _NavigationBar["default"]
}, {
  path: '/',
  name: 'Login',
  component: _Login["default"]
}, {
  path: '/home/' + token,
  name: 'Home',
  component: _Home["default"]
}, {
  path: '/accounts-user/' + token,
  name: 'AccountUser',
  component: _AccountUser["default"]
}, {
  path: '/not-found' + token,
  name: 'NotFound',
  component: _NotFound["default"]
}, {
  path: '/profile-user/' + token,
  name: 'ProfileUser',
  component: _ProfileUser["default"]
}, {
  path: '/users/' + token,
  name: 'User',
  component: _User["default"]
}, {
  path: '/food-and-drink-management/' + token,
  name: 'FoodAndDrink',
  component: _FoodAndDrink["default"]
}, {
  path: '/positions/' + token,
  name: 'Position',
  component: _Position["default"]
}, {
  path: '/unauthorize/',
  name: 'Unauthorize',
  component: _Unauthorize["default"]
}, {
  path: '/transaction-list/' + token,
  name: 'TransactionList',
  component: _TransactionList["default"]
}, {
  path: '/order-product-page/' + token,
  name: 'OrderProduct',
  component: _OrderProduct["default"]
}, {
  path: '/payment-configurtion/' + token,
  name: 'PaymentConfig',
  component: _PaymentConfig["default"]
}, {
  path: '/payment-product/' + token,
  name: 'PaymentProduct',
  component: _PaymentProduct["default"]
}];
var router = new _vueRouter["default"]({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
});
router.beforeEach(function (to, from, next) {
  if (token == null || token == '') {
    next({
      path: '/'
    });
  } else {
    next();
  }
});
var _default = router;
exports["default"] = _default;