<template>
  <div style="height: 600px; min-height: 10px; overflow-y: scroll">
    <table
      id="table-bank-info"
      class="table table-striped table-responsive-sm"
      cellspacing="0"
      style="max-heigh: 100px"
    >
      <thead class="thead-dark">
        <tr>
          <th scope="col">Card type</th>
          <th scope="col">Card name</th>
          <th scope="col">Status</th>
          <th scope="col">Created by</th>
          <th scope="col">Created date</th>
        </tr>
      </thead>
      <tbody sytle="min-height:10px; overflow-y:scroll">
        <tr v-for="c in listCardType" v-bind:key="c.bankCode">
          <td>{{ c.cardType }}</td>
          <td>{{ c.cardName }}</td>
          <td>
            <b-form-checkbox
              v-model="c.status"
              name="check-button"
              size="lg"
              switch
              @change="onChange(c, $event)"
            >
            </b-form-checkbox>
          </td>
          <td>{{ c.createBy }}</td>
          <td>
            <i>{{ c.createDate }}</i>
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
      listCardType: [],
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      currentUser: JSON.parse(localStorage.getItem("user")).userName,
      listItemChecked: [],
    };
  },
  mounted() {
    this.checkLocalStorage();
    this.getListCardType();
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

    // get list card type in fo
    getListCardType() {
      http
        .get("/api/card-type/get-list-card-type-info/" + this.accountUserValid)
        .then((response) => {
          this.listCardType = response.data.cards;
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
          text: "Disable the card " + "'" + object.cardName + "'",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, disable it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.disableCard(object.id);
          } else if (result.isDismissed) {
            this.getListCardType();
          }
        });
      } else {
        this.$swal({
          title: "Are you sure?",
          text: "Enable the card " + "'" + object.cardName + "'",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, enable it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.enableCard(object.id);
          } else if (result.isDismissed) {
            this.getListCardType();
          }
        });
      }
    },
    // disable electronic wallet
    disableCard(id) {
      http
        .post("/api/card-type/disable-card/" + this.accountUserValid + "/" + id)
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Disabled the card successfully !!!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Disabled the card failed !!!!",
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
    enableCard(id) {
      http
        .post("/api/card-type/enable-card/" + this.accountUserValid + "/" + id)
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Enabled the card successfully !!!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Enabled the card failed !!!!",
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

input[type="checkbox"] {
  cursor: help;
}
</style>
