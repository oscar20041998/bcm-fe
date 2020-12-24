<template>
  <b-overlay :show="show" rounded="sm">
    <div class="jumbotron" style="heigth: 660px">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <b-icon icon="house-door-fill"></b-icon>
            PERSONAL ACTIVITIES LOG
          </h5>
        </div>
      </div>
    </div>
    <!-- <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel"> -->
    <!--PERSONAL LOG-->
    <!-- <div class="carousel-inner"> -->
    <!-- <div class="carousel-item active" data-interval="1000"> -->
    <div class="row" style="margin-bottom: 15px">
      <b-form inline>
        <label>Find by user: </label>
        <b-form-input
          list="my-list-id"
          size="sm"
          v-model="searchLogRequest.userName"
        ></b-form-input>
        <datalist id="my-list-id">
          <option v-for="account in listAccountAvailabel" v-bind:key="account.accountId">
            {{ account.userName }}
          </option>
        </datalist>
      </b-form>
      <b-form inline>
        <label>Find by date: </label>
        <b-input
          size="sm"
          id="input-filter"
          class="form-control"
          type="date"
          placeholder="Search by card number/ create by"
          aria-label="Search"
          v-model="searchLogRequest.date"
        />
      </b-form>
      <div class="col-md-6">
        <button class="btn btn-primary" id="button-search" @click="searchPersonalLog()">
          <b-icon icon="search"></b-icon> Find
        </button>
      </div>
      <div class="col-sm-2">
        <button class="btn btn-secondary" id="button-search" @click="getListSytemLog()">
          <b-icon icon="search"></b-icon> Find by me
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="system-log-div">
        <b-table
          :items="sytemLogList"
          :fields="fieldsPerLog"
          head-variant="dark"
          id="my-table-systemLogList"
          responsive="sm"
          sticky-header
          striped
          hover
          small
          sort-icon-left
          :per-page="perPageSystemLog"
          :current-page="currentPageSystemLog"
        >
          <template v-slot:cell(status)="data">
            <template v-if="data.value === 'Success'">
              <b-icon icon="check-circle-fill" font-scale="1" variant="success"></b-icon>
              {{ data.value }}
            </template>
            <template v-else>
              <b-icon icon="x-circle-fill" font-scale="1" variant="danger"></b-icon>
              {{ data.value }}
            </template>
          </template>
        </b-table>
        <strong class="mt-3">Current Page: {{ currentPageSystemLog }}</strong>
        <hr class="my-4" />
        <div class="row" style="margin-left: 10px">
          <div class="column">
            <b-pagination
              size="md"
              pills
              v-model="currentPageSystemLog"
              :total-rows="rowsSystemLog"
              :per-page="perPageSystemLog"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- <template
            v-if="currentRole == 'ROLE_ADMINISTRATOR' || currentRole == 'ROLE_MANAGER'"
          >
            <div class="carousel-item">
              <h5>ACCOUNT USER ACTIVITIVE LOG</h5>
              <div class="card-body">
                <div class="system-log-div">
                  <b-table
                    :items="accountUserLog"
                    :fields="fieldsAccountLog"
                    head-variant="dark"
                    id="my-table-systemLogList"
                    responsive="sm"
                    sticky-header
                    striped
                    sort-icon-left
                    hover
                    small
                    :per-page="perPageAccountLog"
                    :current-page="currentPageAccountLog"
                  >
                    <template v-slot:cell(userAction)="data">
                      <template v-if="data.value === 'INSERTED'">
                        <b-icon
                          icon="plus-circle"
                          font-scale="1"
                          variant="success"
                        ></b-icon>
                        {{ data.value }}
                      </template>
                      <template v-else-if="data.value === 'DELETED'">
                        <b-icon icon="trash" font-scale="1" variant="danger"></b-icon>
                        {{ data.value }}
                      </template>
                      <template v-else>
                        <b-icon icon="hammer" font-scale="1" variant="info"></b-icon>
                        {{ data.value }}
                      </template>
                    </template>
                  </b-table>
                  <strong class="mt-3">Current Page: {{ currentPageAccountLog }}</strong>
                  <hr class="my-4" />
                  <div class="row" style="margin-left: 10px">
                    <div class="column">
                      <b-pagination
                        size="md"
                        pills
                        v-model="currentPageAccountLog"
                        :total-rows="rowsAccountLog"
                        :per-page="perPageAccountLog"
                        aria-controls="my-table"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="carousel-item">
              <h5>USER ACTIVITIVE LOG</h5>
              <div class="card-body">
                <div class="system-log-div">
                  <b-table
                    :items="userLog"
                    :fields="fieldsUserLog"
                    head-variant="dark"
                    id="my-table-systemLogList"
                    responsive="sm"
                    sticky-header
                    striped
                    sort-icon-left
                    hover
                    small
                    :per-page="perPageUserLog"
                    :current-page="currentPageUserLog"
                  >
                    <template v-slot:cell(userAction)="data">
                      <template v-if="data.value === 'INSERTED'">
                        <b-icon
                          icon="plus-circle"
                          font-scale="1"
                          variant="success"
                        ></b-icon>
                        {{ data.value }}
                      </template>
                      <template v-else-if="data.value === 'DELETED'">
                        <b-icon icon="trash" font-scale="1" variant="danger"></b-icon>
                        {{ data.value }}
                      </template>
                      <template v-else>
                        <b-icon icon="hammer" font-scale="1" variant="info"></b-icon>
                        {{ data.value }}
                      </template>
                    </template>
                  </b-table>
                  <strong class="mt-3">Current Page: {{ currentPageUserLog }}</strong>
                  <hr class="my-4" />
                  <div class="row" style="margin-left: 10px">
                    <div class="column">
                      <b-pagination
                        size="md"
                        pills
                        v-model="currentPageUserLog"
                        :total-rows="rowsUserLog"
                        :per-page="perPageUserLog"
                        aria-controls="my-table"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="carousel-item">
              <h5>PRODUCT ACTIVITIVE LOG</h5>
              <div class="card-body">
                <div class="system-log-div">
                  <b-table
                    :items="productLog"
                    :fields="fieldsProductLog"
                    head-variant="dark"
                    id="my-table-systemLogList"
                    responsive="sm"
                    sticky-header
                    striped
                    sort-icon-left
                    hover
                    small
                    :per-page="perPageProductLog"
                    :current-page="currentPageProductLog"
                  >
                    <template v-slot:cell(userAction)="data">
                      <template v-if="data.value === 'INSERTED'">
                        <b-icon
                          icon="plus-circle"
                          font-scale="1"
                          variant="success"
                        ></b-icon>
                        {{ data.value }}
                      </template>
                      <template v-else-if="data.value === 'DELETED'">
                        <b-icon icon="trash" font-scale="1" variant="danger"></b-icon>
                        {{ data.value }}
                      </template>
                      <template v-else>
                        <b-icon icon="hammer" font-scale="1" variant="info"></b-icon>
                        {{ data.value }}
                      </template>
                    </template>
                  </b-table>
                  <strong class="mt-3">Current Page: {{ currentPageProductLog }}</strong>
                  <hr class="my-4" />
                  <div class="row" style="margin-left: 10px">
                    <div class="column">
                      <b-pagination
                        size="md"
                        pills
                        v-model="currentPageProductLog"
                        :total-rows="rowsProductLog"
                        :per-page="perPageProductLog"
                        aria-controls="my-table"
                      ></b-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template> -->
    <!-- </div> -->
    <!-- <a
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
      </a> -->
    <!-- </div> -->
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
      // accountUserLog: [],
      // userLog: [],
      // productLog: [],
      listAccountAvailabel: [],
      searchLogRequest: {
        userName: "",
        date: "",
      },
      fieldsPerLog: [
        { key: "userName", sortable: true },
        { key: "action", sortable: true },
        { key: "status", sortable: true },
        { key: "actionDate", sortable: true },
      ],
      fieldsAccountLog: [
        { key: "accountId", sortable: true },
        { key: "userName", sortable: true },
        { key: "userAction", sortable: true },
        { key: "createdBy", sortable: true },
        { key: "createdDate", sortable: true },
      ],
      fieldsUserLog: [
        { key: "userId", sortable: true },
        { key: "fullName", sortable: true },
        { key: "phoneNumber", sortable: true },
        { key: "email", sortable: true },
        { key: "userAction", sortable: true },
        { key: "createdBy", sortable: true },
        { key: "createdDate", sortable: true },
      ],
      fieldsProductLog: [
        { key: "productName", sortable: true },
        { key: "price", sortable: true },
        { key: "userAction", sortable: true },
        { key: "createBy", sortable: true },
        { key: "createDate", sortable: true },
      ],

      show: true,
      // current role of user
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      perPageSystemLog: 20,
      currentPageSystemLog: 1,
      perPageUserLog: 20,
      currentPageUserLog: 1,
      perPageAccountLog: 20,
      currentPageAccountLog: 1,
      perPageProductLog: 20,
      currentPageProductLog: 1,
    };
  },

  computed: {
    rowsSystemLog() {
      return this.sytemLogList.length;
    },

    rowsAccountLog() {
      return this.accountUserLog.length;
    },

    rowsUserLog() {
      return this.userLog.length;
    },

    rowsProductLog() {
      return this.productLog.length;
    },
  },
  mounted() {
    this.checkLocalStorage();
    this.getListSytemLog();
    if (this.currentRole == "ROLE_ADMINISTRATOR" || this.currentRole == "ROLE_MANAGER") {
      // this.getAccountUserLog();
      // this.getUserLog();
      // this.getProductLog();
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
    // getAccountUserLog() {
    //   $("#loading").show();
    //   var data = JSON.parse(localStorage.getItem("user"));
    //   http
    //     .get("/system-log/api/get-account-user-log/" + data.accountId)
    //     .then((response) => {
    //       if (response.status == "200") {
    //         this.accountUserLog = response.data;
    //         this.show = false;
    //       } else {
    //         this.$router.push({
    //           name: "NotFound",
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       this.$router.push({
    //         name: "NotFound",
    //       });
    //     });
    // },

    // get user log
    // getUserLog() {
    //   $("#loading").show();
    //   var data = JSON.parse(localStorage.getItem("user"));
    //   http
    //     .get("/system-log/api/get-user-log/" + data.accountId)
    //     .then((response) => {
    //       if (response.status == "200") {
    //         this.userLog = response.data;
    //         this.show = false;
    //       } else {
    //         this.$router.push({
    //           name: "NotFound",
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       this.$router.push({
    //         name: "NotFound",
    //       });
    //     });
    // },

    // get user log
    // getProductLog() {
    //   $("#loading").show();
    //   var data = JSON.parse(localStorage.getItem("user"));
    //   http
    //     .get("/system-log/api/get-product-log/" + data.accountId)
    //     .then((response) => {
    //       if (response.status == "200") {
    //         this.productLog = response.data;
    //         this.show = false;
    //       } else {
    //         this.$router.push({
    //           name: "NotFound",
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       this.$router.push({
    //         name: "NotFound",
    //       });
    //     });
    // },
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

label {
  margin-left: 10px;
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
.system-log-div {
  font-size: 13px;
  margin: 0 30px 0 30px;
}

.row {
  margin: 0 30px 0 30px;
}
.b-table-sticky-header {
  overflow-y: auto;
  max-height: 650px;
}
.carousel-control-prev,
.carousel-control-next {
  background-color: #ffa50000;
  height: 100px;
  width: auto;
  margin-top: 30%;
}
</style>
