import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        roleUser: '',
        userName: '',
        tableId: '',
        isLogin: false,
    },
    mutations: {
        setRoleUser: (state, value) => {
            state.roleUser = value;
        },
        setIsLogin: (state, value) => {
            state.isLogin = value
        },
        setUserName: (state, value) => {
            state.userName = value
        },
        setTableId: (state, value) => {
            state.tableId = value
        }
    },
    actions: {},
    modules: {},
    getters: {
        getRoleUser: state => {
            return state.roleUser
        },
        getIsLogin: state => {
            return state.isLogin
        },
        getUserName: state => {
            return state.userName
        },
        getTableId: state => {
            return state.tableId
        }
    }
})