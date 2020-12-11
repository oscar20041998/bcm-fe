<template>
  <div style="height: 600px; min-height: 10px; overflow-y: scroll">
    <table
      id="table-electronic-wallet"
      class="table table-striped table-responsive-sm"
      cellspacing="0"
      style="max-heigh: 100px"
    >
      <thead class="thead-dark">
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Wallet name</th>
          <th scope="col">Status</th>
          <th scope="col">Created by</th>
          <th scope="col">Created date</th>
        </tr>
      </thead>
      <tbody sytle="min-height:10px; overflow-y:scroll; font-size:12px">
        <tr v-for="b in listEwallet" v-bind:key="b.id">
          <th scope="row">
            {{ b.id }}
          </th>
          <td>{{ b.walletName }}</td>
          <td>{{ b.status }}</td>
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
      listEwallet: [],
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      currentUser: JSON.parse(localStorage.getItem("user")).userName,
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
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
