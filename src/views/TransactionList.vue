<template>
  <b-overlay :show="show" rounded="sm">
    <div class="content">
      <b-row>
        <b-col sm="2">
          <h5>
            <b-icon icon="reception4"></b-icon>
            TRANSACTION LIST
          </h5>
        </b-col>
        <b-col sm="2">
          <label for="select-filter"> Select type filter</label>
          <select
            id="select-filter"
            class="form-select"
            v-model="criteria"
            @change="filerTransaction"
          >
            <option selected value="">Please select filter</option>
            <option value="All">All</option>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
          </select>
        </b-col>
        <b-col style="width: fit-content">
          <label for="input-filter"> Tranasction Date</label>
          <input
            id="input-filter"
            class="form-control input-sm"
            type="date"
            style="width: 300px"
            aria-label="Search"
            @change="searchTransactionByDate"
            v-model="criteriaSearchDate"
          />
        </b-col>
        <b-col>
          <b-form-group>
            <label for="input-filter"> Tranasction Id</label>
            <b-input
              type="text"
              placeholder="Transaction ID: 12345..."
              v-model="criteriaTranactionId"
              size="sm"
              style="width: 300px"
              @input="searchTransactionById()"
              maxlength="14"
            ></b-input>
          </b-form-group>
        </b-col>
      </b-row>
      <hr class="my-4" />
      <div class="sum-transaction">
        <div class="left-rigt-10">
          <strong>Total transactions: </strong>
          <b-icon icon="bullseye" variant="danger"></b-icon>
          {{ transactionInfo.totalTransaction }}
        </div>
        <div class="left-rigt-10">
          <strong>Total cash options: </strong>
          <b-icon icon="wallet-fill" variant="success"></b-icon>
          {{ transactionInfo.totalCashOption }}
        </div>
        <div class="left-rigt-10">
          <strong>Total card options: </strong>
          <b-icon icon="credit-card2-front-fill"></b-icon>
          {{ transactionInfo.totalCardOption }}
        </div>
        <div class="left-rigt-10">
          <strong>Total Bank Transfer: </strong>
          <b-icon icon="arrow-left-right"></b-icon>
          {{ transactionInfo.totalBankTransfer }}
        </div>
        <div class="left-rigt-10">
          <strong>Total E.Wallet options: </strong>
          <b-icon icon="upc-scan"></b-icon>
          {{ transactionInfo.totalEWalletOption }}
        </div>
        <div class="left-rigt-10">
          <strong> Total sale:</strong>
          <b-icon
            font-scale="1"
            icon="server"
            animation="cylon-vertical"
            variant="primary"
          ></b-icon>
          {{ transactionInfo.totalSale }}đ
        </div>
      </div>
      <div class="region-transactions">
        <b-table
          head-variant="dark"
          id="my-table"
          responsive="sm"
          hover
          small
          striped
          sort-icon-left
          show-empty
          :items="transactionInfo.listTransaction"
          :fields="transactionInfo.fields"
          :per-page="perPage"
          :current-page="currentPage"
        >
          <template v-slot:cell(status)="data">
            <template v-if="data.value === 'RECIEVED'">
              <b-icon icon="check-circle-fill" font-scale="1" variant="success"></b-icon>
              Recieved
            </template>
            <template v-if="data.value === 'PENDING APPROVAL'">
              <b-icon
                icon="three-dots"
                animation="cylon"
                font-scale="1"
                variant="danger"
              ></b-icon>
              Pending Approval
            </template>
          </template>
          <template v-slot:cell(action)="data">
            <b-button
              size="sm"
              variant="warning"
              title="Mark as recevied tranasction"
              v-if="data.item.status == 'PENDING APPROVAL'"
              @click="approvaltransaction(data.item)"
            >
              <b-icon icon="bookmark-check-fill" font-scale="1" variant="light"></b-icon>
            </b-button>
            <b-button
              v-if="data.item.status == 'RECIEVED'"
              size="sm"
              @click="showDetailTranasction(data.item)"
              class="mr-1"
              title="Show detail this transaction"
              variant="primary"
              v-b-modal.modal-receipt
            >
              <b-icon size="sm" icon="receipt-cutoff" font-scale="1"></b-icon>
            </b-button>
          </template>
        </b-table>
        <div class="form-inline">
          <div class="col-sm-1">
            <strong>Current Page: {{ currentPage }}</strong>
          </div>
          <div class="form-group col-sm-4">
            <select
              class="form-select input-sm"
              style="width: 100px; margin-right: 10px"
              v-model="perPage"
              id="select-rows-page"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option selected value="100">100</option>
            </select>
            <label for="select-rows-page">{{ perPage }} rows/ page</label>
          </div>
        </div>
        <hr class="my-4" />
        <div class="row" style="margin-left: 10px">
          <div class="column">
            <b-pagination
              size="md"
              pills
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>
          </div>
        </div>
      </div>

      <!-- Modal tranaction detail-->
      <b-modal
        id="modal-receipt"
        scrollable
        title="Transaction Detail Content"
        header-bg-variant="dark"
        header-text-variant="light"
        ok-title-html="Print"
        :hide-header-close="true"
        cancel-variant="outline-secondary"
        @ok="printReceipt()"
        no-close-on-backdrop
      >
        <b-row style="text-align: center">
          <img
            style="
              height: 85px;
              display: block;
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 10px;
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
              {{ transactionDetail.info.transactionId }}
            </h5>
          </b-col>
        </b-row>
        <hr class="my-4" />
        <!--Field table id-->
        <b-row>
          <b-col><strong>Table: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.tableId }}</i></b-col
          >
        </b-row>
        <!--Feild order id-->
        <b-row>
          <b-col><strong>Order Id: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.orderId }}</i></b-col
          >
        </b-row>
        <hr class="my-2" />
        <b-table
          :items="transactionDetail.listOrdered"
          :fields="transactionDetail.fields"
          style="font-size: 13px"
          head-variant="dark"
          id="my-table-transaction-detail"
          responsive="sm"
          small
          bordered="true"
        ></b-table>
        <!--Field total price tranaction-->
        <div style="text-align: right">
          <strong>Total Price: </strong><i>{{ transactionDetail.info.totalPrice }}(đ)</i>
        </div>
        <div style="text-align: right">
          <strong>Discount Type: </strong
          ><i>{{ transactionDetail.info.discountType }}(đ)</i>
        </div>
        <div style="text-align: right">
          <strong>Discount Price: </strong
          ><i>{{ transactionDetail.info.discountValue }}(đ)</i>
        </div>
        <div style="text-align: right">
          <strong>Actual Payment Amount: </strong
          ><i>{{ transactionDetail.info.actualPaymentAmount }}(đ)</i>
        </div>
        <div style="text-align: right">
          <strong>Actual Retreived Amount: </strong
          ><i>{{ transactionDetail.info.actualRetreived }}(đ)</i>
        </div>
        <div style="text-align: right">
          <strong>Refund Amount: </strong
          ><i>{{ transactionDetail.info.refundAmount }}(đ)</i>
        </div>
        <hr class="my-4" />
        <!--Feild payment type-->
        <b-row>
          <b-col><strong>Payment type: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.paymentType }}</i></b-col
          >
        </b-row>
        <!--Feild bank name-->
        <b-row v-if="transactionDetail.info.bankName != '(Not apply)'">
          <b-col><strong>Bank Name: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.bankName }}</i></b-col
          >
        </b-row>
        <!--Feild bank acoount number-->
        <b-row v-if="transactionDetail.info.bankAccountNumber != '(Not apply)'">
          <b-col><strong>Bank Account Number: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.bankAccountNumber }}</i></b-col
          >
        </b-row>
        <!--Feild bank holer name-->
        <b-row v-if="transactionDetail.info.bankHolderName != '(Not apply)'">
          <b-col><strong>Bank Holder Name: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.bankHolderName }}</i></b-col
          >
        </b-row>

        <!--Field card number-->
        <b-row v-if="transactionDetail.info.cardNumber != '(Not apply)'">
          <b-col><strong>Card Number: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.cardNumber }}</i></b-col
          >
        </b-row>

        <!-- Field card type-->
        <b-row v-if="transactionDetail.info.cardType != '(Not apply)'">
          <b-col><strong>Card Type: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.cardType }}</i></b-col
          >
        </b-row>

        <!-- Field expire date card-->
        <b-row v-if="transactionDetail.info.expireDate != '(Not apply)'">
          <b-col><strong>Expire Date: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.expireDate }}</i></b-col
          >
        </b-row>

        <!-- Field cvv number-->
        <b-row v-if="transactionDetail.info.cvv != '(Not apply)'">
          <b-col><strong>Cvv: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.cvv }}</i></b-col
          >
        </b-row>

        <!--Field provide name for electronic wallet-->
        <b-row v-if="transactionDetail.info.providerName != '(Not apply)'">
          <b-col><strong>Provider Name: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.providerName }}</i></b-col
          >
        </b-row>

        <!--Feild tranaction code for electronic walllet-->
        <b-row v-if="transactionDetail.info.transactionCode != '(Not apply)'">
          <b-col><strong>Transaction Code: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.transactionCode }}</i></b-col
          >
        </b-row>

        <b-row>
          <b-col><strong>Email customer: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.emailCustomer }}</i></b-col
          >
        </b-row>

        <!--Field create by-->
        <b-row>
          <b-col><strong>Create By: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.createBy }}</i></b-col
          >
        </b-row>

        <!--Field create date-->
        <b-row>
          <b-col><strong>Create Date: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.createDate }}</i></b-col
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
          <h5 style="font-size: 14px">Invoice does not include value added tax 8-10%</h5>
        </b-row>
      </b-modal>
    </div>
  </b-overlay>
