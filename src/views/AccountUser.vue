<template>
  <b-overlay :show="show" rounded="sm">
    <div class="jumbotron">
      <div class="row">
        <div class="col">
          <h5>
            <b-icon icon="building"></b-icon>
            SYSTEM ACCOUNT
          </h5>
        </div>
        <div class="col-md-2">
          <b-input
            class="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            size="sm"
            v-model="ctiteriaUserNameSearch"
            @keyup="searchAccountByUserName()"
          />
        </div>
        <div class="col-md-1">
          <b-icon icon="search"></b-icon>
        </div>
      </div>
      <hr class="my-4" />
      <div class="user-div">
        <b-table
          :items="listAccount"
          :fields="fields"
          head-variant="dark"
          id="my-table-systemLogList"
          responsive="sm"
          striped
          hover
          small
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template v-slot:cell(userName)="data">
            <template v-if="data.item.isLogin === '0'">
              <b-icon
                icon="circle-fill"
                animation="throb"
                font-scale="1"
                variant="success"
                title="Being used"
              ></b-icon>
              {{ data.value }}
            </template>
            <template v-else>
              <b-icon
                icon="circle-fill"
                font-scale="1"
                variant="danger"
                title="Not active now"
              ></b-icon>
              {{ data.value }}
            </template>
          </template>
          <template v-slot:cell(status)="data">
            <template v-if="data.value === 'ACTIVE'">
              <b-icon icon="unlock-fill" font-scale="1" variant="success"></b-icon>
              {{ data.value }}
            </template>
            <template v-else-if="data.value === 'BLOCKED'">
              <b-icon
                icon="lock-fill"
                animation="throb"
                font-scale="1"
                variant="danger"
              ></b-icon>
              {{ data.value }}
            </template>
          </template>
          <template v-slot:cell(option)="data">
            <b-row>
              <b-col>
                <template
                  v-if="
                    (currentRole == 'ROLE_ADMINISTRATOR' ||
                      currentRole == 'ROLE_MANAGER') &&
                    data.item.role != 'Role Administrator' &&
                    currentAccountId != data.item.accountId
                  "
                >
                  <button
                    type="button"
                    class="btn btn-link btn-sm"
                    data-toggle="modal"
                    data-target="#accountUserModal"
                    @click="getAccountDetail(data.item.accountId)"
                  >
                    <b-icon icon="pen-fill"></b-icon>
                  </button>
                </template>
              </b-col>
            </b-row>
          </template>
        </b-table>
        <div class="row" style="margin-left: 10px">
          <div class="column">
            <b-pagination
              size="md"
              pills
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </div>
      </div>

      <!-- Modal account user -->
      <div
        class="modal fade"
        id="accountUserModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="false"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="title-form" class="modal-title">INFORMATION DETAIL</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="code"></b-icon>
                  Account ID
                </label>

                <div class="col-sm-4">
                  {{ accountInfo.accountId }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="person-square"></b-icon>
                  Used By
                </label>

                <div class="col-sm-4">
                  {{ accountInfo.usedBy }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="calendar2-date"></b-icon>
                  Role
                </label>
                <div class="col-sm-4" style="text-align: left">
                  {{ accountInfo.role }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="card-heading"></b-icon>
                  Account name
                </label>
                <div class="col-sm-6">
                  {{ accountInfo.userName }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="key-fill"></b-icon>
                  Password
                </label>
                <div class="col-sm-6">
                  {{ accountInfo.password }}
                </div>
                <template
                  v-if="
                    (accountInfo.status == 'ACTIVE' || accountInfo.status == 'BLOCKED') &&
                    (currentRole == 'ROLE_ADMINISTRATOR' || currentRole == 'ROLE_MANAGER')
                  "
                >
                  <div class="col-sm-1">
                    <button
                      type="button"
                      class="btn btn-primary"
                      v-on:click="resetPassword()"
                      title="Reset password for this account"
                    >
                      <b-icon icon="bootstrap-reboot"></b-icon>
                    </button>
                  </div>
                </template>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="phone-vibrate"> </b-icon>
                  Status
                </label>
                <div class="col-sm-6">
                  {{ accountInfo.status }}
                </div>
                <template
                  v-if="
                    accountInfo.status == 'ACTIVE' &&
                    (currentRole == 'ROLE_ADMINISTRATOR' || currentRole == 'ROLE_MANAGER')
                  "
                >
                  <div class="col-sm-1">
                    <button
                      type="button"
                      class="btn btn-danger"
                      v-on:click="blockAccountUser()"
                      title="Block this account"
                    >
                      <b-icon icon="lock-fill"></b-icon>
                    </button>
                  </div>
                </template>
                <template
                  v-else-if="
                    accountInfo.status == 'BLOCKED' &&
                    (currentRole == 'ROLE_ADMINISTRATOR' || currentRole == 'ROLE_MANAGER')
                  "
                >
                  <div class="col-sm-1">
                    <button
                      type="button"
                      class="btn btn-success"
                      v-on:click="unblockAccountUser()"
                      title="Unblock this account"
                    >
                      <b-icon icon="unlock-fill"></b-icon>
                    </button>
                  </div>
                </template>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="mailbox2"></b-icon>
                  Create by
                </label>
                <div class="col-sm-8">
                  {{ accountInfo.createdBy }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="calendar"></b-icon>
                  Create date
                </label>
                <div class="col-sm-8">
                  {{ accountInfo.createdDate }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="calendar2-check"></b-icon>
                  Last login date
                </label>
                <div class="col-sm-8">
                  {{ accountInfo.lasLoginDate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-overlay>
</template>

<style lang="scss" scoped>
.form-inline {
  text-align: right;
}

tbody {
  height: 100px;
  /* Just for the demo          */
  overflow-y: auto;
  /* Trigger vertical scroll    */
  overflow-x: show;
  position: relative;
  font-size: 14px;
}

tr,
td {
  max-width: fit-content;
}

thead,
tbody,
tr,
td,
th {
  max-width: fit-content;
  font-size: 13px;
}

input {
  height: 30px;
}

.user-div {
  font-size: 13px;
  height: 660px;
}
</style>
>

<script>
import http from "../axios/http-common";
import $ from "jquery";
export default {
  data() {
    return {
      listAccount: [],
      ctiteriaUserNameSearch: "",
      accountInfo: {
        accountId: "",
        userId: "",
        role: "",
        userName: "",
        passWord: "",
        status: "",
        isLogin: "",
        createdBy: "",
        createdDate: "",
        lasLoginDate: "",
      },
      show: true,
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      currentAccountId: JSON.parse(localStorage.getItem("user")).accountId,
      currentPage: 1,
      perPage: 25,
      fields: [
        "accountId",
        "userName",
        "role",
        "usedBy",
        "status",
        "createdBy",
        "createdDate",
        "option",
      ],
    };
  },

  mounted() {
    this.checkLoaclStorage();
    this.getListAccount();
  },

  computed: {
    rows() {
      return this.listAccount.length;
    },
  },

  methods: {
    // check local storage
    checkLoaclStorage() {
      var data = JSON.parse(localStorage.getItem("user"));
      if (data == null) {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Please log in frist",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
        this.$router.push({
          name: "Login",
        });
      }
    },

    // get list account
    getListAccount() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      var accountValid = data.accountId;
      http
        .get("/api/account/get-list-account-user/" + accountValid)
        .then((response) => {
          if ((response.status = "200")) {
            this.listAccount = response.data;
            this.show = false;
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
          this.$router.push({
            name: "NotFound",
          });
        });
    },

    // get list account
    searchAccountByUserName() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      var accountValid = data.accountId;
      var userName = this.ctiteriaUserNameSearch;
      if (userName != "") {
        http
          .get("/api/account/search-account-by-username/" + accountValid + "/" + userName)
          .then((response) => {
            if ((response.status = "200")) {
              this.listAccount = response.data;
              $("#loading").hide();
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
            this.$router.push({
              name: "NotFound",
            });
          });
      } else {
        this.callBack();
      }
    },

    callBack() {
      this.getListAccount();
    },

    // get account detail by account id
    getAccountDetail(accountId) {
      this.show = true;
      var data = JSON.parse(localStorage.getItem("user"));
      var accountValid = data.accountId;
      http
        .get("/api/account/get-account-by-account-id/" + accountId + "/" + accountValid)
        .then((response) => {
          if ((response.status = "200")) {
            this.accountInfo = response.data;
            this.show = false;
          }
        })
        .catch((error) => {
          $(".modal").css("display", "none");
          $(".modal-backdrop").css("hide");
          this.$swal({
            toast: true,
            showProgressBar: true,
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
          this.$router.push({
            name: "NotFound",
          });
          this.show = false;
        });
    },

    // block account an user
    blockAccountUser() {
      http
        .post(
          "/api/account/block-an-account-user-by-account-id/" + this.accountInfo.accountId
        )
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Block account " + this.accountInfo.accountId + " successfully !!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          }
          $(".modal").hide();
          $(".modal-backdrop").css("display", "none");
          this.callBack();
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
    },

    // unblock account an user
    unblockAccountUser() {
      http
        .post(
          "/api/account/unblock-an-account-user-by-account-id/" +
            this.accountInfo.accountId
        )
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title:
                "Activated account " + this.accountInfo.accountId + " successfully !!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          }
          $(".modal").hide();
          $(".modal-backdrop").css("display", "none");
          this.callBack();
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
    },

    // unblock account an user
    resetPassword() {
      var randomValue = btoa(Math.random().toString(36));
      $(".modal").hide();
      $(".modal-backdrop").css("display", "none");
      this.$swal({
        title: "CONFIRM TO RESET PASSWORD?",
        text: "New pass is: " + randomValue,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, accept it!",
      }).then((result) => {
        if (result.isConfirmed) {
          http
            .post(
              "/api/account/reset-password-by-account-id/" +
                this.accountInfo.accountId +
                "/" +
                randomValue
            )
            .then((response) => {
              if (response.status == "200") {
                this.$swal({
                  toast: true,
                  showProgressBar: true,
                  position: "top-end",
                  title:
                    "Activated account " +
                    this.accountInfo.accountId +
                    " successfully !!!",
                  icon: "success",
                  showConfirmButton: false,
                  timer: 2100,
                });
              }
              $(".modal").hide();
              $(".modal-backdrop").css("display", "none");
              this.callBack();
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
        }
      });
    },
  },
};
</script>
