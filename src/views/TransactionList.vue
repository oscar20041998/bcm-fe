<template>
  <b-overlay :show="show" rounded="sm">
    <div class="jumbotron">
      <b-row>
        <b-col sm="5">
          <h5>
            <b-icon icon="reception4"></b-icon>
            TRANSACTION LIST
          </h5>
        </b-col>
        <b-col sm="2">
          <select
            id="select-filter"
            class="form-control"
            v-model="criteria"
            @change="filerTransaction"
          >
            <option selected value="">Please select filter</option>
            <option value="All">All</option>
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
          </select>
        </b-col>
        <b-col sm="2">
          <input
            id="input-filter"
            class="form-control"
            type="date"
            placeholder="Search by card number/ create by"
            aria-label="Search"
            @change="searchTransactionByDate"
            v-model="criteriaSearchDate"
          />
        </b-col>
        <b-col sm="2">
          <b-form inline>
            <b-input
              type="text"
              placeholder="Transaction ID: 12345..."
              v-model="criteriaTranactionId"
              size="sm"
              maxlength="14"
            ></b-input>
          </b-form>
        </b-col>
        <b-col sm="1">
          <template
            v-if="criteriaTranactionId != '' && criteriaTranactionId.length == 14"
          >
            <b-button squared variant="success" size="md" @click="searchTransactionById()"
              >Search
            </b-button>
          </template>
        </b-col>
      </b-row>
      <hr class="my-4" />
      <div class="card-body">
        <div class="region-transactions">
          <b-table
            head-variant="dark"
            id="my-table"
            responsive="sm"
            sticky-header
            striped
            hover
            small
            sort-icon-left
            show-empty
            :items="transactionInfo.listTransaction"
            :fields="transactionInfo.fields"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <template v-slot:cell(action)="data">
              <b-button
                pill
                size="sm"
                @click="showDetailTranasction(data.item)"
                class="mr-1"
                title="Show detail this transaction"
                variant="dark"
                v-b-modal.modal-scrollable
              >
                <b-icon size="sm" icon="pencil" font-scale="1"></b-icon>
              </b-button>
            </template>
          </b-table>
          <strong class="mt-3">Current Page: {{ currentPage }}</strong>
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
          <div class="col-sm-3">
            <strong>Total transactions: </strong>
            <b-icon icon="bullseye" variant="danger"></b-icon>
            {{ transactionInfo.totalTransaction }}
          </div>
          <div class="col-sm-3">
            <strong>Total cash options: </strong>
            <b-icon icon="wallet-fill" variant="success"></b-icon>
            {{ transactionInfo.totalCashOption }}
          </div>
          <div class="col-sm-3">
            <strong>Total card options: </strong>
            <b-icon icon="credit-card2-front-fill"></b-icon>
            {{ transactionInfo.totalCardOption }}
          </div>
          <div class="col-sm-3">
            <strong>Total E.Wallet options: </strong>
            <b-icon icon="upc-scan"></b-icon>
            {{ transactionInfo.totalEWalletOption }}
          </div>
          <div class="col-sm-12" style="text-align: right">
            <h2>
              <b-icon
                icon="server"
                animation="cylon-vertical"
                variant="secondary"
              ></b-icon>
              Total sale: {{ transactionInfo.totalSale }}đ
            </h2>
          </div>
        </div>
      </div>

      <!-- Modal tranaction detail-->
      <b-modal
        id="modal-scrollable"
        scrollable
        title="Transaction Detail Content"
        no-close-on-backdrop
        hide-footer
      >
        <div class="overflow-auto">
          <b-table
            :items="transactionDetail.listOrdered"
            :fields="transactionDetail.fields"
            head-variant="dark"
            id="my-table-transaction-detail"
            responsive="sm"
            sticky-header
            striped
            hover
            small
          ></b-table>
        </div>
        <hr class="my-2" />
        <!--Field table id-->
        <b-row>
          <b-col><strong>Table: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.tableId }}</i></b-col
          >
        </b-row>
        <!--Field transaction id-->
        <b-row>
          <b-col><strong>Transaction Id: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.transactionId }}</i></b-col
          >
        </b-row>

        <!--Feild order id-->
        <b-row>
          <b-col><strong>Order Id: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.orderId }}</i></b-col
          >
        </b-row>

        <!--Feild payment type-->
        <b-row>
          <b-col><strong>Payment type: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.paymentType }}</i></b-col
          >
        </b-row>
        <!--Feild bank name-->
        <b-row>
          <b-col><strong>Bank Name: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.bankName }}</i></b-col
          >
        </b-row>

        <!--Field card number-->
        <b-row>
          <b-col><strong>Card Number: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.cardNumber }}</i></b-col
          >
        </b-row>

        <!-- Field card type-->
        <b-row>
          <b-col><strong>Card Type: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.cardType }}</i></b-col
          >
        </b-row>

        <!-- Field expire date card-->
        <b-row>
          <b-col><strong>Expire Date: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.expireDate }}</i></b-col
          >
        </b-row>

        <!-- Field cvv number-->
        <b-row>
          <b-col><strong>Cvv: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.cvv }}</i></b-col
          >
        </b-row>

        <!--Field provide name for electronic wallet-->
        <b-row>
          <b-col><strong>Provider Name: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.providerName }}</i></b-col
          >
        </b-row>

        <!--Feild tranaction code for electronic walllet-->
        <b-row>
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

        <!--Field total price tranaction-->
        <b-row>
          <b-col><strong>Total Price: </strong></b-col>
          <b-col
            ><i>{{ transactionDetail.info.totalPrice }}</i></b-col
          >
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
      perPage: 15,
      currentPage: 1,
      show: false,
      transactionInfo: {
        fields: [
          { key: "transactionId", sortable: true },
          { key: "orderId", sortable: true },
          { key: "tableId", sortable: true },
          { key: "paymentType", sortable: true },
          { key: "totalPrice", sortable: true },
          { key: "createBy", sortable: true },
          { key: "createDate", sortable: true },
          { key: "action" },
        ],
        listTransaction: [],
        totalSale: "",
        totalTransaction: "",
        totalCashOption: "",
        totalCardOption: "",
        totalEWalletOption: "",
      },
      transactionDetail: {
        fields: ["productName", "quantity", "price", "createBy", "createDate"],
        info: {
          transactionId: "",
          orderId: "",
          tableId: "",
          paymentType: "",
          bankName: "",
          cardNumber: "",
          cardType: "",
          expireDate: "",
          cvv: "",
          providerName: "",
          transactionCode: "",
          emailCustomer: "",
          createBy: "",
          createDate: "",
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
            this.show = false;
          } else if (response.status == "401") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "You do not have permission",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            this.show = false;
          }
        });
    },

    // search transation by id
    searchTransactionById() {
      this.show = true;
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
              showProgressBar: true,
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
            showProgressBar: true,
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 3500,
          });
          this.show = false;
        });
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
                  showProgressBar: true,
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
                this.transactionInfo.totalEWaleltOption =
                  response.data.sumPaymentType.electronicWalletOption;

                this.show = false;
              }
            } else {
              this.$swal({
                toast: true,
                showProgressBar: true,
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
              showProgressBar: true,
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
                showProgressBar: true,
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
              this.transactionInfo.totalEWaleltOption =
                response.data.sumPaymentType.electronicWalletOption;

              this.show = false;
            }
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
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
            showProgressBar: true,
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
            showProgressBar: true,
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
          this.show = false;
        });
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
</style>
