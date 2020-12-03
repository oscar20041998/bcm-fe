<template>
<div id="navigation-bar">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-responsive">
        <div class="collapse navbar-collapse" id="navaigation-bar">
            <ul class="navbar-nav mr-auto mt-2 mt-lg-0 column">
                <template v-if="getRole=='ROLE_ADMINISTRATOR' || getRole=='ROLE_MANAGER' || getRole == 'ROLE_STAFF'">
                    <li class="nav-item">
                        <router-link class="nav-link btn btn-dark btn-sm" :to="{name:'Home'}">
                            <b-icon icon="house-door"></b-icon>
                            Home
                        </router-link>
                    </li>
                </template>
                <template v-if="getRole == 'ROLE_ADMINISTRATOR' || getRole == 'ROLE_MANAGER'">
                    <li class="nav-item">
                        <router-link class="nav-link btn btn-dark btn-sm btn-responsive" :to="{name:'AccountUser'}">
                            <b-icon icon="person-circle"></b-icon>
                            Account Mangamement
                        </router-link>
                    </li>
                </template>
                <template v-if="getRole == 'ROLE_ADMINISTRATOR' || getRole == 'ROLE_MANAGER'">
                    <li class="nav-item">
                        <router-link class="nav-link btn btn-dark btn-sm" :to="{name:'User'}">
                            <b-icon icon="people"></b-icon>
                            User Management
                        </router-link>
                    </li>
                </template>
                <template v-if="getRole=='ROLE_ADMINISTRATOR' || getRole=='ROLE_MANAGER' || getRole == 'ROLE_STAFF'">
                    <li class="nav-item">
                        <router-link class="nav-link btn btn-dark btn-sm" :to="{name:'FoodAndDrink'}">
                            <b-icon icon="cup-straw"></b-icon>
                            Food & Drink Management
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link btn btn-dark btn-sm" :to="{name:'Sale'}">
                            <b-icon icon="cart4"></b-icon>
                            Sale Management
                        </router-link>
                    </li>
                    <template v-if="getRole=='ROLE_ADMINISTRATOR' || getRole=='ROLE_MANAGER'">
                        <li class="nav-item">
                            <router-link class="nav-link btn btn-dark btn-sm" :to="{name:'TransactionList'}">
                                <b-icon icon="reception4"></b-icon>
                                Transaction List
                            </router-link>
                        </li>
                    </template>
                </template>
                <template v-if="isLogin == false">
                    <li class="nav-item">
                        <router-link class="nav-link btn btn-dark btn-sm" :to="{name:'Login'}">
                            <b-icon icon="box-arrow-right"></b-icon>
                            Login
                        </router-link>
                    </li>
                </template>
            </ul>
        </div>
        <template v-if="getRole=='ROLE_ADMINISTRATOR' || getRole=='ROLE_MANAGER' || getRole == 'ROLE_STAFF'">
            <b-list-group-item class="d-flex align-items-center" style="height:30px">
                <b-avatar size="sm" class="mr-2"></b-avatar>
                <span class="mr-auto"><i>Hello,{{getUserName}}</i></span>
                <div class="btn-group dropleft">
                    <button type="button" class="btn btn-light btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
                        Option <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                        <button class="dropdown-item btn-sm" type="button" v-on:click="goToProfileUser()">
                            <b-icon icon="file-person-fill"></b-icon>See profile
                        </button>
                        <button class="dropdown-item btn-sm" type="button" v-on:click="logout()">
                            <b-icon icon="door-open-fill"></b-icon>
                            Sign me out
                        </button>
                    </div>
                </div>
            </b-list-group-item>
        </template>
    </nav>
    <router-view />
</div>
</template>

<script>
import http from './axios/http-common'
export default {
    data() {
        return {
            timeNow: '',
            userNameLogIn: this.$store.getters.getUserName
        }
    },

    computed: {
        isLogin() {
            return this.$store.getters.getIsLogin;
        },

        getRole() {
            return this.$store.getters.getRoleUser;
        },
        getUserName() {
            return this.$store.getters.getUserName;
        }
    },

    mounted() {
        this.clear();
    },

    methods: {
        clear() {
            var accountId = (JSON.parse(localStorage.getItem('user'))).accountId || ''
            var username = (JSON.parse(localStorage.getItem('user'))).userName || ''
            if ((accountId != null || accountId != '') && (username != null || accountId != '')) {
                http.post("/api/account/logout-user/" + accountId + "/" + username).then(response => {
                    window.onload = window.localStorage.clear()
                    window.onunload = window.localStorage.clear()
                    this.$store.commit('setIsLogin', false)
                     this.$router.push({name:'Login'})
                }).catch(error => {
                    alert(error)
                })
            }
        },

        goToProfileUser() {
            this.$router.push({
                name: 'ProfileUser'
            })
        },

        logout() {
            if (localStorage.getItem('user') != null) {
                var accountId = (JSON.parse(localStorage.getItem("user"))).accountId
                var username = (JSON.parse(localStorage.getItem("user"))).userName
                http.post("/api/account/logout-user/" + accountId + '/' + username).then(response => {
                    if (response.status == "200") {
                        localStorage.setItem('user', '')
                        this.$swal({
                            toast: true,
                            showProgressBar: true,
                            position: 'top-end',
                            title: 'You singed out already !!!...',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 2100
                        })
                        this.$store.commit("setRoleUser", null)
                        this.$store.commit("setIsLogin", false)
                        this.$router.push({
                            name: 'Login'
                        })
                    }
                }).catch(error => {
                    this.$swal({
                        toast: true,
                        showProgressBar: true,
                        position: 'top-end',
                        title: error,
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 2100
                    })
                })
            } else {
                this.$swal({
                    toast: true,
                    showProgressBar: true,
                    position: 'top-end',
                    title: 'You has been singed out before already !!!...',
                    icon: 'info',
                    showConfirmButton: false,
                    timer: 2100
                })
            }
        }
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

//  <router-link class="nav-link" to="/">Home</router-link>

#navigation-bar {
    padding: 0px;

    button {
        font-size: 12px;
    }

    a {
        font-weight: bold;
        color: white;
        font-size: 13px;

        &.router-link-exact-active {
            color: orange;
        }
    }

    .form-inline my-2 my-lg-0 {
        text-align: right;
    }
}
</style>
