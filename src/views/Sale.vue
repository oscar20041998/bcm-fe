<template>
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-3">
        <h5>
          <b-icon icon="box-seam"></b-icon>
          SALE MANAGEMENT
        </h5>
      </div>
      <div class="col-sm-2">
        <b-icon
          icon="circle-fill"
          animation="throb"
          font-scale="1"
          variant="success"
        ></b-icon>
        OPENING : {{ isOpening }}
      </div>
      <div class="col-sm-2">
        <b-icon icon="x-circle-fill" font-scale="1" variant="danger"></b-icon>
        CLOSED : {{ isClosed }}
      </div>
      <div class="col-md-5" style="text-align: right">
        <b-button-group>
          <button
            type="button"
            class="btn btn-light"
            data-toggle="modal"
            data-target="#listOrderPendingModal"
            @click="getListOrderPending()"
          >
            <b-icon icon="diagram3-fill" font-scale="1" variant="dark"></b-icon>
            ORDERED QUEUE
          </button>
        </b-button-group>
      </div>
    </div>
    <hr class="my-2" />
    <div id="divLoading" class="col-md-12 hidden" style="text-align: center">
      <b-spinner id="loading" label="Loading..."></b-spinner>
    </div>

    <!-- Card detail table -->
    <div
      class="row"
      style="height: 670px; min-height: 10px; overflow-y: scroll"
    >
      <template v-for="p in positions">
        <div
          class="col-md-3"
          style="margin-top: 25px"
          v-bind:key="p.positionId"
        >
          <div class="card">
            <div class="card-header">
              {{ p.positionId }}-{{ p.positionName }}
            </div>
            <div class="card-body" style="text-align: center">
              <div class="row" style="text-align: left">
                <div class="col-md-12">
                  <i>Last update by: {{ p.lastUpdateBy }}</i>
                </div>
              </div>
              <div class="row" style="text-align: left">
                <div class="col-md-10">
                  <i>Last update on: {{ p.lastUpdateTime }}</i>
                </div>
              </div>
              <b-icon icon="cup-straw" variant="dark" font-scale="4"></b-icon>
            </div>
          </div>
          <div class="card-footer">
            <div class="row">
              <template v-if="p.positionStatus === 'OPENING'">
                <div class="col-sm-8">
                  <strong>{{ p.positionStatus }}</strong>
                  <b-icon
                    icon="circle-fill"
                    animation="throb"
                    font-scale="1"
                    variant="success"
                  ></b-icon>
                </div>
                <div class="col-sm-2">
                  <b-button
                    v-b-toggle.sidebar-footer
                    variant="light"
                    title="Detail ordered"
                    @click="getListOrderByTable(p.positionId)"
                  >
                    <b-icon icon=" layout-text-window" variant="dark"></b-icon>
                  </b-button>
                </div>
                <div class="col-sm-2">
                  <button
                    class="btn btn-light btn-sm"
                    data-toggle="modal"
                    data-target="#orderProductModal"
                    @click="getProducts(p.positionId)"
                    title="Order more"
                  >
                    <b-icon icon="cart-plus-fill" variant="primary"></b-icon>
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="col-sm-8">
                  <strong>{{ p.positionStatus }}</strong>
                  <b-icon
                    icon="x-circle-fill"
                    font-scale="1"
                    variant="danger"
                  ></b-icon>
                </div>
                <div class="col-sm-4">
                  <button
                    class="btn btn-light btn-sm"
                    data-toggle="modal"
                    data-target="#orderProductModal"
                    @click="getProducts(p.positionId)"
                    title="Order"
                  >
                    <b-icon icon="cart-plus-fill" variant="primary"></b-icon>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- Side bar list order by table-->
    <div class="form-row">
      <b-sidebar
        bg-variant="light"
        text-variant="light"
        shadow
        id="sidebar-footer"
        aria-label="Sidebar with custom footer"
        header
      >
        <template #footer="{ hide }">
          <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
            <b-button size="sm" @click="hide">
              <b-icon
                icon="chevron-double-left"
                variant="light"
                animation="cylon"
              ></b-icon>
            </b-button>
          </div>
        </template>
        <div class="px-4 py-6">
          <h6 style="color: black; text-algin: left">
            ORDER INFO DETAIL {{ orderInfo.tableName }}
            <b-icon
              icon="geo-alt-fill"
              variant="danger"
              font-scale="2"
              animation="cylon-vertical"
            ></b-icon>
          </h6>
          <hr class="my-4" />
          <template>
            <ul
              class="list-group"
              v-for="ord in orderInfo.listOrder"
              :key="ord.productName"
              style="margin-top: 10px"
            >
              <template v-if="ord.statusProdct == 'PENDING'">
                <li class="list-group-item">
                  {{ ord.productName }} <strong>x{{ ord.quantity }}</strong> -
                  đ{{ ord.priceConvert }}
                  <b-icon
                    icon="exclamation-triangle-fill"
                    scale="1"
                    variant="warning"
                    title="Pending"
                  ></b-icon>
                </li>
              </template>
              <template v-else>
                <li class="list-group-item">
                  {{ ord.productName }} <strong>x{{ ord.quantity }}</strong> -
                  đ{{ ord.priceConvert }}
                  <b-icon
                    icon="check2-circle"
                    scale="1"
                    variant="success"
                    title="Done"
                  ></b-icon>
                </li>
              </template>
            </ul>
          </template>
          <hr class="my-4" />
          <div class="row">
            <button
              class="btn btn-primary btn-lg btn-block"
              data-toggle="modal"
              data-target="#paymentModal"
              style="font-size: 16px"
              @click="setPaymentInfo(orderInfo.tableName, orderInfo.totalPrice)"
            >
              Pay now
              <b-icon icon="credit-card" aria-hidden="true"></b-icon> ... Total
              Price: {{ orderInfo.totalPrice }}đ
            </button>
          </div>
        </div>
      </b-sidebar>
    </div>

    <!--Modal take order -->
    <div
      class="modal fade"
      id="orderProductModal"
      tabindex="-1"
      aria-labelledby="orderProductModal"
      aria-hidden="true"
      data-backdrop="static"
    >
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="orderProductModal">
              TAKE ORDER FOR TABLE {{ tableId }}
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row" style="text-align: right">
              <div class="col-sm-1">
                <h6 style="text-align: left">
                  <b-icon icon="filter" variant="dark" font-scale="2"></b-icon>
                  Filter
                </h6>
              </div>
              <div class="col-sm-3">
                <input
                  type="search"
                  class="form-control"
                  placeholder="Search by product name"
                  v-model="searchProductCriteria"
                  @keyup="getProductsByName()"
                />
              </div>
            </div>
            <div class="row" style="margin-top: 20px">
              <div class="col-md-7" style="overflow: scroll; height: 650px">
                <div class="row">
                  <template v-for="prd in listProductAvailable">
                    <div
                      class="column"
                      style="margin-top: 10px"
                      v-bind:key="prd.productId"
                    >
                      <div class="card-order">
                        <div class="card-body" style="max-width: 300px">
                          <b-icon
                            icon="tag-fill"
                            variant="secondary"
                            font-scale="1"
                          ></b-icon>
                          {{ prd.productName }}
                        </div>
                        <div class="card-footer">
                          <div class="row">
                            <b-button
                              style="text-align: center"
                              block
                              variant="info"
                              title="Take this"
                              @click="addProductToListOrder(prd)"
                            >
                              <b-icon
                                icon="cart-plus-fill"
                                variant="light"
                              ></b-icon>
                              {{ prd.priceFormatString }}
                            </b-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-md-5">
                <h5>PRODUCT CHOOSED</h5>
                <div
                  style="height: 500px; min-height: 10px; overflow-y: scroll"
                >
                  <table
                    id="table-log-detail"
                    class="table table-striped table-responsive-sm"
                    cellspacing="3"
                    style="max-heigh: 100px"
                  >
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">Product name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Option</th>
                      </tr>
                    </thead>
                    <tbody sytle="min-height:10px; overflow-y:scroll">
                      <tr v-for="prd in listOrderChoose" :key="prd.productId">
                        <td>{{ prd.productName }}</td>
                        <td>{{ prd.quantity }}</td>
                        <td>{{ prd.priceConvert }}</td>
                        <td>
                          <div class="row">
                            <div class="col-sm-3">
                              <b-button
                                pill
                                variant="light"
                                @click="decreaseOrderProduct(prd.productId)"
                              >
                                <b-icon
                                  icon="dash-circle-fill"
                                  variant="secondary"
                                ></b-icon>
                              </b-button>
                            </div>
                            <template
                              v-if="
                                currentRole == 'ROLE_MANAGER' ||
                                currentRole == 'ROLE_ADMINISTRATOR'
                              "
                            >
                              <div class="col-sm-3">
                                <b-button
                                  pill
                                  variant="light"
                                  @click="deletOrderProdct(prd.productId)"
                                >
                                  <b-icon
                                    icon="trash-fill"
                                    variant="danger"
                                    font-scale="1"
                                  ></b-icon>
                                </b-button>
                              </div>
                            </template>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="card-footer">
                  <b-button
                    style="text-align: center"
                    size="lg"
                    block
                    variant="success"
                    @click="acceptOrder()"
                  >
                    <b-icon icon="cart-check-fill"></b-icon>
                    ACCPET ORDER
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Modal payment-->
    <div
      class="modal fade"
      id="paymentModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="paymentModal"
      aria-hidden="false"
      data-backdrop="static"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="title-form" class="modal-title">
              FORM PAYMENT TRANSACTION
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-4 col-form-label">
                <b-icon icon="code"></b-icon>
                Table ID:
              </label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  disabled
                  v-model="paymentInfo.tableId"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-4 col-form-label">
                <b-icon icon="server"></b-icon>
                Payment type:
              </label>
              <div class="col-sm-6" requried>
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <select
                      class="form-control"
                      id="inputGroupSelect01"
                      v-model="paymentInfo.paymentType"
                    >
                      <option value="">Select one</option>
                      <option value="Cash option">Cash option</option>
                      <option value="Card option">Card option</option>
                    </select>
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
            </div>
            <b-card no-body class="mb-1">
              <b-button block v-b-toggle.accordion-1 variant="light">
                <b-icon icon="caret-down-fill"></b-icon> Info card payment (if
                have)
              </b-button>
              <b-collapse
                id="accordion-1"
                :visible="false"
                accordion="my-accordion"
                role="tabpanel"
              >
                <b-card-body>
                  <div class="form-group row">
                    <label for="inputPassword" class="col-sm-4 col-form-label">
                      <b-icon icon="credit-card"></b-icon>
                      Card type:
                    </label>
                    <div class="col-sm-6" style="text-align: left">
                      <select
                        class="form-control"
                        id="inputGroupSelect01"
                        v-model="paymentInfo.cardType"
                      >
                        <option value="">Select one</option>
                        <option value="VISA">Visa</option>
                        <option value="MASTER CARD">Master card</option>
                        <option value="NAPAS">Napas</option>
                        <option value="CREDIT CARD">Credit card</option>
                        <option value="DEBIT CARD">Debit card</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputPassword" class="col-sm-4 col-form-label">
                      <b-icon icon="card-heading"></b-icon>
                      Card number:
                    </label>
                    <div class="col-sm-6">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Entry card number (if have)"
                        v-model="paymentInfo.cardNumber"
                        maxlength="16"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputPassword" class="col-sm-4 col-form-label">
                      <b-icon icon="building"></b-icon>
                      Bank name:
                    </label>
                    <div class="col-sm-6">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Entry bank name (if have)"
                        v-model="paymentInfo.bankName"
                      />
                    </div>
                  </div>
                </b-card-body>
              </b-collapse>
            </b-card>
            <hr class="my-3" />
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-4 col-form-label">
                <b-icon icon="cash"> </b-icon>
                Total price:
              </label>
              <div class="col-sm-6">
                <input
                  type="text"
                  class="form-control"
                  disabled
                  v-model="paymentInfo.totalPrice"
                />
              </div>
              <div
                class="col-sm-1"
                id="div-loading-payment"
                style="display: none"
              >
                <b-spinner label="Loading..."></b-spinner>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-success btn-lg btn-block"
              style="text-align: center"
              @click="acceptPayment()"
            >
              <b-icon icon="check" font-scale="2" variant="light"></b-icon>
              ACCEPT PAYMENT
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal product pending -->
    <div
      class="modal fade"
      id="listOrderPendingModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="listOrderPendingModal"
      aria-hidden="false"
      data-backdrop="static"
    >
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div class="row">
              <div class="col-md-12">
                <h5 id="title-form" class="modal-title">
                  LIST ORDER PRODUCT PENDING
                </h5>
              </div>
              <div
                class="col-sm-1"
                id="div-spinner-check-done"
                style="display: none"
              >
                <b-spinner class="m-3" label="Busy"></b-spinner>
              </div>
            </div>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div style="height: 700px; min-height: 10px; overflow-y: scroll">
              <table
                id="table-log-detail"
                class="table table-striped table-responsive-sm"
                cellspacing="0"
                style="max-heigh: 100px"
              >
                <thead class="thead-dark">
                  <tr>
                    <th scope="col">Table ID</th>
                    <th scope="col">Product name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Status</th>
                    <th scope="col">Create by</th>
                    <th scope="col">Create date</th>
                    <th scope="col">Option</th>
                  </tr>
                </thead>
                <tbody sytle="min-height:10px; overflow-y:scroll">
                  <tr v-for="prd in listOrderPending" :key="prd.productId">
                    <td>{{ prd.tableId }}</td>
                    <td>{{ prd.productName }}</td>
                    <td>
                      {{ prd.quantity }}
                      <template v-if="prd.quantity >= 4">
                        <b-icon
                          icon="chevron-double-up"
                          variant="danger"
                        ></b-icon>
                      </template>
                      <template
                        v-else-if="prd.quantity <= 3 && prd.quantity > 1"
                      >
                        <b-icon icon="chevron-up" variant="success"></b-icon>
                      </template>
                    </td>
                    <td>
                      {{ prd.status }}
                      <b-icon
                        icon="three-dots"
                        animation="cylon"
                        font-scale="2"
                        variant="info"
                      ></b-icon>
                    </td>
                    <td>{{ prd.createBy }}</td>
                    <td>{{ prd.createDate }}</td>
                    <td>
                      <div class="row">
                        <div class="col-sm-6">
                          <button
                            class="btn btn-success btn-sm"
                            data-toggle="modal"
                            data-target="#addNewProducModal"
                            @click="checkDone(prd)"
                          >
                            <b-icon icon="check-circle"></b-icon>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal add new product-->
