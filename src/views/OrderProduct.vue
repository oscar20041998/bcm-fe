<template>
  <div class="content">
    <template v-if="show">
      <div class="loading-text">
        Loading <b-icon icon="three-dots" animation="cylon" font-scale="1"></b-icon>
      </div>
    </template>
    <b-overlay :show="show" rounded="sm">
      <div class="form-row">
        <div class="col-sm-2">
          <div class="px-4 py-6">
            <b-row>
              <b-col>
                <h5><b-icon icon="filter-circle-fill" variant="dark"></b-icon> Filter</h5>
              </b-col>
            </b-row>
            <b-button
              block
              variant="light"
              @click="callBackProducts()"
              style="text-align: left"
            >
              <b-icon icon="caret-right-fill" variant="dark"></b-icon> All
            </b-button>
            <template>
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
            </template>
          </div>
        </div>
        <div class="col-sm-7">
          <div class="pannel-menu-detail">
            <b-row>
              <div class="search-menu-bar">
                <b-input
                  id="input-search"
                  class="form-control"
                  type="search"
                  size="sm"
                  placeholder="Search your product"
                  aria-label="Search"
                  style="width: 270px; float: right; margin: 10px"
                  v-model="criteria"
                  @keyup="getProductsByName()"
                />
              </div>
            </b-row>
            <template v-for="prd in listProduct">
              <b-col :key="prd.productId">
                <b-card
                  v-bind:key="prd.productId"
                  :title="prd.productName"
                  :img-src="prd.imageContent"
                  img-alt="Image"
                  img-top
                  tag="article"
                  style="float: left; margin: 0 10px 0 10px"
                  class="mb-2"
                >
                  <b-card-text>
                    {{ prd.price }}
                  </b-card-text>
                  <b-button
                    style="height: 1.92rem"
                    size="sm"
                    squared=""
                    variant="primary"
                    title="Add this to order"
                    @click="addProductToListOrder(prd, $event)"
                  >
                    <b-icon icon="cart-plus-fill" variant="light" font-scale="1"></b-icon>
                    Add to order
                  </b-button>
                </b-card>
              </b-col>
            </template>
          </div>
        </div>
      </div>
      <div class="info-detail-table">
        <div>
          <b-row
            style="border-bottom: 0.5px solid #a9a6a6; padding: 7px; border-radius: 10px"
          >
            <b-col>
              <select
                data-toggle="tooltip"
                data-placement="top"
                title="Select to move to new position"
                class="form-select input-sm select-table"
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
          </b-row>
        </div>
        <div class="pannel-detail-order">
          <b-table
            :items="listOrderChoose"
            :fields="fields"
            head-variant="dark"
            responsive="sm"
            small
            show-empty
          >
            <template v-slot:cell(productName)="data">
              <template v-if="data.item.statusProduct === 'PENDING'">
                <b-icon icon="x-circle-fill" variant="danger"></b-icon>
                {{ data.value }}
              </template>
              <template v-else>
                <b-icon icon="check-circle-fill" variant="success"></b-icon>
                {{ data.value }}
              </template>
            </template>
            <template v-slot:cell(option)="data">
              <b-button-group>
                <b-button
                  squared
                  variant="light"
                  size="sm"
                  @click="decreaseOrderProduct(data.item.id, data.item.productId)"
                >
                  <b-icon
                    variant="dark"
                    icon="dash"
                    font-scale="1"
                    title="Decrease this"
                  ></b-icon>
                </b-button>
                <b-button
                  squared
                  variant="light"
                  size="sm"
                  title="Delete this"
                  @click="deletOrderProdct(data.item.productId)"
                >
                  <b-icon icon="trash2-fill" font-scale="1" variant="dark"></b-icon>
                </b-button>
              </b-button-group>
            </template>
          </b-table>
        </div>
        <div class="fixed-bottom">
          <div class="label-total">
            <strong>TOTAL PRICE: {{ totalPrice }}(đ)</strong>
          </div>
          <div class="label-discount">
            <i v-if="discountedPrice != '' && discountedPrice != 0" style="corlor: red"
              >Discounted: {{ discountedPrice }}(đ)</i
            >
          </div>
          <b-row class="discount-form" v-if="size">
            <b-col>
              <label for="select-type-discount">Discount Type</label>
              <select
                class="form-select input-sm"
                id="select-type-discount"
                v-model="discountType"
              >
                <option selected="true" value="">Select Type</option>
                <option value="PERCENT">Percent (%)</option>
                <option value="CASH">Cash</option>
              </select>
            </b-col>
            <b-col>
              <template v-if="discountType == 'PERCENT'">
                <label for="input-percent-distcount">Value</label>
                <b-form-spinbutton
                  id="input-percent-distcount"
                  v-model="discountPercentValue"
                  placeholder="--%"
                  step="5"
                  min="0"
                  @change="discountPrice('PERCENT', discountPercentValue)"
                  max="100"
                ></b-form-spinbutton>
              </template>
              <template v-if="discountType == 'CASH'">
                <label for="input-cash-distcount">Value</label>
                <b-input
                  id="input-cash-discount"
                  placeholder="Example: 5,000"
                  v-model="discountCashValue"
                  autocomplete="off"
                  maxlength="12"
                  @keyup="triggerFormatCashDicount(discountCashValue)"
                ></b-input>
              </template>
            </b-col>
          </b-row>
          <b-button-group size="lg">
            <template v-if="size">
              <b-button squared size="lg" variant="success" @click="goToPaymentPay()">
                <b-icon icon="credit-card2-front" scale="1"></b-icon>
                GO TO PAYMENT
              </b-button>
            </template>
            <template v-if="size">
              <b-button
                variant="warning"
                squared
                size="lg"
                @click="showModalSplitOrMergeProduct"
              >
                <b-icon icon="pie-chart" variant="dark"></b-icon> SPLIT/ MERGE TABLE
              </b-button>
            </template>
            <template v-if="size">
              <b-button variant="primary" squared size="lg" v-b-modal.modal-xl>
                <b-icon icon="printer-fill"></b-icon> PRINT FOR KITCHENT
              </b-button>
            </template>
            <b-button squared variant="outline-dark" size="lg" @click="backToPosition()">
              <b-icon icon="chevron-bar-left" font-scale="1" animation="cylon"></b-icon
              >BACK TO POSITION</b-button
            >
          </b-button-group>
        </div>
      </div>
    </b-overlay>

    <!--Modal split/ merge product of table -->
    <b-modal
      id="modal-split-merge-product"
      size="xl"
      title="PRODUCTION SPLIT"
      no-close-on-backdrop
      header-bg-variant="dark"
      header-text-variant="light"
      ok-title="Agree and split"
      ok-variant="success"
      :ok-disabled="listSplit.length == 0"
      @ok="saveSplitList"
    >
      <b-row>
        <b-col><strong>FROM: </strong> {{ table.positionName }}</b-col>
        <b-col> </b-col>
        <b-col><strong>TO: </strong> </b-col>
        <b-col
          ><select
            data-toggle="tooltip"
            data-placement="top"
            title="Select to move to new position"
            class="form-select input-sm"
            id="select-position"
            v-model="positionSelected"
          >
            <option selected value="" disabled>{{ table.positionName }} (current)</option>
            <option
              v-for="p in positions"
              :key="p.positionId"
              :value="p.positionId"
              :label="p.positionName"
            ></option></select
        ></b-col>
      </b-row>
      <hr class="my-2" />
      <b-row>
        <b-col>
          <div class="region-table">
            <b-table
              :items="listOrderChoose"
              :fields="fieldsOrder"
              head-variant="dark"
              id="my-table-systemLogList"
              responsive="sm"
              sticky-header
              striped
              hover
              small
              show-empty
              @click="onRowSelected"
            >
              <!-- <template v-slot:cell(quantity)="data">
                <b-form-spinbutton
                  id="spin-btn-quantity"
                  inline
                  size="sm"
                  :value="data.item.quantity"
                  min="1"
                  :max="data.item.quantity"
                  @change="on"
                ></b-form-spinbutton>
              </template> -->
            </b-table>
          </div>
        </b-col>
        <b-col>
          <div class="region-table">
            <b-table
              :items="listSplit"
              :fields="fieldsSplit"
              :select-mode="selectModeBackList"
              @row-selected="onRowSelectedBackList"
              selectable
              ref="selecttableTableBackList"
              head-variant="secondary"
              id="my-table-systemLogList"
              responsive="md"
              sticky-header
              striped
              hover
              small
              show-empty
            >
              <!-- <template v-slot:cell(quantity)="data">
                <b-form-spinbutton
                  id="spin-btn-quantity"
                  inline
                  size="sm"
                  :value="data.item.quantity"
                  min="1"
                  :max="data.item.quantity"
                  @change="on"
                ></b-form-spinbutton>
              </template> -->
            </b-table>
          </div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      criteria: "",
      perPage: 100,
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
      fields: [
        { key: "productName", sortable: true },
        { key: "quantity", sortable: true },
        { key: "priceConvert", sortable: true, label: "Price" },
        "option",
      ],
      positionSelected: "",
      listSplit: [],
      listSelected: [],
      listBack: [],
      fieldsOrder: [
        { key: "productName", sortable: true },
        { key: "quantity", sortable: true },
        { key: "priceConvert", sortable: true, label: "Price" },
      ],
      fieldsSplit: [
        { key: "productName", sortable: true },
        { key: "quantity", sortable: true },
        { key: "priceConvert", sortable: true, label: "Price" },
      ],
      modes: ["single"],
      selectedRows: [],
      selectMode: "single",
      selectModeBackList: "single",
      totalPrice: "",
      positionSelected: "",
      discountType: "",
      discountPercentValue: 0,
      discountCashValue: "",
      discountedPrice: "",
      // money: {
      //   thousands: ",",
      //   precision: 2,
      //   masked: true /* doesn't work with directive */,
      // },
    };
  },

  mounted() {
    this.checkLocalStorage();
    this.getProducts();
    this.getAllCategories();
    this.getListOrderByTable(this.table.positionId);
    this.getPosition();
    this.checkList();
    localStorage.removeItem("discount");
  },

  computed: {},

  methods: {
    showModalSplitOrMergeProduct() {
      this.$root.$emit("bv::show::modal", "modal-split-merge-product", "#btnShow");
    },

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

    // get all position available
    getPosition() {
      this.show = true;
      var currentTable = this.table.positionId;
      http
        .get("/position/api/get-positions/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.positions = response.data.positions;
            var data = this.positions;
            $.each(data, function (i, e) {
              if (currentTable == e.positionId) {
                data.splice(i, 1);
              }
            });
          }
          this.show = false;
        })
        .catch((error) => {
          console.log(error);
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
            this.$store.commit("setListOrdered", this.listOrderChoose);
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

    callBackProducts() {
      this.getProducts();
    },

    getProductsByName() {
      this.show = true;
      var pProductName = this.criteria;
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
              this.listProduct = response.data;
              this.show = false;
            } else {
              this.$swal({
                toast: true,
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
        this.callBackProducts();
      }
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
    addProductToListOrder(object, event) {
      var quantity = $(event.currentTarget).prev()[0].textContent;
      var request = {
        tableId: this.table.positionId,
        productId: object.productId,
        productName: object.productName,
        price: parseInt(object.price.replaceAll(",", "").replaceAll("đ", "").trim()),
        quantity: 1,
        createBy: this.userCurrent,
      };
      http
        .post("/order-product/api/save-order/" + this.accountUserValid, request)
        .then((response) => {
          if (response.status == "200") {
            this.getListOrderByTable(this.table.positionId);
            this.resetDiscount();
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

    // descrease quanity order product
    decreaseOrderProduct(orderId, productId) {
      var positionId = this.table.positionId;
      http
        .post(
          "/order-product/api/decrease-order/" +
            this.accountUserValid +
            "/" +
            orderId +
            "/" +
            positionId +
            "/" +
            productId
        )
        .then((response) => {
          if (response.status == "200") {
            this.getListOrderByTable(this.table.positionId);
            this.resetDiscount();
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
                this.resetDiscount();
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
        }
      });
    },

    renderQuantityOrderProduct: function (value) {
      return value.seqId;
    },

    backToPosition() {
      this.$router.push({ name: "Position" });
    },

    goToPaymentPay() {
      this.$router.push({ name: "PaymentProduct" });
    },

    discountPrice(type, valueDiscount) {
      var orginTotal = JSON.parse(localStorage.getItem("orderInfo")).totalPrice;
      var originTotalValue = parseFloat(orginTotal.replace(",", ""));
      var discountObject = {
        discountType: "",
        discountValue: "",
        totalDiscountPrice: "",
      };
      var discountPrice = null;
      if (valueDiscount) {
        if (type == "PERCENT") {
          discountPrice = (originTotalValue * valueDiscount) / 100;
          this.totalPrice = originTotalValue - discountPrice;
          this.discountedPrice = this.formatPriceToString(discountPrice);
          discountObject.discountType = "PERCENT";
          discountObject.discountValue = valueDiscount + "(%)";
          discountObject.totalDiscountPrice = this.discountedPrice;
        } else if (type == "CASH") {
          discountPrice = parseInt(valueDiscount.replace(",", ""));
          this.totalPrice = originTotalValue - discountPrice;
          discountObject.discountType = "CASH";
          discountObject.discountValue = this.formatPriceToString(valueDiscount) + "(đ)";
          discountObject.totalDiscountPrice = this.formatPriceToString(discountPrice);
        }
        this.totalPrice = this.formatPriceToString(this.totalPrice);
        localStorage.setItem("discount", JSON.stringify(discountObject));
      } else {
        this.discountedPrice = 0;
        this.totalPrice = orginTotal;
      }
    },

    resetDiscount() {
      this.discountPercentValue = 0;
      (this.discountCashValue = ""), (this.discountType = "");
    },

    formatPriceToString(value) {
      return new String(value).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    triggerFormatCashDicount(value) {
      this.discountCashValue = new String(value)
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      this.discountPrice("CASH", value);
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
            position: "top-end",
            title: error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
        });
    },

    checkExistBeforeMove(product, typeMove) {
      var isExist = false;
      var temSplitOrder = this.listSplit;
      if (typeMove == "MAIN_TO_SPLIT") {
        $.each(temSplitOrder, function (i, e) {
          if ((e.productName = product.productName)) {
            isExist = true;
            return;
          }
        });
      }
      return isExist;
    },

    // when click select row
    onRowSelected(items) {
      var temListOrder = this.listOrderChoose;
      var temSplitOrder = this.listSplit;
      var isExistAtSplit = this.checkExistBeforeMove(items[0], "MAIN_TO_SPLIT");
      var item = {
        productId: "",
        productName: "",
        quantity: 0,
        price: 0,
        priceConvert: "",
        originalPrice: 0,
      };
      $.each(items, function (i, e) {
        if (!isExistAtSplit) {
          if (e.quantity == 1) {
            $.each(temListOrder, function (ii, ee) {
              if (ee.productName === e.productName) {
                temListOrder.splice(ii, 1);
              }
            });
          } else {
            e.quantity = e.quantity - 1;
            e.priceConvert = new String(
              parseInt(e.originalPrice.replace(",", "")) * e.quantity
            )
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            item.productId = items[0].productId;
            item.productName = items[0].productName;
            item.quantity = 1;
            item.priceConvert = new String(
              parseInt(items[0].originalPrice.replace(",", "")) * 1
            )
              .replace(/\D/g, "")
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            item.price = parseInt(items[0].originalPrice.replace(",", "")) * 1;
            item.originalPrice = items[0].originalPrice;
            temSplitOrder.push(item);
            console.log(item);
          }
        } else {
          e.quantity = e.quantity - 1;
          e.priceConvert = new String(
            parseInt(e.originalPrice.replace(",", "")) * e.quantity
          )
            .replace(/\D/g, "")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          $.each(temSplitOrder, function (i, spl) {
            if ((spl.quantity.productName = items[0].productName)) {
              spl.quantity = spl.quanity + 1;
              spl.priceConvert = new String(parseInt(spl.originalPrice.replace(",", "")) * spl.quantity)
                .replace(/\D/g, "")
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          });
        }
      });
    },

    // revert product into list order product
    onRowSelectedBackList(items) {
      var temListOrder = this.listOrderChoose;
      var temSplitOrder = this.listSplit;
      $.each(items, function (i, e) {
        temListOrder.push(e);
        $.each(temSplitOrder, function (ii, ee) {
          if (ee.productName === e.productName) {
            temSplitOrder.splice(ii, 1);
          }
        });
      });
    },

    // save split list
    saveSplitList() {
      if (this.listSplit.length > 0) {
        if (
          this.positionSelected !== this.table.positionId &&
          this.positionSelected != ""
        ) {
          this.$swal({
            title: "Are you sure?",
            text:
              "We will split " +
              this.listSplit.length +
              " order to " +
              this.positionSelected,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, split it!",
          }).then((result) => {
            if (result.isConfirmed) {
              this.implementSplit();
            } else if (result.isDismissed) {
              this.revertListSplit();
              $("#select-position").prop("selectedIndex", 0);
            }
          });
        } else {
          $("#select-position").prop("selectedIndex", 0);
          this.$swal({
            toast: true,
            position: "top-end",
            title: "No change was made",
            icon: "info",
            showConfirmButton: false,
            timer: 3500,
          });
          this.revertListSplit();
        }
      } else {
        this.$swal({
          toast: true,
          position: "top-end",
          title: "Please select item, which you want to split",
          icon: "info",
          showConfirmButton: false,
          timer: 3500,
        });
      }
    },

    // revert list when click cancel button
    revertListSplit() {
      var data = this.listSplit;
      var listOrder = this.listOrderChoose;
      $.each(data, function (i, e) {
        listOrder.push(e);
        data.splice(i, 1);
      });
    },

    // impletmet split order
    implementSplit() {
      var request = this.listSplit;
      var currentTable = this.table.positionId;
      var selectedTable = this.positionSelected;
      http
        .post(
          "/order-product/api/split-order/" +
            this.accountUserValid +
            "/" +
            currentTable +
            "/" +
            selectedTable,
          request
        )
        .then((response) => {
          if (response.status == "200") {
            this.$swal({
              toast: true,
              position: "top-end",
              title: "Split order successfully ... !!!",
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
  height: 10rem;
  width: fit-content;
  border-right: 0.5px solid gray;
}

img {
  height: 10rem;
  width: 14rem;
}
strong {
  font-size: 15px;
  font-family: "Lucida Bright", cursive;
  word-break: break-all;
}

h4.card-title {
  font-size: 14px;
  font-weight: bold;
  font-family: "Lucida Bright";
}

.card {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: transparent;
  vertical-align: top;
  width: fit-content;
  height: fit-content;
}

.label-total {
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: right;
  font-size: 15px;
  font-family: "Lucida Bright", cursive;
  word-break: break-all;
}

.label-discount {
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: right;
  font-size: 13px;
  font-family: "Lucida Bright", cursive;
  word-break: break-all;
  color: red;
}

.pannel-menu-detail {
  max-height: 1024px;
  height: 1010px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 10px 10px 10px;
  border-left: 0.5px solid #a9a6a6;
  border-right: 0.5px solid #a9a6a6;
  border-bottom: 0.5px solid #a9a6a6;
}

.pannel-detail-order {
  margin-top: 20px;
  height: 80%;
  width: 100%;
  position: absolute;
  display: table-row;
  overflow: auto;
}

.fixed-bottom {
  bottom: 0;
  vertical-align: bottom;
  float: right;
  position: absolute;
  border-top: 1px solid #a9a6a6;
  border-radius: 10px 5px 50px;
}

.search-menu-bar {
  background-color: #343a40;
  margin-bottom: 10px;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}

.btn-group .btn-group-lg {
  width: 100%;
}

.info-detail-table {
  float: right;
  height: 1010px;
  width: 24%;
  position: absolute;
  right: 0;
  top: 0;
}

.select-table {
  width: 200px;
  float: right;
}

.region-button-select {
  margin: 0px 10px 10px 20px;
}

.region-table {
  font-size: 13px;
}

.discount-form {
  padding: 10px;
  margin: 10px 0 10px 0;
  border: 0.5px solid #a9a6a6;
  border-radius: 5px;
}
</style>
