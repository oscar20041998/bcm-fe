<template>
  <div class="jumbotron">
    <b-overlay :show="show" rounded="sm">
      <div class="row">
        <div class="col-sm-2">
          <b-row>
            <b-col>
              <h5><b-icon icon="filter-circle-fill" variant="dark"></b-icon> Filter</h5>
            </b-col>
          </b-row>
          <b-list-group v-for="c in listCategory" :key="c.idCategory">
            <b-button
              id="button-category"
              style="text-align: left"
              block
              variant="light"
              @click="getProductByCategoryId(c.idCategory)"
            >
              <b-icon icon="caret-right-fill"></b-icon>
              {{ c.categoryName }}
            </b-button>
          </b-list-group>
        </div>
        <div class="col-sm-7" style="height: 670px; min-height: 10px; overflow-y: scroll">
          <div class="row">
            <template v-for="prd in listProduct">
              <div class="col-sm-4" v-bind:key="prd.productId">
                <div class="card">
                  <img class="card-img-top" :src="prd.imageContent" />
                  <div class="card-body">
                    <h5 class="card-title">
                      <strong>{{ prd.productName }}</strong>
                    </h5>
                    <p class="card-text">
                      {{ prd.priceFormatString }}
                    </p>
                    <b-button
                      pill
                      variant="primary"
                      title="Add this to order"
                      @click="addProductToListOrder(prd)"
                    >
                      <b-icon
                        icon="cart-plus-fill"
                        variant="light"
                        font-scale="2"
                      ></b-icon>
                    </b-button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="col-sm-3">
          <b-row>
            <b-col>
              <select
                data-toggle="tooltip"
                data-placement="top"
                title="Select to move to new position"
                class="form-control input-sm"
                id="select-position"
                v-model="positionSelected"
                @change="moveTableCurrent"
              >
                <option selected value="" disabled>
                  {{ table.positionName }} (current)
                </option>
                <option
                  v-for="p in positions"
                  :key="p.positionId"
                  :value="p.positionId"
                  :label="p.positionName"
                ></option>
              </select>
            </b-col>
            <b-col>
              <b-button-group style="margin-left: 35px">
                <b-button variant="light">
                  <b-icon icon="scissors"></b-icon> Split
                </b-button>
                <b-button> <b-icon icon="pie-chart"></b-icon> Merge </b-button>
              </b-button-group>
            </b-col>
          </b-row>
          <div style="font-size: 13px; margin-top: 20px">
            <b-table
              :items="listOrderChoose"
              :fields="fields"
              head-variant="dark"
              id="my-table-systemLogList"
              responsive="sm"
              sticky-header
              striped
              hover
              small
              show-empty
            >
              <template v-slot:cell(productName)="data">
                <template v-if="data.item.statusProduct === 'PENDING'">
                  <b-icon icon="x-circle-fill" variant="danger"></b-icon> {{ data.value }}
                </template>
                <template v-else>
                  <b-icon icon="check-circle-fill" variant="success"></b-icon>
                  {{ data.value }}
                </template>
              </template>
              <template v-slot:cell(option)="data">
                <b-row>
                  <b-col>
                    <b-button
                      pill
                      variant="light"
                      size="sm"
                      @click="decreaseOrderProduct(data.item.productId)"
                    >
                      <b-icon
                        variant="dark"
                        icon="arrow-down"
                        font-scale="1"
                        animation="cylon-vertical"
                        title="Decrease this"
                      ></b-icon>
                    </b-button>
                  </b-col>
                  <b-col>
                    <b-button
                      pill
                      variant="light"
                      size="sm"
                      title="Delete this"
                      @click="deletOrderProdct(data.item.productId)"
                    >
                      <b-icon icon="trash2-fill" font-scale="1" variant="danger"></b-icon>
                    </b-button>
                  </b-col>
                </b-row>
              </template>
            </b-table>
          </div>
          <div class="label-total">
            <strong>TOTAL PRICE: {{ totalPrice }}</strong>
          </div>
          <template v-if="size">
            <div style="padding: 10px">
              <button class="btn btn-success btn-block btn-log" @click="goToPaymentPay()">
                GO TO PAY
              </button>
            </div>
          </template>
          <div style="padding: 10px">
            <b-button variant="light" block size="lg" @click="backToPosition()">
              <b-icon icon="chevron-bar-left" font-scale="2" animation="cylon"></b-icon
              >BACK TO POSITION</b-button
            >
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import http from "../axios/http-common";
import PaymentProduct from "../components/PaymentProduct.vue";
export default {
  components: {
    PaymentProduct,
  },
  data() {
    return {
      perPage: 5,
      currentPage: 1,
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      userCurrent: JSON.parse(localStorage.getItem("user")).userName,
      table: JSON.parse(localStorage.getItem("table")),
      listCategory: [],
      listProduct: [],
      listOrderByTable: [],
      listOrderChoose: [],
      positions: [],
      totalPrice: 0,
      show: true,
      imageBank: null,
      size: false,
      fields: ["productName", "quantity", "priceConvert", "option"],
      positionSelected: "",
    };
  },

  mounted() {
    this.checkLocalStorage();
    this.getProducts();
    this.getAllCategories();
    this.getListOrderByTable(this.table.positionId);
    this.getPosition();
    this.checkList();
  },

  computed: {},

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
    // get all position available
    getPosition() {
      this.show = true;
      http
        .get("/position/api/get-positions/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.positions = response.data.positions;
          }
          this.show = false;
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
    // get list order by table
    getListOrderByTable(tableId) {
      http
        .get(
          "/order-product/api/get-order-product-by-table-id/" +
            tableId +
            "/" +
            this.accountUserValid
        )
        .then((response) => {
          if (response.status == "200") {
            this.listOrderChoose = response.data.listOrder;
            this.totalPrice = response.data.totalPrice || 0;
            localStorage.setItem("orderInfo", JSON.stringify(response.data));
            this.show = false;
            this.checkList();
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

    // check list size to show button pay
    checkList() {
      var size = this.totalPrice;
      if (size == 0) {
        this.size = false;
      } else {
        this.size = true;
      }
    },

    // get list category
    getAllCategories() {
      this.show = true;
      http
        .get("/category/api/get-categories")
        .then((response) => {
          if (response.status == "200") {
            this.listCategory = response.data;
            this.show = false;
          } else if (response.status == "401") {
            this.$router.push({
              name: "Login",
            });
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Something went wrong !!!",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            this.$router.push({
              name: "NotFound",
            });
          }
        })
        .catch((error) => {
          this.$router.push({
            name: "Login",
          });
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

    // get all product
    getProducts() {
      this.show = true;
      http
        .get("/product/api/get-all-products/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.listProduct = response.data;
            this.show = false;
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Something went wrong !!!",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            this.$router.push({
              name: "NotFound",
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
          this.$router.push({
            name: "NotFound",
          });
          this.show = false;
        });
    },

    // get all product by category
    getProductByCategoryId(pCategoryId) {
      this.show = true;
      http
        .get(
          "/product/api/get-products-by-category/" +
            this.accountUserValid +
            "/" +
            pCategoryId
        )
        .then((response) => {
          if (response.status == "200") {
            this.listProduct = response.data;
            this.show = false;
          } else {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Something went wrong !!!",
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            this.show = false;
            this.$router.push({
              name: "NotFound",
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
          this.$router.push({
            name: "NotFound",
          });
          this.show = false;
        });
    },

    // click choose product
    addProductToListOrder(object) {
      var request = {
        tableId: this.table.positionId,
        productId: object.productId,
        price: object.price,
        quantity: 1,
        createBy: this.userCurrent,
      };
      http
        .post("/order-product/api/save-order/" + this.accountUserValid, request)
        .then((response) => {
          if (response.status == "200") {
            this.getListOrderByTable(this.table.positionId);
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

    // descrease quanity order product
    decreaseOrderProduct(productId) {
      var positionId = this.table.positionId;
      http
        .post(
          "/order-product/api/decrease-order/" +
            this.accountUserValid +
            "/" +
            positionId +
            "/" +
            productId
        )
        .then((response) => {
          if (response.status == "200") {
            this.getListOrderByTable(this.table.positionId);
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

    // delete order product
    deletOrderProdct(productId) {
      var positionId = this.table.positionId;
      this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          http
            .delete(
              "/order-product/api/delete-order/" +
                this.accountUserValid +
                "/" +
                positionId +
                "/" +
                productId
            )
            .then((response) => {
              if (response.status == "200") {
                this.getListOrderByTable(this.table.positionId);
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
        }
      });
    },

    backToPosition() {
      this.$router.push({ name: "Position" });
    },

    goToPaymentPay() {
      this.$router.push({ name: "PaymentProduct" });
    },

    moveTableCurrent: function (event) {
      if (this.positionSelected !== this.table.positionId) {
        this.$swal({
          title: "Are you sure?",
          text: "This position will be changed to " + this.positionSelected,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.executeMovePosition();
          } else if (result.isDismissed) {
            $("#select-position").prop("selectedIndex", 0);
          }
        });
      } else {
        $("#select-position").prop("selectedIndex", 0);
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "No change was made",
          icon: "info",
          showConfirmButton: false,
          timer: 3500,
        });
      }
    },

    // implement handle move position
    executeMovePosition() {
      var currentTable = this.table.positionId;
      var newTable = this.positionSelected;
      http
        .post(
          "/position/api/move-current-table/" +
            currentTable +
            "/" +
            newTable +
            "/" +
            this.accountUserValid
        )
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Moved success fully",
              icon: "success",
              showConfirmButton: false,
              timer: 3500,
            });
            this.$router.push({ name: "Position" });
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

<style scoped>
.col .left {
  height: 680px;
  width: fit-content;
  border-right: 0.5px solid gray;
}

img {
  height: 150px;
  width: 250px;
}
strong {
  font-size: 20px;
  font-family: "Dancing Script", cursive;
  word-break: break-all;
}

.card {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: transparent;
  width: fit-content;
  height: fit-content;
  padding: auto;
  margin: 20px auto auto auto;
}

.label-total {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
}
</style>
