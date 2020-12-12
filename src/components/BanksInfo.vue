<template>
  <div style="height: 600px; min-height: 10px; overflow-y: scroll">
    <div class="col-md-5"></div>
    <div class="col-md-5"><b-spinner id="loading" label="Loading..."></b-spinner></div>
    <table
      id="table-bank-info"
      class="table table-striped table-responsive-sm"
      cellspacing="0"
      style="max-heigh: 100px"
    >
      <thead class="thead-dark">
        <tr>
          <th scope="col">Bank code</th>
          <th scope="col">Bank name</th>
          <th scope="col">Status</th>
          <th scope="col">Created by</th>
          <th scope="col">Created date</th>
        </tr>
      </thead>
      <tbody sytle="min-height:10px; overflow-y:scroll">
        <tr v-for="b in listBankInfo" v-bind:key="b.bankCode">
          <th scope="row">
            {{ b.bankCode }}
          </th>
          <td>{{ b.bankName }}</td>
          <td>
            <b-form-checkbox
              v-model="b.status"
              name="check-button"
              size="lg"
              switch
              @change="onChange(b, $event)"
            >
            </b-form-checkbox>
          </td>
          <td>{{ b.createBy }}</td>
          <td>
            <i>{{ b.createDate }}</i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      listBankInfo: [],
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      currentUser: JSON.parse(localStorage.getItem("user")).userName,
      listItemChecked: [],
    };
  },
  mounted() {
    this.checkLocalStorage();
    this.getListBankInfo();
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

    // get list bank info
    getListBankInfo() {
      http
        .get("/api/bank-info/get-list-bank-info/" + this.accountUserValid)
        .then((response) => {
          this.listBankInfo = response.data.banks;
          $("#loading").hide();
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

    // click to disabled or enabled the bank
    onChange(object, event) {
      if (event == false) {
        this.$swal({
          title: "Are you sure?",
          text: "Disable the bank " + "'" + object.bankName + "'",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, disable it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.disableBankInfo(object.bankCode);
          } else if (result.isDismissed) {
            this.getListBankInfo();
          }
        });
      } else {
        this.$swal({
          title: "Are you sure?",
          text: "Enable the bank " + "'" + object.bankName + "'",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, enable it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.enableBankInfo(object.bankCode);
          } else if (result.isDismissed) {
            this.getListBankInfo();
          }
        });
      }
    },
    // disable bank info
    disableBankInfo(bankCode) {
      http
        .post("/api/bank-info/disable-bank/" + this.accountUserValid + "/" + bankCode)
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Disabled the bank successfully !!!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Disabled the bank failed !!!!",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
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
    },

    // enable bank info
    enableBankInfo(bankCode) {
      http
        .post("/api/bank-info/enable-bank/" + this.accountUserValid + "/" + bankCode)
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Enabled the bank successfully !!!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Enabled the bank failed !!!!",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
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
    },
  },
};
</script>
<style scoped>
.table td,
.table th {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
  font-size: 12px;
}
</style>
