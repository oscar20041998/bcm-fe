<template>
  <div
    class="modal fade bd-example-modal-lg"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
    aria-hidden="true"
    data-backdrop="static"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="title-form" class="modal-title">
            <b-icon icon="credit-card"></b-icon> INFORMATION PAYMENT DETAIL {{ table }}
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group row">
              <div class="col-sm-10">
                <b-form-group label="Select payment type">
                  <b-row>
                    <b-col>
                      <b-form-radio
                        v-model="paymentType"
                        name="some-radios"
                        value="Cash option"
                        @change="onClickCashOption()"
                        >Cash option</b-form-radio
                      >
                    </b-col>
                    <b-col>
                      <b-form-radio
                        v-model="paymentType"
                        name="some-radios"
                        value="Card option"
                        @change="onClickCardOption()"
                        >Card option</b-form-radio
                      >
                    </b-col>
                    <b-col>
                      <b-form-radio
                        v-model="paymentType"
                        name="some-radios"
                        value="Electronic Wallet"
                        @change="onclickEwalletOption()"
                        >Electronic Wallet</b-form-radio
                      >
                    </b-col>
                  </b-row>
                </b-form-group>
              </div>
            </div>

            <!---CARD OPTION DIV REGION--------------------------------------------------------------------------------------------------------------------------------------->
            <div id="cardOptionDiv" style="display: none">
              <hr class="my-4" />
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Select bank</label
                >
                <div class="col-sm-8">
                  <select class="form-control" id="selectCategory" v-model="bankName">
                    <option value="">No select</option>
                    <option
                      v-for="bank in listBanks"
                      :key="bank.bankCode"
                      :value="bank.bankName"
                      :label="bank.bankName"
                    ></option>
                  </select>
                </div>
              </div>
              <!-- Input card number -->
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Card number</label
                >
                <div class="col-sm-8">
                  <input
                    type="text "
                    class="form-control"
                    id="cashInput"
                    maxlength="19"
                    placeholder="Input card number"
                    v-model="cardNumber"
                    @keyup="formatCardNumber"
                  />
                </div>
              </div>
              <!-- Input card type -->
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Select card</label
                >
                <div class="col-sm-8">
                  <select class="form-control" id="selectCategory" v-model="cardType">
                    <option disabled value="">No select</option>
                    <option
                      v-for="card in listCards"
                      :key="card.id"
                      :value="card.cardType"
                      :label="card.cardName"
                    ></option>
                  </select>
                </div>
              </div>
              <!-- Input card owner name -->
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Owner name</label
                >
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control"
                    id="cashInput"
                    maxlength="16"
                    placeholder="Input owner name"
                    v-model="cardOwnerName"
                  />
                </div>
              </div>
              <!-- Input expire time -->
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">Expire</label>
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control"
                    id="inputExprie"
                    maxlength="5"
                    placeholder="MM/YY"
                    v-model="expireDate"
                  />
                </div>
              </div>
              <!-- Input cvv -->
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">CVV</label>
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control"
                    id="cashInput"
                    maxlength="4"
                    placeholder="Input cvv"
                    v-model="cvv"
                  />
                </div>
              </div>
            </div>

            <!---EWALETT DIV REGION--------------------------------------------------------------------------------------------------------------------------------------->
            <div id="eWalletDiv" style="display: none">
              <hr class="my-4" />
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Select wallet</label
                >
                <div class="col-sm-8">
                  <select class="form-control" id="selectEwallet" v-model="providerName">
                    <option value="">No select</option>
                    <option
                      v-for="wallet in listEwallet"
                      :key="wallet.id"
                      :value="wallet.walletName"
                      :label="wallet.walletName"
                    ></option>
                  </select>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Transaction code</label
                >
                <div class="col-sm-8">
                  <input
                    type="text"
                    class="form-control"
                    id="cashInput"
                    maxlength="4"
                    placeholder="Input transaction code"
                    v-model="transactionCode"
                  />
                </div>
              </div>
            </div>

            <hr class="my-4" />
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Total price</label
              >
              <div class="col-sm-8">
                <input
                  type="text"
                  class="form-control"
                  id="cashInput"
                  placeholder="Input cash"
                  v-model="totalPrice"
                  readonly
                />
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <b-button block variant="success" size="lg" @click="saveTransaction()"
            >ACCEPT PAYMENT</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      table: JSON.parse(localStorage.getItem("orderInfo")).tableName,
      totalPrice: JSON.parse(localStorage.getItem("orderInfo")).totalPrice,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      bankName: "",
      cardOwnerName: "",
      cardNumber: "",
      cardType: "",
      expireDate: "",
      cvv: "",
      paymentType: "",
      listBanks: [],
      listCards: [],
      listEwallet: [],
      providerName: "",
      transactionCode: "",
    };
  },

  mounted() {
    $("#cardOptionDiv").css("display", "none");
    $("#eWalletDiv").css("display", "none");
  },

  methods: {
    // click radio card otion
    onClickCardOption() {
      $("#cardOptionDiv").css("display", "block");
      $("#eWalletDiv").css("display", "none");
      http
        .get("/api/bank-info/get-list-bank-active/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.listBanks = response.data.banks;
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

      http
        .get("/api/card-type/get-list-card-active/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.listCards = response.data.cards;
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

    // click radio electronic wallet option
    onclickEwalletOption() {
      $("#eWalletDiv").css("display", "block");
      $("#cardOptionDiv").css("display", "none");
      http
        .get("/api/electronic-wallet/get-list-ewallet-active/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.listEwallet = response.data.wallets;
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

    // click radio cash option
    onClickCashOption() {
      $("#cardOptionDiv").css("display", "none");
      $("#eWalletDiv").css("display", "none");
    },

    // format card number
    formatCardNumber: function (event) {
      var str = $(event.currentTarget).val().replace(/\s/g, "");
      var numberChunk = str.match(/.{1,4}/g);
      this.cardNumber = numberChunk.join(" ");
      $(event.eventTarget).val(this.cardNumber);
    },

    saveTransaction() {
      var request = {
        totalPrice: JSON.parse(localStorage.getItem("orderInfo")).totalPrice,
        tableId: JSON.parse(localStorage.getItem("orderInfo")).tableName,
        paymentType: this.paymentType,
        bankInfoRequest: {
          bankName: this.bankName,
          cardNumber: this.cardNumber,
          cardOwnerName: this.cardOwnerName,
          cardType: this.cardType,
          expireDate: this.expireDate,
          cvv: this.cvv,
        },
        eWalletRequest: {
          providerName: this.providerName,
          transactionCode: this.transactionCode,
        },
        listOrder: JSON.parse(localStorage.getItem("orderInfo")).listOrder,
        createBy: JSON.parse(localStorage.getItem("user")).accountId,
      };
      http
        .post("/transaction/api/save-transaction/" + this.accountUserValid, request)
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Payment success !!!",
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
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
<style scoped></style>
