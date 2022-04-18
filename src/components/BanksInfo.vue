<template>
  <b-overlay :show="show" rounded="sm">
    <div class="content">
      <b-row>
        <template v-for="b in listBankInfo">
          <b-col v-bind:key="b.bankCode">
            <b-card
              v-bind:key="b.bankCode"
              :title="b.bankName"
              :img-src="b.imageContent"
              img-alt="Image"
              img-top
              tag="article"
              style="float: left; margin: 0 10px 0 10px"
              class="mb-2"
            >
              <b-card-text> {{ b.createBy }} - {{ b.createDate }} </b-card-text>
              <b-form-checkbox
                v-model="b.status"
                name="check-button"
                size="lg"
                switch
                @change="onChange(b, $event)"
              ></b-form-checkbox>
            </b-card>
          </b-col>
        </template>
      </b-row>
    </div>
  </b-overlay>
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
      bankCode: "",
      show: true,
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
          this.show = false;
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
.card {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: transparent;
  width: 15rem;
  height: fit-content;
  float: left;
  padding: auto;
  margin: 20px auto auto auto;
}

.card-body {
  width: 15rem;
}

h4 {
  font-size: 14px;
  font-weight: bold;
  font-family: "Lucida Bright";
}

img {
  height: 10rem;
  width: 15rem;
}
</style>
