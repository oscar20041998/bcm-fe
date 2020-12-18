<template>
  <b-overlay :show="show" rounded="sm">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <b-icon icon="house-door-fill"></b-icon>
            OPERTATION SYSTEM LOG
          </h5>
        </div>
      </div>
      <hr class="my-4" />
      <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel">
        <!--PERSONAL LOG-->
        <div class="carousel-inner">
          <div class="carousel-item active" data-interval="1000">
            <h5>PERSONAL ACTIVITIES LOG</h5>
            <div class="row" style="margin-bottom: 15px">
              <div class="col-sm-2">
                <div>
                  <b-form-input
                    list="my-list-id"
                    size="sm"
                    v-model="searchLogRequest.userName"
                  ></b-form-input>
                  <datalist id="my-list-id">
                    <option
                      v-for="account in listAccountAvailabel"
                      v-bind:key="account.accountId"
                    >
                      {{ account.userName }}
                    </option>
                  </datalist>
                </div>
              </div>
              <div class="col-md-2">
                <b-input
                  size="sm"
                  id="input-filter"
                  class="form-control"
                  type="date"
                  placeholder="Search by card number/ create by"
                  aria-label="Search"
                  v-model="searchLogRequest.date"
                />
              </div>
              <div class="col-md-6">
                <button
                  class="btn btn-primary"
                  id="button-search"
                  @click="searchPersonalLog()"
                >
                  <b-icon icon="search"></b-icon> Find
                </button>
              </div>
              <div class="col-sm-2">
                <button
                  class="btn btn-secondary"
                  id="button-search"
                  @click="getListSytemLog()"
                >
                  <b-icon icon="search"></b-icon> Find by me
                </button>
              </div>
            </div>
            <div class="card-body">
              <div style="height: 600px; min-height: 10px; overflow-y: scroll">
                <table
                  id="table-log-detail"
                  class="table table-striped table-responsive-sm"
                  cellspacing="0"
                  style="max-heigh: 100px"
                >
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">User name</th>
                      <th scope="col">Action</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action on time</th>
                      <th scope="col">Log by</th>
                    </tr>
                  </thead>
                  <tbody sytle="min-height:10px; overflow-y:scroll">
                    <tr v-for="log in sytemLogList" v-bind:key="log.userName">
                      <th scope="row">
                        <b-icon
                          icon="person-fill"
                          animation="no-fade"
                          font-scale="1"
                        ></b-icon>
                        {{ log.userName }}
                      </th>
                      <td>{{ log.action }}</td>
                      <td>
                        <template v-if="log.status === 'Success'">
                          <b-icon
                            icon="check-circle-fill"
                            font-scale="1"
                            variant="success"
                          ></b-icon>
                        </template>
                        <template v-else-if="log.status === 'Failed'">
                          <b-icon
                            icon="x-circle-fill"
                            font-scale="1"
                            variant="danger"
                          ></b-icon>
                        </template>
                        {{ log.status }}
                      </td>
                      <td>{{ log.actionDate }}</td>
                      <td><i>SYSTEM</i></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <template
            v-if="currentRole == 'ROLE_ADMINISTRATOR' || currentRole == 'ROLE_MANAGER'"
          >
            <!--ACCOUNT USER LOG-->
            <div class="carousel-item">
              <h5>ACCOUNT USER ACTIVITIVE LOG</h5>
              <div class="card-body">
                <div style="height: 600px; min-height: 10px; overflow-x: scroll">
                  <table
                    id="table-log-detail"
                    class="table table-striped table-responsive-sm"
                    cellspacing="0"
                    style="max-heigh: 100px"
                  >
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">AccountID</th>
                        <th scope="col">User name</th>
                        <th scope="col">Action</th>
                        <th scope="col">Created by</th>
                        <th scope="col">Created date</th>
                      </tr>
                    </thead>
                    <tbody sytle="min-height:10px; overflow-x:scroll">
                      <tr v-for="log in accountUserLog" v-bind:key="log.userName">
                        <th scope="row">
                          <b-icon
                            icon="check-fill"
                            animation="no-fade"
                            font-scale="1"
                          ></b-icon>
                          {{ log.accountId }}
                        </th>
                        <td>{{ log.userName }}</td>
                        <td>
                          <strong>{{ log.userAction }}</strong>
                        </td>
                        <td>{{ log.createdBy }}</td>
                        <td>
                          <i>{{ log.createdDate }}</i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- USER LOG -->
            <div class="carousel-item">
              <h5>USER ACTIVITIVE LOG</h5>
              <div class="card-body">
                <div style="height: 600px; min-height: 10px; overflow-x: scroll">
                  <table
                    id="table-log-user-detail"
                    class="table table-striped table-responsive-sm"
                    cellspacing="0"
                    style="max-heigh: 100px"
                  >
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Full name</th>
                        <th scope="col">Phone number</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        <th scope="col">Created by</th>
                        <th scope="col">Created date</th>
                      </tr>
                    </thead>
                    <tbody sytle="min-height:10px; overflow-y:scroll">
                      <tr v-for="log in userLog" v-bind:key="log.userId">
                        <th scope="row">
                          <b-icon
                            icon="person-fill"
                            animation="no-fade"
                            font-scale="1"
                          ></b-icon>
                          {{ log.userId }}
                        </th>
                        <td>{{ log.fullName }}</td>
                        <td>{{ log.phoneNumber }}</td>
                        <td>{{ log.email }}</td>
                        <td>
                          <strong>{{ log.userAction }}</strong>
                        </td>
                        <td>{{ log.createdBy }}</td>
                        <td>
                          <i>{{ log.createdDate }}</i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- PRODUCT LOG-->
            <div class="carousel-item">
              <h5>PRODUCT ACTIVITIVE LOG</h5>
              <div class="card-body">
                <div style="height: 600px; min-height: 10px; overflow-x: scroll">
                  <table
                    id="table-log-user-detail"
                    class="table table-striped table-responsive-sm"
                    cellspacing="0"
                    style="max-heigh: 100px"
                  >
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">Product name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Action user</th>
                        <th scope="col">Create by</th>
                        <th scope="col">Create date</th>
                      </tr>
                    </thead>
                    <tbody sytle="min-height:10px; overflow-y:scroll">
                      <tr v-for="log in productLog" :key="log.id">
                        <th scope="row">
                          <b-icon icon="box" animation="no-fade" font-scale="1"></b-icon>
                          {{ log.productName }}
                        </th>
                        <td>{{ log.price }}</td>
                        <td>
                          <strong>{{ log.userAction }}</strong>
                        </td>
                        <td>{{ log.createBy }}</td>
                        <td>
                          <i>{{ log.createDate }}</i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselExampleInterval"
        role="button"
        data-slide="prev"
      >
        <b-icon icon="arrow-left-circle-fill" font-scale="4" variant="secondary"></b-icon>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselExampleInterval"
        role="button"
        data-slide="next"
      >
        <b-icon
          icon="arrow-right-circle-fill"
          font-scale="4"
          variant="secondary"
        ></b-icon>
      </a>
    </div>
  </b-overlay>
