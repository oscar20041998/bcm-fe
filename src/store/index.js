import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        roleUser: '',
        accountId: '',
        userName: '',
        userName: '',
        tableId: '',
        isLogin: false,
        listOrdered: [],
        totalPrice: '',
    },
    mutations: {
        setRoleUser: (state, value) => {
            state.roleUser = value;
        },
        setAccountId: (state, value) => {
            state.accountId = value
        },
        setUserName: (state, value) => {
            state.userName = value
        },
        setIsLogin: (state, value) => {
            state.isLogin = value
        },
        setUserName: (state, value) => {
            state.userName = value
        },
        setTableId: (state, value) => {
            state.tableId = value
        },
        setListOrdered: (state, value) => {
            state.listOrdered = value
        },
        setTotalPrice: (state, value) => {
            state.totalPrice = value
        },
    },
    actions: {},
    modules: {},
    getters: {
        getRoleUser: state => {
            return state.roleUser
        },
        getAccountId: state => {
            return state.accountId
        },
        getUserName: state => {
            return state.userName
        },
        getIsLogin: state => {
            return state.isLogin
        },
        getUserName: state => {
            return state.userName
        },
        getTableId: state => {
            return state.tableId
        },
        getListOrdered: state => {
            return state.listOrdered
        },
        getTotalPrice: state => {
            return state.totalPrice
        },
    }
})