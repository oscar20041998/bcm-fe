import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import NavigationBar from '../NavigationBar.vue'
import NotFound from '../views/NotFound.vue'
import ProfileUser from '../components/ProfileUser.vue'
import AccountUser from '../views/AccountUser.vue'
import User from '../views/User.vue'
import FoodAndDrink from '../views/FoodAndDrink.vue'
import Position from '../views/Position.vue'
import Unauthorize from '../views/Unauthorize.vue'
import TransactionList from '../views/TransactionList.vue'
import OrderProduct from '../views/OrderProduct.vue'
import PaymentConfig from '../views/PaymentConfig.vue'
import PaymentProduct from '../components/PaymentProduct.vue'
var token = JSON.parse(localStorage.getItem('user')) != null || JSON.parse(localStorage.getItem('user')) != '' ? btoa(JSON.parse(localStorage.getItem('user')).key) : ''
Vue.use(VueRouter)
const routes = [{
        path: '/navigation-bar',
        name: 'NavigationBar',
        component: NavigationBar
    },
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home/' + token,
        name: 'Home',
        component: Home
    },
    {
        path: '/accounts-user/' + token,
        name: 'AccountUser',
        component: AccountUser
    },
    {
        path: '/not-found' + token,
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/profile-user/' + token,
        name: 'ProfileUser',
        component: ProfileUser
    },
    {
        path: '/users/' + token,
        name: 'User',
        component: User
    },
    {
        path: '/food-and-drink-management/' + token,
        name: 'FoodAndDrink',
        component: FoodAndDrink
    },
    {
        path: '/positions/' + token,
        name: 'Position',
        component: Position
    },
    {
        path: '/unauthorize/',
        name: 'Unauthorize',
        component: Unauthorize
    },
    {
        path: '/transaction-list/' + token,
        name: 'TransactionList',
        component: TransactionList
    },
    {
        path: '/order-product-page/' + token,
        name: 'OrderProduct',
        component: OrderProduct
    },
    {
        path: '/payment-configurtion/' + token,
        name: 'PaymentConfig',
        component: PaymentConfig
    },
    {
        path: '/payment-product/' + token,
        name: 'PaymentProduct',
        component: PaymentProduct
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (token == null || token == '') {
        next({
            path: '/'
        })
    } else {
        next();
    }
})

export default router