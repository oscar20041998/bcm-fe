<template>
  <div id="form-login" class="jumbotron">
    <div class="container">
      <div class="row" style="margin-left: 30%">
        <div class="col-md-1">
          <img src="../assets/coffee-cup.png" />
        </div>
        <div class="col-md-8">
          <h1>COFFEE ADMINSTRATOR</h1>
        </div>
      </div>
      <hr class="my-1" />
      <br />
      <div class="card-log-in" style="height: 500px">
        <div class="card-header">
          <b-icon icon="person-circle" font-scale="1"></b-icon> Login info
        </div>
        <div class="card-body">
          <div class="form-group">
            <div class="row">
              <div class="col-md-3">
                <label>User log in</label>
              </div>
              <div class="col-md-8">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      name="username"
                      type="text"
                      class="form-control"
                      v-model="userRequest.userName"
                      maxlength="20"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-md-3">
                <label>Password</label>
              </div>
              <div class="col-md-8">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="password"
                      class="form-control"
                      v-model="userRequest.passWord"
                      required
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button
            id="button-login"
            variant="light"
            class="btn btn-dark btn-lg btn-block"
            @click="login()"
          >
            <div class="hiden">
              <b-icon
                id="loading"
                icon="arrow-counterclockwise"
                animation="spin-reverse-pulse"
                font-scale="1"
              ></b-icon>
              Sign in
            </div>
          </button>
        </div>
        <hr class="my-2" />
        <i> <b-icon icon="watch"></b-icon>List account actived nearly </i>
        <div
          style="
            height: 200px;
            min-height: 10px;
            overflow-y: scroll;
            margin-top: 10px;"
        >
          <b-list-group
            v-for="account in listAccounts"
            v-bind:key="account.accountId"
          >
            <b-list-group-item button @click="convertUserName(account)">
              {{ account.userName }} -
              <i>Last login on: {{ account.lasLoginDate }}</i>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#form-login {
  max-height: fit-content;
  width: auto;
}

.jumbotron {
  height: 100%;
}

.card-header {
  background-color: #343a40 !important;
  color: cornsilk;
  text-align: left;
}

button {
  height: 100%;
  width: auto;
}

.card-body {
  background-color: white;
  height: auto;
  width: 100%;
}

i {
  text-align: right;
}

#loading {
  text-align: center;
}

.card-log-in {
  width: 50%;
  margin-left: 30%;
}

input {
  width: auto;
  height: 50%;
}

h1 {
  text-align: center;
  font-size: 38px;
  color: brown;
  margin-left: 40px;
  width: auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

img {
  height: 70px;
  width: 70px;
}

input {
  height: 20px;
}

p {
  color: red;
  font-size: 12px;
}
</style>

<script>
import http from "../axios/http-common";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

// Add the required rule
extend("required", {
  ...required,
  message: "This field is required.",
});

export default {
  data() {
    return {
      listAccounts: [],
      userRequest: {
        userName: "",
        passWord: "",
      },
    };
  },

  mounted() {
    $("#loading").hide();
    this.isLogIn();
    this.getListAccountLoginNearly();
  },

  // ------------------------------------------------------------------------------------------------------------------------------------------------
  methods: {
    isLogIn() {
      var data = localStorage.getItem("user");
      if (data) {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "You are in session !!!...",
          icon: "success",
          showConfirmButton: false,
          timer: 2100,
        });
      } else {
        this.$router.push({
          name: "Login",
        });
      }
    },

    login() {
      var data = {
        userName: this.userRequest.userName,
        passWord: this.userRequest.passWord,
      };
      if (this.userRequest.userName != "" && this.userRequest.passWord != "") {
        $("#loading").show();
        http
          .post("/api/account/login", data)
          .then((response) => {
            if (response.data.message == "LOG IN SUCCESS") {
              if (response.data.user.status == "BLOCKED") {
                this.$swal({
                  toast: true,
                  showProgressBar: true,
                  position: "top-end",
                  title:
                    "Your account is being blocked. Please contact to your administrator. !!!!",
                  icon: "warning",
                  showConfirmButton: false,
                  timer: 5000,
                });
                $("#loading").hide();
              } else {
                localStorage.setItem(
                  "user",
                  JSON.stringify(response.data.user)
                );
                $("#loading").hide();
                this.$store.commit(
                  "setRoleUser",
                  JSON.parse(localStorage.getItem("user")).roleCode
                );
                this.$store.commit(
                  "setUserName",
                  JSON.parse(localStorage.getItem("user")).userName
                );
                this.$store.commit("setIsLogin", true);
                // Simulate an async request
                this.$router.push({
                  name: "Home",
                });
              }
            } else if (response.data.message == "DUPLICATED LOG IN") {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Your account is being used already !!!...",
                icon: "info",
                showConfirmButton: false,
                timer: 5000,
              });
              $("#loading").hide();
            }
          })
          .catch((error) => {
            $("#loading").hide();
            this.$router.push({
              name: "Unauthorize",
            });
          });
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to identify user",
          icon: "warning",
          showConfirmButton: false,
          timer: 5000,
        });
        return;
      }
    },

    getListAccountLoginNearly() {
      http
        .get("/api/account/get-list-account-login-nearly")
        .then((response) => {
          if (response.status == "200") {
            this.listAccounts = response.data;
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
            timer: 5000,
          });
        });
    },

    convertUserName(account) {
      this.userRequest.userName = account.userName;
    },
  },
  // ------------------------------------------------------------------------------------------------------------------------------------------------
};
</script>
