<template>
  <b-overlay :show="show" rounded="sm">
    <div class="content" style="heigth: 660px">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <b-icon icon="house-door-fill"></b-icon>
            OPERTATION SYSTEM LOG
          </h5>
        </div>
      </div>
      <hr class="my-4" />
      <!-- <div id="carouselExampleInterval" class="carousel slide" data-ride="carousel"> -->
      <!--PERSONAL LOG-->
      <!-- <div class="carousel-inner"> -->
      <!-- <div class="carousel-item active" data-interval="1000"> -->
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
            striped
            hover
            small
            sort-icon-left
            :per-page="perPageSystemLog"
            :current-page="currentPageSystemLog"
          >
            <template v-slot:cell(status)="data">
              <template v-if="data.value === 'Success'">
                <b-icon
                  icon="check-circle-fill"
                  font-scale="1"
                  variant="success"
                ></b-icon>
                {{ data.value }}
              </template>
              <template v-else>
                <b-icon icon="x-circle-fill" font-scale="1" variant="danger"></b-icon>
                {{ data.value }}
              </template>
            </template>
          </b-table>
          <div class="form-inline">
            <div class="col-sm-1">
              <strong>Current Page: {{ currentPageSystemLog }}</strong>
            </div>
            <div class="form-group col-sm-4">
              <select
                class="form-select input-sm"
                style="width: 100px; margin-right: 10px"
                v-model="perPageSystemLog"
                id="select-rows-page"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="50">50</option>
                <option selected value="100">100</option>
              </select>
              <label for="select-rows-page">{{ perPageSystemLog }} rows/ page</label>
            </div>
          </div>
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
      currentPageSystemLog: 1,
      perPageSystemLog: 100,
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
