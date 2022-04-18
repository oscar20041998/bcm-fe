<template>
  <b-overlay :show="show" rounded="sm">
    <div class="content">
      <div class="container card-body payment-form">
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
                      value="Bank Transfer"
                      @change="onClickBankTransfer()"
                      >Bank Transfer</b-form-radio
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

          <div id="bankTransferDiv" style="display: none">
            <hr class="my-4" />
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Select bank</label>
              <div class="col-sm-5">
                <select
                  class="form-select"
                  id="selectBank"
                  v-model="bankName"
                  aria-label="Default select example"
                >
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

            <!-- Input bank account number -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Bank Account number</label>
              <div class="col-sm-5">
                <input
                  type="text "
                  class="form-control"
                  autocomplete="off"
                  id="bankAccountNumberInput"
                  maxlength="17"
                  placeholder="Input bank account number"
                  v-model="bankAccountNumber"
                  v-mask="'#################'"
                />
              </div>
            </div>
            <!-- Input bank account number -->
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Bank holder name</label>
              <div class="col-sm-5">
                <input
                  type="text "
                  autocomplete="off"
                  class="form-control"
                  id="bankAccountHolderInput"
                  style="text-transform: uppercase"
                  maxlength="50"
                  placeholder="NGUYEN VAN A"
                  v-model="bankHolderName"
                />
              </div>
            </div>
          </div>

          <!---CARD OPTION DIV REGION--------------------------------------------------------------------------------------------------------------------------------------->
          <div id="cardOptionDiv" style="display: none">
            <hr class="my-4" />
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Select bank</label
              >
              <div class="col-sm-5">
                <select class="form-select" id="selectCategory" v-model="bankName">
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
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Card number</label
              >
              <div class="col-sm-5">
                <input
                  type="text "
                  class="form-control"
                  id="cashInput"
                  maxlength="19"
                  autocomplete="off"
                  placeholder="Input card number"
                  v-model="cardNumber"
                  v-mask="'#### #### #### ####'"
                />
              </div>
            </div>
            <!-- Input card type -->
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Select card</label
              >
              <div class="col-sm-5">
                <select
                  class="form-select form-control input-sm"
                  id="selectCategory"
                  v-model="cardType"
                >
                  <option :selected="true">Select card</option>
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
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control"
                  id="cashInput"
                  autocomplete="off"
                  maxlength="100"
                  placeholder="NGUYEN VAN A"
                  style="text-transform: uppercase"
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
                  autocomplete="off"
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
                  autocomplete="off"
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
                <select class="form-select" id="selectEwallet" v-model="providerName">
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
                  autocomplete="off"
                  maxlength="20"
                  placeholder="Input transaction code"
                  v-model="transactionCode"
                />
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label"
              >Email customer</label
            >
            <div class="col-sm-5">
              <input
                type="email"
                class="form-control"
                id="emailCustomerInput"
                autocomplete="off"
                maxlength="1000"
                placeholder="example@gmail.com"
                v-model="emailCustomer"
              />
            </div>
          </div>
          <hr class="my-4" />
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Total amount</label>
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
          <template v-if="isExistDiscount">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Discount type</label>
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control"
                  id="totalPriceInput"
                  v-model="discountType"
                  readonly
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Discounted amount</label
              >
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control"
                  id="totalPriceInput"
                  v-model="discountPrice"
                  readonly
                />
              </div>
            </div>
          </template>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label"
              >Actual payment amount</label
            >
            <div class="col-sm-5">
              <input
                type="text"
                class="form-control actual-payment-input"
                id="totalPriceInput"
                v-model="actualPaymentAmount"
                readonly
              />
            </div>
          </div>
          <template v-if="paymentType == 'Cash option'">
            <hr class="my-4" />
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Actual retreived</label
              >
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control"
                  id="totalPriceInput"
                  @input="triggerRetreivedAmount(actualRetreived)"
                  placeholder="Please input actual retreived amount"
                  v-model="actualRetreived"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label"
                >Refund amount</label
              >
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control refund-amount-input"
                  id="totalPriceInput"
                  v-model="refundAmount"
                  readonly
                />
              </div>
            </div>
          </template>
          <hr class="my-4" />
          <b-row>
            <b-col>
              <b-button
                squared
                block
                variant="success"
                size="lg"
                @click="saveTransaction()"
                v-b-modal.modal-scrollable
                >ACCEPT PAYMENT</b-button
              ></b-col
            >
            <b-col>
              <b-button
                squared
                block
                variant="secondary"
                size="lg"
                @click="backToOrderProduct()"
                >CANCEL</b-button
              >
            </b-col>
          </b-row>
        </form>
        <b-modal
          id="modal-receipt"
          scrollable
          v-model="showModal"
          title="Transaction Detail Content"
          header-bg-variant="dark"
          header-text-variant="light"
          ok-title-html="Print"
          :hide-header-close="true"
          cancel-variant="outline-secondary"
          @ok="printReceipt()"
          @cancel="handleCancel()"
          no-close-on-backdrop
          ><b-row style="text-align: center">
            <img
              style="
                height: 85px;
                display: block;
                margin-left: auto;
                margin-right: auto;
                margi-bottom: 10px;
                width: 20%;
              "
              src="../assets/coffeecup.png"
            />
            <label class="info-label">Demo Coffee Shop Name</label>
            <label class="info-label"
              >123 Nguyen Tri Phuong street, ward 04 district 10, HCM city</label
            >
          </b-row>
          <!--Field transaction id-->
          <b-row>
            <b-col style="text-align: end"><strong>Transaction Id: </strong></b-col>
            <b-col
              ><h5 style="border: 1px solid; border-radius: 5px">
                {{ responseTransaction.info.transactionId }}
              </h5>
            </b-col>
          </b-row>
          <hr class="my-4" />
          <!--Field table id-->
          <b-row>
            <b-col><strong>Table: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.tableId }}</i>
            </b-col>
          </b-row>
          <!--Feild order id-->
          <b-row>
            <b-col><strong>Order Id: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.orderId }}</i></b-col
            >
          </b-row>
          <hr class="my-4" />
          <b-table
            :items="responseTransaction.listOrdered"
            :fields="responseTransaction.fields"
            head-variant="dark"
            id="my-table-transaction-detail"
            responsive="sm"
            bordered
            small
            style="font-size: 13px"
          ></b-table>
          <!--Field total price tranaction-->
          <div style="text-align: right">
            <strong>Total Price: </strong
            ><i>{{ responseTransaction.info.totalPrice }}(đ)</i>
          </div>
          <div style="text-align: right">
            <strong>Discount Type: </strong
            ><i>{{ responseTransaction.info.discountType }}(đ)</i>
          </div>
          <div style="text-align: right">
            <strong>Discount Price: </strong
            ><i>{{ responseTransaction.info.discountValue }}(đ)</i>
          </div>
          <div style="text-align: right">
            <strong>Actual Payment Amount: </strong
            ><i>{{ responseTransaction.info.actualPaymentAmount }}(đ)</i>
          </div>
          <div style="text-align: right">
            <strong>Actual Retreived Amount: </strong
            ><i>{{ responseTransaction.info.actualRetreived }}(đ)</i>
          </div>
          <div style="text-align: right">
            <strong>Refund Amount: </strong
            ><i>{{ responseTransaction.info.refundAmount }}(đ)</i>
          </div>
          <hr class="my-4" />
          <!--Feild payment type-->
          <b-row>
            <b-col><strong>Payment type: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.paymentType }}</i></b-col
            >
          </b-row>
          <!--Feild bank name-->
          <b-row v-if="responseTransaction.info.bankName != null">
            <b-col><strong>Bank Name: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.bankName }}</i></b-col
            >
          </b-row>
          <!--Feild bank acoount number-->
          <b-row v-if="responseTransaction.info.bankAccountNumber != null">
            <b-col><strong>Bank Account Number: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.bankAccountNumber }}</i></b-col
            >
          </b-row>
          <!--Feild bank holer name-->
          <b-row v-if="responseTransaction.info.bankHolderName != null">
            <b-col><strong>Bank Holder Name: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.bankHolderName }}</i></b-col
            >
          </b-row>

          <!--Field card number-->
          <b-row v-if="responseTransaction.info.cardNumber != null">
            <b-col><strong>Card Number: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.cardNumber }}</i></b-col
            >
          </b-row>

          <!-- Field card type-->
          <b-row v-if="responseTransaction.info.cardType != null">
            <b-col><strong>Card Type: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.cardType }}</i></b-col
            >
          </b-row>

          <!-- Field expire date card-->
          <b-row
            v-if="
              responseTransaction.info.expireDate != null &&
              responseTransaction.info.expireDate != ''
            "
          >
            <b-col><strong>Expire Date: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.expireDate }}</i></b-col
            >
          </b-row>

          <!-- Field cvv number-->
          <b-row
            v-if="
              responseTransaction.info.cvv != null && responseTransaction.info.cvv != ''
            "
          >
            <b-col><strong>Cvv: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.cvv }}</i></b-col
            >
          </b-row>

          <!--Field provide name for electronic wallet-->
          <b-row v-if="responseTransaction.info.providerName != null">
            <b-col><strong>Provider Name: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.providerName }}</i></b-col
            >
          </b-row>

          <!--Feild tranaction code for electronic walllet-->
          <b-row v-if="responseTransaction.info.transactionCode != null">
            <b-col><strong>Transaction Code: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.transactionCode }}</i></b-col
            >
          </b-row>

          <b-row v-if="responseTransaction.info.emailCustomer != null">
            <b-col><strong>Email customer: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.emailCustomer }}</i></b-col
            >
          </b-row>

          <!--Field create by-->
          <b-row>
            <b-col><strong>Create By: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.createBy }}</i></b-col
            >
          </b-row>

          <!--Field create date-->
          <b-row>
            <b-col><strong>Create Date: </strong></b-col>
            <b-col
              ><i>{{ responseTransaction.info.createDate }}</i></b-col
            >
          </b-row>
          <hr class="my-4" />
          <b-row
            class="container"
            style="text-align: center; color: black; padding: 5px; bottom: 0"
          >
            <h5 style="font-size: 14px">See you on the next time</h5>
            <h5 style="font-size: 14px">Thanks you very much !!!</h5>
            <h5 style="font-size: 14px">
              Connect to bussiness web application: Mr.Duy 0382763906
            </h5>
            <h5 style="font-size: 14px">
              Invoice does not include value added tax 8-10%
            </h5>
          </b-row>
        </b-modal>
      </div>
    </div>
  </b-overlay>
