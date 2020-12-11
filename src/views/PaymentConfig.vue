<template>
  <div class="jumbotron">
    <b-tabs
      active-nav-item-class="font-weight-bold text-uppercase text-danger"
      active-tab-class="font-weight-bold text-success"
      content-class="mt-3"
    >
      <b-tab title="Bank" active><BankInfos></BankInfos></b-tab>
      <b-tab title="Electronic Wallet"><ElectronicWallet></ElectronicWallet></b-tab>
      <b-tab title="Card payment config"><p>I'm a disabled tab!</p></b-tab>
      <b-tab title="Payment config"><p>I'm a disabled tab!</p></b-tab>
    </b-tabs>
  </div>
</template>
<script>
import http from "../axios/http-common";
import BankInfos from "../components/BanksInfo.vue";
import ElectronicWallet from "../components/ElectronicWallet.vue";
export default {
  components: {
    BankInfos,
    ElectronicWallet,
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
<style lang="scss" scoped>
tab {
  font-size: 12px;
}
</style>
