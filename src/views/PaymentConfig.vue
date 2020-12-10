<template>
  <div class="jumbotron">
    <b-tabs
      active-nav-item-class="font-weight-bold text-uppercase text-danger"
      active-tab-class="font-weight-bold text-success"
      content-class="mt-3"
    >
      <b-tab title="Bank" active><p>I'm the first tab</p></b-tab>
      <b-tab title="Electronic Wallet"><p>I'm the second tab</p></b-tab>
      <b-tab title="Card payment config"><p>I'm a disabled tab!</p></b-tab>
      <b-tab title="Payment config"><p>I'm a disabled tab!</p></b-tab>
    </b-tabs>
  </div>
</template>
<script>
import http from "../axios/http-common";
export default {
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
<style lang="scss" scoped></style>
