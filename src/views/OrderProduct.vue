<template>
  <div class="jumbotron">
    <div class="row">
      <div class="col-sm-2">
        <b-list-group v-for="c in listCategory" :key="c.idCategory">
          <div class="row">
            <div class="col-sm-8">
              <b-button
                style="text-align: left"
                block
                variant="light"
                @click="getProductByCategoryId(c.idCategory)"
              >
                <b-icon icon="caret-right-fill"></b-icon>
                {{ c.categoryName }}
              </b-button>
            </div>
          </div>
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
                  <b-button pill variant="success" title="Add this to order">
                    <b-icon icon="cart-plus-fill" variant="light" font-scale="2"></b-icon>
                  </b-button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="col-sm-3">3 of 3</div>
    </div>
  </div>
</template>

<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      accountCurrent: JSON.parse(localStorage.getItem("user")).accountId,
      userCurrent: JSON.parse(localStorage.getItem("user")).userName,
      listCategory: [],
      listProduct: [],
      listOrderByTable: [],
      table: JSON.parse(localStorage.getItem("table")),
    };
  },

  mounted() {
    this.getAllCategories();
  },

  methods: {
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
            this.orderInfo.listOrder = response.data.listOrder;
            this.orderInfo.tableName = response.data.tableName;
            this.orderInfo.totalPrice = response.data.totalPrice;
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
        .get("/product/api/get-all-products/" + this.accountCurrent)
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
            this.accountCurrent +
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
        tableId: localStorage.getItem("tableId"),
        productId: object.productId,
        price: object.price,
        quantity: 1,
        createBy: this.currentUser,
      };
      http
        .post("/order-product/api/save-order/" + this.accountUserValid, request)
        .then((response) => {
          if (response.status == "200") {
            http
              .get(
                "/order-product/api/get-order-product-by-table-id/" +
                  request.tableId +
                  "/" +
                  this.accountUserValid
              )
              .then((responseGet) => {
                if (responseGet.status == "200") {
                  this.listOrderChoose = responseGet.data.listOrder;
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
    },

    // descrease quanity order product
    decreaseOrderProduct(productId) {
      var positionId = localStorage.getItem("tableId");
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
    },

    // delete order product
    deletOrderProdct(productId) {
      var positionId = localStorage.getItem("tableId");
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: transparent;
  width: fit-content;
  height: fit-content;
  padding: auto;
  margin: 10px auto auto auto;
}
</style>
