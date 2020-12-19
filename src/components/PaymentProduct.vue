<template>
  <div class="jumbotron">
    <div class="container card-body">
      <h5>
        <b-icon icon="credit-card" font-scale="1"></b-icon> INFORMATION PAYMENT DETAIL
        {{ table }}
      </h5>
      <hr class="my-4" />
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
                    value="Electronic wallet"
                    @change="onclickEwalletOption()"
                    >Electronic wallet</b-form-radio
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
            <label for="inputPassword" class="col-sm-3 col-form-label">Select bank</label>
            <div class="col-sm-5">
              <select class="form-control" id="selectCategory" v-model="bankName">
                <option disabled value="">No select</option>
                <option
                  v-for="bank in listBanks"
                  :key="bank.bankCode"
                  :value="bank.bankName"
                >
                  {{ bank.bankCode }} - {{ bank.bankName }}
                </option>
              </select>
            </div>
          </div>
          <!-- Input card number -->
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label">Card number</label>
            <div class="col-sm-5">
              <input
                type="text "
                class="form-control"
                id="cashInput"
                maxlength="19"
                placeholder="Input card number"
                v-model="cardNumber"
                v-mask="'#### #### #### ####'"
              />
            </div>
          </div>
          <!-- Input card type -->
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label">Select card</label>
            <div class="col-sm-5">
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
            <label for="inputPassword" class="col-sm-3 col-form-label">Owner name</label>
            <div class="col-sm-5">
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
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control"
                id="inputExprie"
                maxlength="5"
                placeholder="MM/YY"
                v-model="expireDate"
                v-mask="'##/##'"
              />
            </div>
          </div>
          <!-- Input cvv -->
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label">CVV</label>
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control"
                id="cashInput"
                maxlength="3"
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
            <div class="col-sm-5">
              <select class="form-control" id="selectEwallet" v-model="providerName">
                <option disabled value="">No select</option>
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
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control"
                id="transactionInput"
                maxlength="20"
                placeholder="Input transaction code"
                v-model="transactionCode"
              />
            </div>
          </div>
        </div>

        <hr class="my-4" />
        <div class="form-group row">
          <label for="inputPassword" class="col-sm-3 col-form-label">Total price</label>
          <div class="col-sm-5">
            <input
              type="text"
              class="form-control"
              id="totalPriceInput"
              v-model="totalPrice"
              readonly
            />
          </div>
        </div>
        <hr class="my-4" />
        <b-row>
          <b-col>
            <b-button block variant="success" size="lg" @click="saveTransaction()"
              >ACCEPT PAYMENT</b-button
            ></b-col
          >
          <b-col>
            <b-button block variant="secondary" size="lg" @click="backToOrderProduct()"
              >CANCEL</b-button
            >
          </b-col>
        </b-row>
      </form>
    </div>
  </div>
</template>
<script>
import http from "../axios/http-common";
export default {
  props: {
    totalPriceProp: String,
  },
  data() {
    return {
      table: JSON.parse(localStorage.getItem("table")).positionId,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      userName: "",
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
      totalPrice: JSON.parse(localStorage.getItem("orderInfo")).totalPrice,
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

    // save tranaction
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
        createBy: JSON.parse(localStorage.getItem("user")).userName,
      };
      var isValid = this.valdiateBeforeSaveTransaction(request);
      if (isValid) {
        this.executeSaveTransaction(request);
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing information to save the transaction",
          icon: "info",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },

    clearData() {
      (this.bankName = ""),
        (this.cardOwnerName = ""),
        (this.cardNumber = ""),
        (this.cardType = ""),
        (this.expireDate = ""),
        (this.cvv = ""),
        (this.paymentType = ""),
        (this.transactionCode = ""),
        (this.providerName = "");
    },

    // validate before save the transaction
    valdiateBeforeSaveTransaction: function (object) {
      if (object.paymentType != null && object.paymentType != "") {
        if (object.paymentType == "Card option") {
          return (
            object.bankInfoRequest.bankName != null &&
            object.bankInfoRequest.bankName != "" &&
            object.bankInfoRequest.cardNumber != null &&
            object.bankInfoRequest.cardNumber != "" &&
            object.bankInfoRequest.cardType != null &&
            object.bankInfoRequest.cardType != "" &&
            object.bankInfoRequest.expireDate != null &&
            object.bankInfoRequest.expireDate != "" &&
            object.bankInfoRequest.cvv != null &&
            object.bankInfoRequest.cvv != "" &&
            object.bankInfoRequest.cardOwnerName != null &&
            object.bankInfoRequest.cardOwnerName != ""
          );
        } else if (object.paymentType == "Electronic wallet") {
          return (
            object.eWalletRequest.providerName != null &&
            object.eWalletRequest.providerName != "" &&
            object.eWalletRequest.transactionCode != null &&
            object.eWalletRequest.transactionCode != ""
          );
        } else if (object.paymentType == "Cash option") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    // execute save transaction
    executeSaveTransaction: function (request) {
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
          $(".modal-dialog").hide();
          $(".modal-backdrop").remove();
          this.$router.push({ name: "Position" });
          this.clearData();
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

    backToOrderProduct() {
      this.$router.push({ name: "OrderProduct" });
    },
  },
};
</script>
<style scoped></style>
