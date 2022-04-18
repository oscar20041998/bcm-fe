<template>
  <div id="navigation-bar">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark w-responsive nav-bar-fixed">
      <div class="collapse navbar-collapse" id="navaigation-bar">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0 column">
          <template
            v-if="
              getRole == 'ROLE_ADMINISTRATOR' ||
              getRole == 'ROLE_MANAGER' ||
              getRole == 'ROLE_STAFF'
            "
          >
            <li class="nav-item">
              <router-link class="nav-link btn btn-dark btn-sm" :to="{ name: 'Home' }">
                <b-icon icon="house-door"></b-icon>
                Home
              </router-link>
            </li>
          </template>
          <template v-if="getRole == 'ROLE_ADMINISTRATOR' || getRole == 'ROLE_MANAGER'">
            <li class="nav-item">
              <router-link
                class="nav-link btn btn-dark btn-sm btn-responsive"
                :to="{ name: 'AccountUser' }"
              >
                <b-icon icon="person-circle"></b-icon>
                Account Mangamement
              </router-link>
            </li>
          </template>
          <template v-if="getRole == 'ROLE_ADMINISTRATOR' || getRole == 'ROLE_MANAGER'">
            <li class="nav-item">
              <router-link class="nav-link btn btn-dark btn-sm" :to="{ name: 'User' }">
                <b-icon icon="people"></b-icon>
                User Management
              </router-link>
            </li>
          </template>
          <template
            v-if="
              getRole == 'ROLE_ADMINISTRATOR' ||
              getRole == 'ROLE_MANAGER' ||
              getRole == 'ROLE_STAFF'
            "
          >
            <li class="nav-item">
              <router-link
                class="nav-link btn btn-dark btn-sm"
                :to="{ name: 'FoodAndDrink' }"
              >
                <b-icon icon="cup-straw"></b-icon>
                Food & Drink Management
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link btn btn-dark btn-sm"
                :to="{ name: 'Position' }"
              >
                <b-icon icon="cart4"></b-icon>
                Sale Management
              </router-link>
            </li>
            <template v-if="getRole == 'ROLE_ADMINISTRATOR' || getRole == 'ROLE_MANAGER'">
              <li class="nav-item">
                <router-link
                  class="nav-link btn btn-dark btn-sm"
                  :to="{ name: 'TransactionList' }"
                >
                  <b-icon icon="reception4"></b-icon>
                  Transaction List
                </router-link>
              </li>
            </template>
            <template v-if="getRole == 'ROLE_ADMINISTRATOR' || getRole == 'ROLE_MANAGER'">
              <li class="nav-item">
                <router-link
                  class="nav-link btn btn-dark btn-sm"
                  :to="{ name: 'PaymentConfig' }"
                >
                  <b-icon icon="gear-fill"></b-icon>
                  Payment Configuration
                </router-link>
              </li>
            </template>
          </template>
          <template v-if="isLogin == false">
            <li class="nav-item">
              <router-link class="nav-link btn btn-dark btn-sm" :to="{ name: 'Login' }">
                <b-icon icon="box-arrow-right"></b-icon>
                Login
              </router-link>
            </li>
          </template>
        </ul>
      </div>
      <template
        v-if="
          getRole == 'ROLE_ADMINISTRATOR' ||
          getRole == 'ROLE_MANAGER' ||
          getRole == 'ROLE_STAFF'
        "
      >
        <b-list-group-item class="d-flex align-items-center" style="height: 30px">
          <b-avatar size="sm" class="mr-2"></b-avatar>
          <span class="mr-auto">Hello,{{ getUserName }}</span>
          <div class="btn-group dropleft">
            <button
              type="button"
              class="btn btn-light btn-sm dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <b-icon icon="gear-fill" aria-hidden="true"></b-icon>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
              <button
                class="dropdown-item btn-sm"
                type="button"
                v-on:click="goToProfileUser()"
              >
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
import http from "./axios/http-common";
export default {
  data() {
    return {
      timeNow: "",
      userNameLogIn: this.$store.getters.getUserName,
    };
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
    },
  },

  mounted() {
    this.clear();
  },

  methods: {
    clear() {
      var accountId = JSON.parse(localStorage.getItem("user")).accountId || "";
      var username = JSON.parse(localStorage.getItem("user")).userName || "";
      if (
        (accountId != null || accountId != "") &&
        (username != null || accountId != "")
      ) {
        http
          .post("/api/account/logout-user/" + accountId + "/" + username)
          .then((response) => {
            window.onload = window.localStorage.clear();
            window.onunload = window.localStorage.clear();
            this.$store.commit("setIsLogin", false);
            this.$router.push({ name: "Login" });
          })
          .catch((error) => {
            alert(error);
          });
      }
    },

    goToProfileUser() {
      this.$router.push({
        name: "ProfileUser",
      });
    },

    logout() {
      if (localStorage.getItem("user") != null) {
        var accountId = JSON.parse(localStorage.getItem("user")).accountId;
        var username = JSON.parse(localStorage.getItem("user")).userName;
        http
          .post("/api/account/logout-user/" + accountId + "/" + username)
          .then((response) => {
            if (response.status == "200") {
              localStorage.clear();
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "You singed out already !!!...",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
              this.$store.commit("setRoleUser", null);
              this.$store.commit("setIsLogin", false);
              this.$router.push({
                name: "Login",
              });
            }
          })
          .catch((error) => {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: error,
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
          });
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "You has been singed out before already !!!...",
          icon: "info",
          showConfirmButton: false,
          timer: 2100,
        });
      }
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Times New Roman", Times, serif, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