</template>

<script>
import http from "../axios/http-common";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";

// Add the required rule
extend("required", {
  ...required,
  message: "This field is required.",
});
export default {
  data() {
    return {
      tableId: this.$store.getters.getTableId,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      currentUser: JSON.parse(localStorage.getItem("user")).userName,
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      positions: [],
      isOpening: "",
      isClosed: "",
      position: {
        positionId: "",
        name: "",
      },

      orderInfo: {
        tableName: "",
        listOrder: [],
        totalPrice: "",
      },
      paymentInfo: {
        tableId: "",
        totalPrice: "",
        paymentType: "",
        cardType: "",
        cardNumber: "",
        bankName: "",
      },

      listProductAvailable: [],
      listCategory: [],
      listOrderChoose: [],
      listOrderPending: [],
      searchProductCriteria: "",
    };
  },

  mounted() {
    $("#loading").hide();
    this.checkLocalStorage();
    this.getPosition();
    this.getAllCategories();
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
      $("#loading").show();
      http
        .get("/position/api/get-positions/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.positions = response.data.positions;
            this.isOpening = response.data.isOpening;
            this.isClosed = response.data.isClosed;
          }
          $("#loading").hide();
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

    // get list table by order
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

    // get all product
    getProducts(positionId) {
      this.listOrderChoose = [];
      http
        .get("/product/api/get-all-products/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.listProductAvailable = response.data;
            http
              .get(
                "/order-product/api/get-order-product-by-table-id/" +
                  positionId +
                  "/" +
                  this.accountUserValid
              )
              .then((response) => {
                if (response.status == "200") {
                  $("#loading").hide();
                  this.listOrderChoose = response.data.listOrder;
                  localStorage.setItem("tableId", positionId);
                  this.$store.commit("setTableId", response.data.tableId);
                }
              })
              .catch((error) => {
                this.$swal({
                  toast: true,
                  showProgressBar: true,
                  position: "top-end",
                  title: "List order is being empty, plase add more",
                  icon: "info",
                  showConfirmButton: false,
                  timer: 2100,
                });
                $("#loading").hide();
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

    // get all product by name
    getProductsByName() {
      var pProductName = this.searchProductCriteria;
      $("#loading").show();
      if (pProductName != "") {
        http
          .get(
            "/product/api/get-products-by-name/" +
              this.accountUserValid +
              "/" +
              pProductName
          )
          .then((response) => {
            if (response.status == "200") {
              this.listProductAvailable = response.data;
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
      } else {
        this.getProducts();
      }
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

    // accept order
    acceptOrder() {
      $("#orderProductModal").hide("slow");
      $(".modal-fade").css("display", "none");
      $(".modal-backdrop").css("display", "none");
      this.getPosition();
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

    // set payment info
    setPaymentInfo(tableId, totalPrice) {
      this.paymentInfo.tableId = tableId;
      this.paymentInfo.totalPrice = totalPrice;
    },

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
          .post(
            "/transaction/api/save-transaction/" + this.accountUserValid,
            request
          )
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

    // get list order is pending
    getListOrderPending() {
      $("#loading").css("display", "block");
      http
        .get(
          "/order-product/api/get-order-product-pending/" +
            this.accountUserValid
        )
        .then((response) => {
          if (response.status == "200") {
            $("#loading").css("display", "none");
            this.listOrderPending = response.data;
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
          $("#loading").css("display", "none");
        });
    },

    // get list order is pending
    checkDone: function (object) {
      var data = this.listOrderPending;
      var accountId = this.accountUserValid;
      $("#div-spinner-check-done").css("display", "block");
      http
        .post(
          "/order-product/api/update-order-product-pending/" +
            accountId +
            "/" +
            object.tableId +
            "/" +
            object.productId
        )
        .then((response) => {
          if (response.status == "200") {
            $("#div-spinner-check-done").css("display", "none");
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
          $("#div-spinner-check-done").css("display", "none");
        });
      $.each(data, function (i, e) {
        if (e.productId == object.productId) {
          data.splice(i, 1);
        } else {
          return;
        }
      });
    },
  },
};
</script>

<style scoped>
button {
  text-align: left;
}

ul,
li,
strong,
h6 {
  color: black;
}

.card-order {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: transparent;
  padding: 30px;
  height: 200px;
}

.card-footer {
  background-color: whitesmoke;
}

thead,
tr,
td,
tbody {
  font-size: 13px;
  max-width: fit-content;
}

#input-quantity {
  width: 70px;
  height: 30px;
  font-size: 13px;
  text-align: center;
}

.modal-xl {
  max-width: 100%;
  height: auto;
}

.column {
  float: left;
  width: 25%;
  padding: 0 10px;
}

i {
  font-size: 13px;
  color: rgb(194, 182, 182);
}
</style>
>
