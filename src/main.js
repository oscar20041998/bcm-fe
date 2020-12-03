import Vue from 'vue'
import NavigationBar from './NavigationBar.vue'
import router from './router'
import store from './store/index.js'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2';
import SlidingPagination from 'vue-sliding-pagination'

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
import $ from 'jquery'
import { PaginationPlugin } from 'bootstrap-vue'
import { TablePlugin } from 'bootstrap-vue'
import { SidebarPlugin } from 'bootstrap-vue'
import { CarouselPlugin } from 'bootstrap-vue'
import VueCurrencyInput from "vue-currency-input";
import Vuex from 'vuex';
import { ModalPlugin } from 'bootstrap-vue'
import { ValidationProvider } from 'vee-validate';

Vue.use(ModalPlugin)
Vue.use(Vuex)
Vue.use(VueCurrencyInput);
Vue.use(CarouselPlugin)
Vue.use(SidebarPlugin)
Vue.use(TablePlugin)
Vue.use(PaginationPlugin)
Vue.use(VueSweetalert2);
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use($)
Vue.use(SlidingPagination)
Vue.config.productionTip = false
Vue.component('paginate', VuejsPaginate)
Vue.component('ValidationProvider', ValidationProvider);
new Vue({
    BootstrapVue,
    BootstrapVueIcons,
    router,
    store,
    render: h => h(NavigationBar)
}).$mount('#app')