//  <router-link class="nav-link" to="/">Home</router-link>

#navigation-bar {
  padding: 30px;
  font-size: 13px;
  font-family: Tahoma;

  button {
    font-size: 12px;
  }

  a {
    font-weight: bold;
    font-size: 12px;

    &.router-link-exact-active {
      background-color: #de8218;
      color: whitesmoke;
    }
  }

  .form-inline my-2 my-lg-0 {
    text-align: right;
  }

  table tbody tr th td {
    font-size: 12px;
  }

  html {
    font-size: 13px;
  }

  .modal-header {
    background: #343a40;
    color: white;
  }
}
.nav-bar-fixed {
  box-shadow: rgb(193 200 207) 12px 10px 5px 5px;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.content {
  padding-top: 50px;
  width: 100%;
  text-align: left;
  vertical-align: top;

  table tr,
  thead,
  th,
  tbody,
  td {
    font-size: 13px;
  }
}

.loading-text {
  text-align: center;
  font-size: 23px;
  position: relative;
  display: block;
  z-index: 1000;
}

select {
  cursor: pointer;
}

@media print {
  body {
    text-align: center;
    font-size: 13px;
    font-family: "Lucida Bright";

    i,
    strong {
      font-size: 14px;
      font-family: "Lucida Bright", cursive;
      word-break: break-all;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      font-size: 13px !important;
      font-family: "Lucida Bright", cursive !important;
      word-break: break-all !important;
      font-weight: "normal";
    }

    .row {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
    }

    .col,
    .col-1,
    .col-10,
    .col-11,
    .col-12,
    .col-2,
    .col-3,
    .col-4,
    .col-5,
    .col-6,
    .col-7,
    .col-8,
    .col-9,
    .col-auto,
    .col-lg,
    .col-lg-1,
    .col-lg-10,
    .col-lg-11,
    .col-lg-12,
    .col-lg-2,
    .col-lg-3,
    .col-lg-4,
    .col-lg-5,
    .col-lg-6,
    .col-lg-7,
    .col-lg-8,
    .col-lg-9,
    .col-lg-auto,
    .col-md,
    .col-md-1,
    .col-md-10,
    .col-md-11,
    .col-md-12,
    .col-md-2,
    .col-md-3,
    .col-md-4,
    .col-md-5,
    .col-md-6,
    .col-md-7,
    .col-md-8,
    .col-md-9,
    .col-md-auto,
    .col-sm,
    .col-sm-1,
    .col-sm-10,
    .col-sm-11,
    .col-sm-12,
    .col-sm-2,
    .col-sm-3,
    .col-sm-4,
    .col-sm-5,
    .col-sm-6,
    .col-sm-7,
    .col-sm-8,
    .col-sm-9,
    .col-sm-auto,
    .col-xl,
    .col-xl-1,
    .col-xl-10,
    .col-xl-11,
    .col-xl-12,
    .col-xl-2,
    .col-xl-3,
    .col-xl-4,
    .col-xl-5,
    .col-xl-6,
    .col-xl-7,
    .col-xl-8,
    .col-xl-9,
    .col-xl-auto {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }

    table {
      border-collapse: collapse;
    }
    table,
    th,
    td {
      border: 1px solid;
    }

    .table .thead-dark th {
      color: #fff;
      background-color: #343a40;
      border-color: #454d55;
    }

    .table > thead {
      vertical-align: bottom;
    }

    tbody,
    td,
    tfoot,
    th,
    thead,
    tr {
      border-color: inherit;
      border-style: solid;
      border-width: 0;
    }

    .table > :not(:first-child) {
      border-top: 2px solid currentColor;
    }
  }
} ;
</style>
