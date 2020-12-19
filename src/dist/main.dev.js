"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _NavigationBar = _interopRequireDefault(require("./NavigationBar.vue"));

var _router = _interopRequireDefault(require("./router"));

var _index = _interopRequireDefault(require("./store/index.js"));

var _bootstrapVue = require("bootstrap-vue");

var _vueSweetalert = _interopRequireDefault(require("vue-sweetalert2"));

var _vueSlidingPagination = _interopRequireDefault(require("vue-sliding-pagination"));

require("sweetalert2/dist/sweetalert2.min.css");

var _jquery = _interopRequireDefault(require("jquery"));

var _vueCurrencyInput = _interopRequireDefault(require("vue-currency-input"));

var _vuex = _interopRequireDefault(require("vuex"));

var _veeValidate = require("vee-validate");

var _vMask = _interopRequireDefault(require("v-mask"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vMask["default"]);

_vue["default"].use(_bootstrapVue.ModalPlugin);

_vue["default"].use(_vuex["default"]);

_vue["default"].use(_vueCurrencyInput["default"]);

_vue["default"].use(_bootstrapVue.CarouselPlugin);

_vue["default"].use(_bootstrapVue.SidebarPlugin);

_vue["default"].use(_bootstrapVue.TablePlugin);

_vue["default"].use(_bootstrapVue.PaginationPlugin);

_vue["default"].use(_vueSweetalert["default"]);

_vue["default"].use(_bootstrapVue.BootstrapVue);

_vue["default"].use(_bootstrapVue.BootstrapVueIcons);

_vue["default"].use(_jquery["default"]);

_vue["default"].use(_vueSlidingPagination["default"]);

_vue["default"].component('paginate', VuejsPaginate);

_vue["default"].component('ValidationProvider', _veeValidate.ValidationProvider);

_vue["default"].config.productionTip = false;
_vue["default"].config.devtools = false;
new _vue["default"]({
  BootstrapVue: _bootstrapVue.BootstrapVue,
  BootstrapVueIcons: _bootstrapVue.BootstrapVueIcons,
  router: _router["default"],
  store: _index["default"],
  render: function render(h) {
    return h(_NavigationBar["default"]);
  }
}).$mount('#app');