</template>

<script>
import http from "../axios/http-common";
import $ from "jquery";

export default {
  name: "DatatablePage",

  data() {
    return {
      sytemLogList: [],
      accountUserLog: [],
      userLog: [],
      productLog: [],
      listAccountAvailabel: [],
      searchLogRequest: {
        userName: "",
        date: "",
      },
      show: true,
      // current role of user
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
    };
  },

  computed: {},
  mounted() {
    this.checkLocalStorage();
    this.getListSytemLog();
    if (this.currentRole == "ROLE_ADMINISTRATOR" || this.currentRole == "ROLE_MANAGER") {
      this.getAccountUserLog();
      this.getUserLog();
      this.getProductLog();
      this.getListAccount();
    }
  },

  methods: {
    // check local storage
    checkLocalStorage() {
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
            this.listAccountAvailabel = response.data;
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

    // get system log
    getListSytemLog() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      http
        .get("/system-log/api/get-system-log-by-account/" + data.userName)
        .then((response) => {
          if (response.status == "200") {
            this.sytemLogList = response.data;
            this.show = false;
          } else {
            this.sytemLogList = response.data;
            this.show = false;
          }
        })
        .catch((error) => {
          this.sytemLogList = response.data;
          this.show = false;
        });
    },

    // get system log
    searchPersonalLog() {
      $("#loading").show();
      var request = this.searchLogRequest;
      http
        .post("/system-log/api/search-personal-log", request)
        .then((response) => {
          if (response.status == "200") {
            this.sytemLogList = response.data;
            this.show = false;
          } else {
            this.sytemLogList = "";
            this.show = false;
          }
        })
        .catch((error) => {
          this.sytemLogList = "";
          this.show = false;
        });
    },

    // get account user log
    getAccountUserLog() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      http
        .get("/system-log/api/get-account-user-log/" + data.accountId)
        .then((response) => {
          if (response.status == "200") {
            this.accountUserLog = response.data;
            this.show = false;
          } else {
            this.$router.push({
              name: "NotFound",
            });
          }
        })
        .catch((error) => {
          this.$router.push({
            name: "NotFound",
          });
        });
    },

    // get user log
    getUserLog() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      http
        .get("/system-log/api/get-user-log/" + data.accountId)
        .then((response) => {
          if (response.status == "200") {
            this.userLog = response.data;
            this.show = false;
          } else {
            this.$router.push({
              name: "NotFound",
            });
          }
        })
        .catch((error) => {
          this.$router.push({
            name: "NotFound",
          });
        });
    },

    // get user log
    getProductLog() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      http
        .get("/system-log/api/get-product-log/" + data.accountId)
        .then((response) => {
          if (response.status == "200") {
            this.productLog = response.data;
            this.show = false;
          } else {
            this.$router.push({
              name: "NotFound",
            });
          }
        })
        .catch((error) => {
          this.$router.push({
            name: "NotFound",
          });
        });
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
}

h3 {
  margin-top: 30px;
}

#table-log-detail {
  max-height: 100px !important;
  bottom: 5rem;
  overflow: auto;
}

.card-header-log {
  background-color: #ffa50000;
  color: whitesmoke;
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
tbody {
  width: 100%;
  height: 20px;
  font-size: 12px;
}

.pagination {
  background-color: #ffa50000;
}

.page-item {
  color: black;
}

button {
  text-align: left;
}

.carousel-control-prev,
.carousel-control-next {
  background-color: #ffa50000;
  height: 100px;
  width: auto;
  margin-top: 30%;
}
</style>
