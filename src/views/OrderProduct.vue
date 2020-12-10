<template>
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-5"></div>
      <div class="col-md-5">
        <div class="col-md-5 hidden" style="text-align: center">
          <b-spinner id="loading" label="Loading..."></b-spinner>
        </div>
      </div>
    </div>
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
                    variant="danger"
                    title="Add this to order"
                    @click="addProductToListOrder(prd)"
                  >
                    <b-icon icon="cart-plus-fill" variant="light" font-scale="2"></b-icon>
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
            <h5>
              <b-icon icon="pencil"></b-icon>
              {{ table.positionName }}
            </h5>
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
        <div
          style="height: 470px; min-height: 10px; overflow-y: scroll; margin-top: 10px"
        >
          <table
            id="table-log-detail"
            class="table table-striped table-responsive-sm"
            cellspacing="0"
            style="max-heigh: 100px"
          >
            <thead class="thead-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody sytle="min-height:10px; overflow-y:scroll">
              <tr v-for="ord in listOrderChoose" v-bind:key="ord.productId">
                <td scope="row">
                  <template v-if="ord.statusProduct !== 'PENDING'">
                    <b-icon
                      icon="check-circle-fill"
                      font-scale="1"
                      variant="success"
                    ></b-icon>
                  </template>
                  <template v-else>
                    <b-icon icon="x-circle-fill" font-scale="1" variant="danger"></b-icon>
                  </template>
                  {{ ord.productName }}
                </td>
                <td>{{ ord.quantity }}</td>
                <td>
                  {{ ord.priceConvert }}
                </td>
                <td>
                  <b-row>
                    <b-col>
                      <b-button
                        variant="light"
                        size="sm"
                        @click="decreaseOrderProduct(ord.productId)"
                      >
                        <b-icon variant="dark" icon="caret-down" font-scale="1"></b-icon>
                      </b-button>
                    </b-col>
                    <b-col>
                      <b-button
                        variant="danger"
                        size="sm"
                        @click="deletOrderProdct(ord.productId)"
                      >
                        <b-icon icon="trash-fill" font-scale="1"></b-icon>
                      </b-button>
                    </b-col>
                  </b-row>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="label-total">
          <strong>TOTAL PRICE: {{ totalPrice }}</strong>
        </div>
        <div style="padding: 10px">
          <b-button variant="success" block size="lg">GO TO PAY</b-button>
        </div>
        <div style="padding: 10px">
          <b-button variant="light" block size="lg" @click="backToPosition()">
            <b-icon icon="chevron-bar-left" font-scale="2" animation="cylon"></b-icon>BACK
            TO POSITION</b-button
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
      totalPrice: 0,
    };
  },

  mounted() {
    this.checkLocalStorage();
    this.getProducts();
    this.getAllCategories();
    this.getListOrderByTable(this.table.positionId);
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

    // get list order by table
    getListOrderByTable(tableId) {
      $("#loading").show();
      http
        .get(
          "/order-product/api/get-order-product-by-table-id/" +
            tableId +
            "/" +
            this.accountUserValid
        )
        .then((response) => {
          if (response.status == "200") {
            $("#loading").hide();
            this.listOrderChoose = response.data.listOrder;
            this.totalPrice = response.data.totalPrice;
            localStorage.setItem("orderInfo", JSON.stringify(response.data));
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
          $("#loading").hide();
        });
    },

    // get list category
    getAllCategories() {
      $("#loading").show();
      http
        .get("/category/api/get-categories")
        .then((response) => {
          if (response.status == "200") {
            this.listCategory = response.data;
            $("#loading").hide();
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
      $("#loading").show();
      http
        .get("/product/api/get-all-products/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.listProduct = response.data;
            $("#loading").hide();
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
        });
    },

    // get all product by category
    getProductByCategoryId(pCategoryId) {
      $("#loading").show();
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
            $("#loading").hide();
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
        });
    },

    // click choose product
    addProductToListOrder(object) {
      var request = {
        tableId: this.table.positionId,
        productId: object.productId,
        price: object.price,
        quantity: 1,
        createBy: this.currentUser,
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
                http
                  .get(
                    "/order-product/api/get-order-product-by-table-id/" +
                      positionId +
                      "/" +
                      this.accountUserValid
                  )
                  .then((responseGet) => {
                    if (responseGet.status == "200") {
                      this.listOrderChoose = responseGet.data.listOrder;
                      this.totalPrice = response.data.totalPrice;
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

table {
  font-size: 12px;
}
</style>