</template>

<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      criteria: "",
      criteriaSearchDate: "",
      criteriaTranactionId: "",
      sortBy: "createDate",
      sortDesc: true,
      perPage: 100,
      currentPage: 1,
      show: false,
      transactionInfo: {
        fields: [
          { key: "transactionId", sortable: true },
          { key: "orderId", sortable: true },
          { key: "tableId", sortable: true },
          { key: "paymentType", sortable: true },
          { key: "status", sortable: true },
          { key: "bankName", sortable: true },
          { key: "cardNumber", sortable: true },
          { key: "bankAccountNumber", sortable: true },
          { key: "providerName", sortable: true },
          { key: "totalPrice", sortable: true },
          { key: "emailCustomer", sortable: true },
          { key: "createBy", sortable: true },
          { key: "createDate", sortable: true },
          { key: "action" },
        ],
        listTransaction: [],
        totalSale: "",
        totalTransaction: "",
        totalCashOption: "",
        totalCardOption: "",
        totalBankTransfer: "",
        totalEWalletOption: "",
      },
      transactionDetail: {
        fields: ["productName", "quantity", "price"],
        info: {
          transactionId: null,
          orderId: null,
          tableId: null,
          paymentType: null,
          bankName: null,
          bankAccountNubmer: null,
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
        },
        listOrdered: [],
      },
    };
  },
  mounted() {
    this.checkLocalStorage();
    this.getTransactions();
  },
  computed: {
    rows() {
      return this.transactionInfo.listTransaction.length;
    },
  },
  methods: {
    // check local storage
    checkLocalStorage() {
      var data = JSON.parse(localStorage.getItem("user"));
      if (data == null) {
        this.$swal({
          toast: true,
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

    // get all transation
    getTransactions() {
      this.show = true;
      http
        .get("/transaction/api/get-transactions/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.transactionInfo.listTransaction = response.data.listTransactions;
            this.transactionInfo.totalSale = response.data.totalPrice;
            this.transactionInfo.totalTransaction = response.data.totalTransaction;
            this.transactionInfo.totalCashOption =
              response.data.sumPaymentType.countCashOption;
            this.transactionInfo.totalCardOption =
              response.data.sumPaymentType.countCardOption;
            this.transactionInfo.totalEWalletOption =
              response.data.sumPaymentType.electronicWalletOption;
            this.transactionInfo.totalBankTransfer =
              response.data.sumPaymentType.countBankTransfer;
            this.show = false;
          } else if (response.status == "401") {
            this.$swal({
              toast: true,
              position: "top-end",
              title: "You do not have permission",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            this.show = false;
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
          this.show = false;
        });
    },

    // search transation by id
    searchTransactionById() {
      this.show = true;
      if (this.criteriaTranactionId) {
        http
          .get(
            "/transaction/api/search-transaction/" +
              this.accountUserValid +
              "/" +
              this.criteriaTranactionId
          )
          .then((response) => {
            if (response.status == "200") {
              this.transactionInfo.listTransaction = response.data.listTransactions;
              this.show = false;
            } else if (response.status == "401") {
              this.$swal({
                toast: true,
                position: "top-end",
                title: "You do not have permission",
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
              this.show = false;
            }
          })
          .catch((error) => {
            this.$swal({
              toast: true,
              position: "top-end",
              title: error,
              icon: "error",
              showConfirmButton: false,
              timer: 3500,
            });
            this.show = false;
          });
      } else {
        this.filerTransaction();
      }
    },

    // search transactions depend on time
    filerTransaction() {
      var criteria = this.criteria;
      this.show = true;
      if (criteria) {
        http
          .post(
            "/transaction/api/search-transactions/" +
              this.accountUserValid +
              "/" +
              criteria
          )
          .then((response) => {
            if (response.status == "200") {
              if (response.data.listTransactions.size == 0) {
                this.$swal({
                  toast: true,
                  position: "top-end",
                  title: "Not found any transaction",
                  icon: "info",
                  showConfirmButton: false,
                  timer: 2100,
                });
              } else {
                this.transactionInfo.listTransaction = response.data.listTransactions;
                this.transactionInfo.totalSale = response.data.totalPrice;
                this.transactionInfo.totalTransaction = response.data.totalTransaction;
                this.transactionInfo.totalCashOption =
                  response.data.sumPaymentType.countCashOption;
                this.transactionInfo.totalCardOption =
                  response.data.sumPaymentType.countCardOption;
                this.transactionInfo.totalEWalletOption =
                  response.data.sumPaymentType.electronicWalletOption;
                this.transactionInfo.totalBankTransfer =
                  response.data.sumPaymentType.countBankTransfer;
                this.show = false;
              }
            } else {
              this.$swal({
                toast: true,
                position: "top-end",
                title: "Some thing went wrong !!!",
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
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
            this.show = false;
            this.listTransaction = [];
            this.totalSale = 0;
          });
      } else {
        this.show = false;
        this.listTransaction = [];
        this.totalSale = 0;
      }
    },

    // search transaction by a date
    searchTransactionByDate() {
      var date = this.criteriaSearchDate;
      this.show = true;
      http
        .post(
          "/transaction/api/search-transactions-by-date/" +
            this.accountUserValid +
            "/" +
            date
        )
        .then((response) => {
          if (response.status == "200") {
            if (response.data.listTransactions.size == 0) {
              this.$swal({
                toast: true,
                position: "top-end",
                title: "Not found any transaction",
                icon: "info",
                showConfirmButton: false,
                timer: 2100,
              });
            } else {
              this.transactionInfo.listTransaction = response.data.listTransactions;
              this.transactionInfo.totalSale = response.data.totalPrice;
              this.transactionInfo.totalTransaction = response.data.totalTransaction;
              this.transactionInfo.totalCashOption =
                response.data.sumPaymentType.countCashOption;
              this.transactionInfo.totalCardOption =
                response.data.sumPaymentType.countCardOption;
              this.transactionInfo.totalEWalletOption =
                response.data.sumPaymentType.electronicWalletOption;
              this.transactionInfo.totalBankTransfer =
                response.data.sumPaymentType.countBankTransfer;
              this.show = false;
            }
          } else {
            this.$swal({
              toast: true,
              position: "top-end",
              title: "Some thing went wrong !!!",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            this.show = false;
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
          this.show = false;
          this.listTransaction = [];
          this.totalSale = 0;
        });
    },

    // show detail tranaction
    showDetailTranasction(object) {
      this.show = true;
      var request = {
        transactionId: object.transactionId,
        orderId: object.orderId,
        tableId: object.tableId,
      };
      http
        .post("/transaction/api/get-transaction-detail/" + this.accountUserValid, request)
        .then((response) => {
          if (response.status == "200") {
            this.transactionDetail.info = response.data.transactionDetail;
            this.transactionDetail.listOrdered = response.data.listOrdered;
            this.show = false;
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
          this.show = false;
        });
    },

    // show detail tranaction
    approvaltransaction(object) {
      this.show = true;
      var transactionId = object.transactionId;
      http
        .post(
          "/transaction/api/approval-transaction/" +
            this.accountUserValid +
            "/" +
            transactionId
        )
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Transaction "
                .concat(transactionId)
                .concat(" has been approved successfully"),
              icon: "success",
              showConfirmButton: false,
              timer: 5000,
            });
          }
          this.show = false;
          this.getTransactions();
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
          this.show = false;
        });
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
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.2.0/dist/select2-bootstrap-5-theme.rtl.min.css" />' +
        "</header>";
      var $modalBody = $("#modal-receipt").find(".modal-body")[0].innerHTML;
      var app = window.open("", "", "height=800px, width=600px");
      app.document.write('<html lang="eng">');
      app.document.write(header);
      app.document.write("<body>");
      app.document.write('<div class="container">' + $modalBody + "</div>");
      app.document.write("</body></html>");
      app.document.close();
      app.print();
    },
  },
};
</script>

<style lang="scss" scoped>
#input-filter,
#select-filter,
#button-search {
  height: 32px;
  font-size: 12px;
  font-weight: 1px;
}

h2 {
  color: green;
}

table {
  font-size: 13;
}

.region-transactions {
  font-size: 13px;
  height: 660px;
  padding: 20px;
}
.overflow-auto {
  font-size: 13px;
}
.b-table-sticky-header > .table,
.table-responsive > .table,
[class*="table-responsive-"] > .table {
  margin-bottom: 0;
  font-size: 13px;
}

.info-label {
  font-size: 10px !important;
  font-family: "Lucida Bright";
  font-weight: bolder;
}

.sum-transaction {
  display: inline-flex;
  padding: 10px;
  float: right;
  vertical-align: top;
  top: 0;
  height: 70px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 5px;
  border: 0.1px solid #e7e7e7;
  margin-bottom: 20px;
}

.left-rigt-10 {
  margin: 17px
}
</style>
