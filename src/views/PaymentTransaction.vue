<template></template>

<script>
import http from "../axios/http-common";
export default {
  data() {
    return {};
  },

  mounted() {},
  // accept to payment
  acceptPayment() {
    var request = {
      tableId: this.paymentInfo.tableId,
      totalPrice: this.paymentInfo.totalPrice,
      paymentType: this.paymentInfo.paymentType,
      cardType: this.paymentInfo.cardType,
      cardNumber: this.paymentInfo.cardNumber,
      bankName: this.paymentInfo.bankName,
      createBy: JSON.parse(localStorage.getItem("user")).userName,
    };
    $("#div-loading-payment").css("display", "block");
    if (request.paymentType != "") {
      http
        .post("/transaction/api/save-transaction/" + this.accountUserValid, request)
        .then((response) => {
          if (response.status == "200") {
            $("#div-loading-payment").css("display", "none");
            $("#paymentModal").css("display", "none");
            $(".modal-backdrop").css("display", "none");
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Transaction success !!!",
              icon: "success",
              showConfirmButton: false,
              timer: 2100,
            });
            this.getPosition();
          }
        });
    } else {
      this.$swal({
        toast: true,
        showProgressBar: true,
        position: "top-end",
        title: "Missing info payment",
        icon: "error",
        showConfirmButton: false,
        timer: 2100,
      });
      $("#div-loading-payment").css("display", "none");
    }
  },
};
</script>
>

<style lang="sass"></style>
>
