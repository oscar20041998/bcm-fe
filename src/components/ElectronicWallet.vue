<template>
  <div style="height: 600px; min-height: 10px; overflow-y: scroll">
    <div class="row">
      <template v-for="e in listEwallet">
        <div class="col-sm-2" v-bind:key="e.id">
          <div class="card">
            <img class="card-img-top" :src="e.imageContent" />
            <div class="card-body">
              <h5 class="card-title">
                <strong>{{ e.walletName }}</strong>
              </h5>
              <p class="card-text">{{ e.createBy }} - {{ e.createDate }}</p>
              <b-form-checkbox
                v-model="e.status"
                name="check-button"
                size="lg"
                switch
                @change="onChange(e, $event)"
              ></b-form-checkbox>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      listEwallet: [],
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      currentUser: JSON.parse(localStorage.getItem("user")).userName,
    };
  },
  mounted() {
    this.checkLocalStorage();
    this.getListEwalletInfo();
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
    getListEwalletInfo() {
      http
        .get("/api/electronic-wallet/get-list-ewallet-info/" + this.accountUserValid)
        .then((response) => {
          this.listEwallet = response.data.wallets;
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
          text: "Disable the electronic wallet " + "'" + object.walletName + "'",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, disable it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.disableWallet(object.id);
          } else if (result.isDismissed) {
            this.getListEwalletInfo();
          }
        });
      } else {
        this.$swal({
          title: "Are you sure?",
          text: "Enable the electronic wallet " + "'" + object.walletName + "'",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, enable it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.enableWallet(object.id);
          } else if (result.isDismissed) {
            this.getListEwalletInfo();
          }
        });
      }
    },
    // disable electronic wallet
    disableWallet(id) {
      http
        .post(
          "/api/electronic-wallet/disable-ewallet/" + this.accountUserValid + "/" + id
        )
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Disabled the electronic wallet successfully !!!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Disabled the electronic wallet failed !!!!",
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

    // enable electronic wallet
    enableWallet(id) {
      http
        .post("/api/electronic-wallet/enable-ewallet/" + this.accountUserValid + "/" + id)
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Enabled the electronic wallet successfully !!!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Enabled the electronic wallet failed !!!!",
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
img {
  height: 160px;
  width: 280px;
}
.table td,
.table th {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
  font-size: 12px;
}
</style>