</template>
<script>
import http from "../axios/http-common";
import moment from "moment";
export default {
  data() {
    return {
      showModal: false,
      table: JSON.parse(localStorage.getItem("table")).positionId,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      userName: "",
      bankName: "",
      bankAccountNumber: "",
      bankHolderName: "",
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
      emailCustomer: "",
      totalPrice: JSON.parse(localStorage.getItem("orderInfo")).totalPrice,
      discountType: "",
      discountPrice: "",
      actualPaymentAmount: "",
      actualRetreived: "",
      refundAmount: "",
      show: false,
      isExistDiscount: false,
      responseTransaction: {
        fields: ["productName", "quantity", { key: "priceConvert", label: "Price" }],
        info: {
          transactionId: null,
          orderId: null,
          tableId: null,
          paymentType: null,
          bankName: null,
          bankAccountNumber: null,
          bankHolderName: null,
          cardNumber: null,
          cardType: null,
          expireDate: null,
          cvv: null,
          providerName: null,
          transactionCode: null,
          emailCustomer: null,
          createBy: null,
          createDate: null,
          totalPrice: null,
          discountType: null,
          discountValue: null,
          actualPaymentAmount: null,
          actualRetreived: null,
          refundAmount: null,
        },
        listOrdered: [],
      },
    };
  },

  mounted() {
    $("#cardOptionDiv").css("display", "none");
    $("#eWalletDiv").css("display", "none");
    $("#bankTransferDiv").css("display", "none");
    this.getTotalPrice();
  },

  methods: {
    getTotalPrice() {
      var totalPrice = JSON.parse(localStorage.getItem("orderInfo")).totalPrice;
      var discountObject = JSON.parse(localStorage.getItem("discount")) || null;
      var acctualPayment = "";
      if (discountObject) {
        this.isExistDiscount = true;
        var _totalPrice = parseInt(totalPrice.replace(",", ""));
        var _discountPrice = parseInt(discountObject.totalDiscountPrice.replace(",", ""));
        acctualPayment = parseInt(_totalPrice - _discountPrice);
        this.discountType = discountObject.discountType;
        this.discountPrice = this.formatPriceToString(_discountPrice);
        this.actualPaymentAmount = this.formatPriceToString(acctualPayment);
      } else {
        this.actualPaymentAmount = this.totalPrice;
      }
    },

    formatPriceToString(value) {
      return new String(value).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    triggerRetreivedAmount(value) {
      this.actualRetreived = new String(value)
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.calculateRefundAmount(value);
    },

    calculateRefundAmount(value) {
      var acctualPayment = parseInt(this.actualPaymentAmount.replace(",", ""));
      var acctualRetreived = parseInt(value.replace(",", ""));
      var refund = acctualPayment - acctualRetreived;
      this.refundAmount = this.formatPriceToString(refund);
    },

    // click radio card otion
    onClickCardOption() {
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
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
        });
      $("#cardOptionDiv").css("display", "block");
      $("#cardOptionDiv").find("select").val("");
      $("#eWalletDiv").css("display", "none");
      $("#bankTransferDiv").css("display", "none");
      this.clearData();
    },

    // click radio electronic wallet option
    onclickEwalletOption() {
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
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
        });
      $("#eWalletDiv").css("display", "block");
      $("#cardOptionDiv").css("display", "none");
      $("#bankTransferDiv").css("display", "none");
      this.clearData();
    },

    // click radio cash option
    onClickCashOption() {
      $("#cardOptionDiv").css("display", "none");
      $("#eWalletDiv").css("display", "none");
      $("#bankTransferDiv").css("display", "none");
      this.clearData();
    },

    onClickBankTransfer() {
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
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
        });
      $("#cardOptionDiv").css("display", "none");
      $("#eWalletDiv").css("display", "none");
      $("#bankTransferDiv").css("display", "block");
      this.clearData();
    },

    // save tranaction
    saveTransaction() {
      this.show = true;
      var request = {
        totalPrice: JSON.parse(localStorage.getItem("orderInfo")).totalPrice,
        discountType: this.discountType || null,
        discountValue: this.discountPrice,
        actualPaymentAmount: this.actualPaymentAmount,
        actualRetreived: this.actualRetreived || 0,
        refundAmount: this.refundAmount,
        tableId: JSON.parse(localStorage.getItem("orderInfo")).tableName,
        transactionId: "",
        orderId: "",
        paymentType: this.paymentType,
        bankInfoRequest: {
          bankName: this.bankName,
          bankAccountNumber: this.bankAccountNumber,
          bankHolderName: this.bankHolderName,
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
        customerEmail: this.emailCustomer,
        userId: JSON.parse(localStorage.getItem("user")).userId,
        createBy: JSON.parse(localStorage.getItem("user")).userName,
      };
      var isValid = this.valdiateBeforeSaveTransaction(request);
      if (isValid) {
        this.executeSaveTransaction(request);
      } else {
        this.$swal({
          toast: true,
          position: "top-end",
          title: "Missing information to save the transaction",
          icon: "info",
          showConfirmButton: false,
          timer: 3000,
        });
        this.show = false;
      }
    },

    clearData() {
      (this.bankName = null),
        (this.bankAccountNumber = null),
        (this.bankHolderName = null),
        (this.cardNumber = null),
        (this.cardOwnerName = null),
        (this.cardType = null),
        (this.providerName = null),
        (this.transactionCode = null),
        (this.emailCustomer = null);
    },

    // validate before save the transaction
    valdiateBeforeSaveTransaction(object) {
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
          return (object.actualRetreived != null && object.actualRetreived != '');
        } else if (object.paymentType == "Bank Transfer") {
          return (
            object.bankInfoRequest.bankName != null &&
            object.bankInfoRequest.bankName != "" &&
            object.bankInfoRequest.bankAccountNumber != null &&
            object.bankInfoRequest.bankAccountNumber != "" &&
            object.bankInfoRequest.bankHolderName != null &&
            object.bankInfoRequest.bankHolderName != ""
          );
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    // execute save transaction
    executeSaveTransaction: function (request) {
      this.show = true;
      http
        .post(
          "/transaction/api/save-transaction/" +
            JSON.parse(localStorage.getItem("user")).accountId,
          request
        )
        .then((response) => {
          if (response.status == "200") {
            //this.$router.push({ name: "Position" });
            this.clearData();
            this.show = false;
            this.responseTransaction.info.orderId = response.data.orderId;
            this.responseTransaction.info.tableId = response.data.tableId;
            this.responseTransaction.info.transactionId = response.data.transactionId;
            this.responseTransaction.info.paymentType = response.data.paymentType;
            this.responseTransaction.info.bankName =
              response.data.bankInfoRequest.bankName;
            this.responseTransaction.info.bankAccountNumber =
              response.data.bankInfoRequest.bankAccountNumber;
            this.responseTransaction.info.bankHolderName =
              response.data.bankInfoRequest.bankHolderName;
            this.responseTransaction.info.cardNumber =
              response.data.bankInfoRequest.cardNumber;
            this.responseTransaction.info.cardType =
              response.data.bankInfoRequest.cardType;
            this.responseTransaction.info.cardOwnerName =
              response.data.bankInfoRequest.cardOwnerName;
            this.responseTransaction.info.cvv = response.data.bankInfoRequest.cvv;
            this.responseTransaction.info.expireDate =
              response.data.bankInfoRequest.expireDate;
            this.responseTransaction.info.providerName =
              response.data.eWalletRequest.providerName;
            this.responseTransaction.info.transactionCode =
              response.data.eWalletRequest.transactionCode;
            this.responseTransaction.listOrdered = response.data.listOrder;
            this.responseTransaction.info.totalPrice = response.data.totalPrice;
            this.responseTransaction.info.discountType = response.data.discountType;
            this.responseTransaction.info.discountValue = response.data.discountValue;
            this.responseTransaction.info.actualPaymentAmount =
              response.data.actualPaymentAmount;
            this.responseTransaction.info.actualRetreived = response.data.actualRetreived;
            this.responseTransaction.info.refundAmount = response.data.refundAmount;
            this.responseTransaction.info.createBy = JSON.parse(
              localStorage.getItem("user")
            ).userName;
            this.responseTransaction.info.createDate = moment(String(new Date())).format(
              "DD/MM/YYYY HH:mm:ss"
            );
            this.$swal({
              toast: true,
              position: "top-end",
              title: "Payment success !!!",
              icon: "success",
              showConfirmButton: false,
              timer: 3500,
            });
            this.show = false;
            this.showModal = true;
          }
        })
        .catch((error) => {
          this.$swal({
            toast: true,
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
      localStorage.removeItem("discount");
    },

    printReceipt() {
      var header =
        '<meta charset="utf-8">' +
        '<meta http-equiv="X-UA-Compatible" content="IE=edge">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
        '<link rel="icon" href="<%= BASE_URL %>favicon.ico.png">' +
        '<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs4/dt-1.10.22/datatables.min.css" />' +
        "<title>" +
        "Print receipt" +
        "</title>" +
        '<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />' +
        '<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.min.css" />' +
        '<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />' +
        '<link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue-icons.min.css" />' +
        '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">' +
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />' +
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.2.0/dist/select2-bootstrap-5-theme.min.css" />' +
        '<link rel="stylesheet" media="screen" href="main.css" />' +
        '<link rel="stylesheet" media="print" href="print.css" />' +
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.2.0/dist/select2-bootstrap-5-theme.rtl.min.css" />' +
        "</header>";
      var $modalBody = $("#modal-receipt").find(".modal-body")[0].innerHTML;
      var app = window.open("", "", "height=1000px, width=600px");
      app.document.write('<html lang="eng">');
      app.document.write(header);
      app.document.write("<body>");
      app.document.write('<div class="container">' + $modalBody + "</div>");
      app.document.write("</body></html>");
      app.document.close();
      app.print();
      this.$router.push({ name: "Position" });
    },

    handleCancel() {
      this.$router.push({ name: "Position" });
      localStorage.removeItem("discount");
    },
  },
};
</script>
>

<style scoped>
.payment-form {
  border: 1px #abb1b7 solid;
  border-radius: 8px;
  box-shadow: 5px 12px #bbbb;
}

.info-label {
  font-size: 10px !important;
  font-family: "Lucida Bright";
  font-weight: bolder;
}

.actual-payment-input {
  color: green;
}

.refund-amount-input {
  color: red;
}
</style>
