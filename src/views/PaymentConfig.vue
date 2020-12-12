<template>
  <div class="jumbotron">
    <b-tabs
      id="tab-payment-config"
      active-nav-item-class="font-weight-bold text-uppercase"
      active-tab-class="font-weight-bold text-success"
      content-class="mt-3"
    >
      <b-tab title="Bank" active><BankInfosComponent></BankInfosComponent></b-tab>
      <b-tab title="Electronic Wallet"
        ><ElectronicWalletComponent></ElectronicWalletComponent
      ></b-tab>
      <b-tab title="Card payment config"><CardTypeComponent></CardTypeComponent></b-tab>
    </b-tabs>
  </div>
</template>
<script>
import http from "../axios/http-common";
import BankInfosComponent from "../components/BanksInfo.vue";
import ElectronicWalletComponent from "../components/ElectronicWallet.vue";
import CardTypeComponent from "../components/Cartype.vue";
export default {
  components: {
    BankInfosComponent,
    ElectronicWalletComponent,
    CardTypeComponent,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
<style scoped>
.text-danger {
  color: #212529 !important;
}

.nav-tabs .nav-link.active {
  color: #495057 !important;
  background-color: #fff !important;
  border-color: #dee2e6 #dee2e6 #fff !important;
  border-top: 10px solid black !important;
}

.nav-tabs .nav-link {
  border: 1px solid transparent !important;
  border-top-left-radius: 0.25rem !important;
  border-top-right-radius: 0.25rem !important;
  color: gray !important;
}
</style>
