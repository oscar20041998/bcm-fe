<template>
  <div class="content">
    <b-overlay :show="show" rounded="sm">
      <template v-if="show">
        <div class="loading-text">Loading <b-icon icon="three-dots" animation="cylon" font-scale="1"></b-icon></div>
      </template>

      <b-row>
        <b-col>
          <h5>
            <b-icon icon="cup"></b-icon>
            PRODUCT MANAGEMENT
          </h5>
        </b-col>
        <b-col>
          <b-button-group>
            <template v-if="currentRole == 'ROLE_ADMINISTRATOR'">
              <b-button
                squared
                variant="success"
                data-toggle="modal"
                data-target="#addNewProducModal"
                @click="clearData()"
              >
                <b-icon icon="plus-circle"></b-icon> ADD NEW
              </b-button>
            </template>
          </b-button-group>
        </b-col>
        <b-col>
          <b-input
            id="input-search"
            type="search"
            size="sm"
            placeholder="Search"
            style="width:300px; float:right"
            aria-label="Search"
            v-model="criteria"
            @keyup="getProductsByName()"
          />
        </b-col>
        <div class="col-sm-1">
          <b-icon icon="search"></b-icon>
        </div>
      </b-row>
      <hr class="my-4" />

      <!-- Left side bar -->
      <div class="row">
        <div class="col-sm-2">
          <div class="px-4 py-6">
            <h5 style="color: black; text-algin: left">CATEGORY AVAILABLE</h5>
            <b-button block variant="light" @click="callBackProducts()">
              <b-icon icon="star-fill" variant="warning"></b-icon> All
            </b-button>
            <template>
              <b-list-group v-for="c in listCategory" :key="c.idCategory">
                <div class="row">
                  <b-button-group>
                    <b-button
                      block
                      variant="light"
                      v-model="categoryModelEdit.categoryId"
                      @click="getProductByCategoryId(c.idCategory)"
                    >
                      <b-icon icon="star-fill" variant="warning"></b-icon>
                      {{ c.categoryName }}
                    </b-button>
                    <template v-if="currentRole === 'ROLE_ADMINISTRATOR'">
                      <b-button
                        variant="light"
                        title="Delete category"
                        @click="deleteCategory(c.idCategory)"
                      >
                        <b-icon icon="trash-fill" variant="danger"></b-icon>
                      </b-button>
                      <b-button
                        variant="light"
                        title="Edit this category"
                        data-toggle="modal"
                        data-target="#categoryDetailModal"
                        @click="bindingData(c)"
                      >
                        <b-icon icon="pen-fill" variant="primary"> </b-icon>
                      </b-button>
                    </template>
                  </b-button-group>
                </div>
              </b-list-group>
            </template>
            <hr class="my-4" />
            <template v-if="currentRole == 'ROLE_ADMINISTRATOR'">
              <div class="row">
                <div class="col-sm-8">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <b-input
                        id="addNewCategoryInput"
                        type="text"
                        size="sm"
                        class="form-control"
                        placeholder="Entry new category"
                        v-model="categoryModelAdd.categoryName"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-sm-2">
                  <b-button
                    squared
                    variant="success"
                    title="Add new category"
                    @click="saveCategory()"
                  >
                    <b-icon icon="plus-circle-fill"></b-icon>
                  </b-button>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="col-xl-10">
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
                class="mb-3"
              >
                <b-card-text>
                  {{ prd.price }}
                </b-card-text>

                <b-button-group>
                  <button
                    class="btn btn-link btn-sm"
                    data-toggle="modal"
                    title="Edit product"
                    data-target="#addNewProducModal"
                    @click="bindingDataProduct(prd.productId)"
                  >
                    <b-icon icon="pen-fill"></b-icon>
                  </button>
                  <template v-if="currentRole === 'ROLE_ADMINISTRATOR'">
                    <b-button
                      size="sm"
                      squared
                      title="Delete product"
                      variant="light"
                      @click="deleteProduct(prd.productId)"
                    >
                      <b-icon icon="archive-fill" variant="danger"></b-icon>
                    </b-button>
                  </template>
                  <template
                    v-if="
                      currentRole === 'ROLE_ADMINISTRATOR' ||
                      currentRole === 'ROLE_MANAGER'
                    "
                  >
                    <b-button
                      size="sm"
                      squared
                      title="Show history product"
                      variant="light"
                      data-toggle="modal"
                      data-target="#productLogModal"
                      @click="getListProductLogById(prd.productId)"
                    >
                      <b-icon icon="clock-history" variant="dark"></b-icon>
                    </b-button>
                  </template>
                </b-button-group>
              </b-card>
            </b-col>
          </template>
        </div>
      </div>
      <div
        class="modal fade"
        id="categoryDetailModal"
        tabindex="-1"
        aria-labelledby="categoryDetailModal"
        aria-hidden="true"
        data-backdrop="static"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="categoryDetailModalLabel">CATEGORY DETAIL</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    readonly
                    v-model="categoryModelEdit.categoryId"
                  />
                  <hr class="my-4" />
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        type="text"
                        class="form-control"
                        required
                        v-model="categoryModelEdit.categoryName"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                class="btn btn-success btn-sm"
                @click="editCategory()"
              >
                <b-icon icon="box-arrow-in-down-right"></b-icon>SAVE CHANGE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal add new product-->
      <div
        class="modal fade"
        id="addNewProducModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="addNewProducModal"
        aria-hidden="false"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 v-if="modeAddForm == true" id="title-form" class="modal-title">
                ADD NEW PRODUCT
              </h5>
              <h5 v-if="modeEditForm == true" id="title-form" class="modal-title">
                UPDATE INFO PRODUCT
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="clearData()"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group row" style="display: none">
                <label for="inputPassword" class="col-sm-4 col-form-label">
                  <b-icon icon="code"></b-icon>
                  Product Id
                </label>
                <div class="col-sm-7">
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    v-model="product.productId"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-4 col-form-label">
                  <b-icon icon="tag-fill"></b-icon>
                  Category
                </label>
                <div class="col-sm-7">
                  <div>
                    <ValidationProvider rules="required">
                      <div slot-scope="{ errors }">
                        <select
                          class="form-select"
                          id="selectCategory"
                          v-model="product.categoryId"
                        >
                          <option value="">Select one</option>
                          <option
                            v-for="ctg in listCategory"
                            :key="ctg.idCategory"
                            :selected="ctg.idCategory == product.categoryId"
                            :value="ctg.idCategory"
                            :label="ctg.categoryName"
                          ></option>
                        </select>
                        <p>{{ errors[0] }}</p>
                      </div>
                    </ValidationProvider>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-4 col-form-label">
                  <b-icon icon="box"></b-icon>
                  Product name
                </label>
                <div class="col-sm-7" style="text-align: left">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Entry name of product"
                        maxlength="100"
                        v-model="product.productName"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-4 col-form-label">
                  <b-icon icon="image-fill"></b-icon>
                  Choose image
                </label>
                <input
                  class="form-control col-sm-7"
                  ref="fileInput"
                  type="file"
                  @change="pickFile"
                />
                <hr class="my-2" />
                <div
                  class="imagePreviewWrapper"
                  :style="{ 'background-image': `url(${selectedFile})` }"
                  @click="selectImage"
                ></div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-4 col-form-label">
                  <b-icon icon="cash"></b-icon>
                  Price
                </label>
                <div class="col-sm-4">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }" id="priceDiv">
                      <b-input
                        class="form-control"
                        ref="input"
                        v-money="money"
                        @input="changePrice($event)"
                        v-model.lazy="product.price"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
                <h4 v-if="modeEditForm == true" id="label-price" class="text col-sm-3">
                  {{ labelPrice }}
                </h4>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-success btn-sm" @click="saveProduct()">
                <b-icon icon="box-arrow-in-down-right"></b-icon>SAVE CHANGE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!--Modal product log-->
      <div
        class="modal fade"
        id="productLogModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="productLogModal"
        aria-hidden="false"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="title-form" class="modal-title">PRODUCT HISTORY CHANGES</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <b-table
                style="font-size = 13"
                head-variant="dark"
                id="my-table"
                responsive="sm"
                striped
                hover
                small
                sort-icon-left
                show-empty
                :items="productLogList"
                :fields="productLogFieds"
                :per-page="perPage"
                :current-page="currentPage"
              >
                <template v-slot:cell(action)="row">
                  <template v-if="!row.detailsShowing">
                    <b-button
                      size="sm"
                      @click="
                        row.toggleDetails();
                        getDetailLog(row);
                      "
                      class="mr-2"
                      id="btn-detail-log-showing"
                      variant="light"
                    >
                      <b-icon icon="caret-down-fill" variant="dark" size="sm"></b-icon>
                    </b-button>
                  </template>
                  <template v-else>
                    <b-button variant="light" size="sm" @click="row.toggleDetails()"
                      ><b-icon icon="caret-up-fill" variant="dark" size="sm"></b-icon
                    ></b-button>
                  </template>
                </template>
                <template #row-details>
                  <div class="col-sm">
                    <template
                      v-if="
                        detailLog.previousDetail != null ||
                        detailLog.currentDetail != null
                      "
                    >
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">ADDITIONAL INFO</th>
                            <th scope="col">PREVIOUS</th>
                            <th scope="col">CURRENT</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td scope="row">Image</td>
                            <td v-if="detailLog.previousDetail.image != null">
                              <img
                                class="card-img-top"
                                style="height: 10rem; width: 10rem; float: left"
                                :src="detailLog.previousDetail.image"
                              />
                            </td>
                            <td v-else>-</td>
                            <td>
                              <img
                                class="card-img-top"
                                style="height: 10rem; width: 10rem; float: left"
                                :src="detailLog.currentDetail.image"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td scope="row">Product Id</td>
                            <td v-if="detailLog.previousDetail.productId != null">
                              <label> {{ detailLog.previousDetail.productId }} </label>
                            </td>
                            <td v-else>-</td>
                            <td>
                              <label
                                class="different-content"
                                v-if="
                                  detailLog.currentDetail.productId !=
                                  detailLog.previousDetail.productId
                                "
                              >
                                {{ detailLog.currentDetail.productId }}</label
                              >
                              <label v-else>
                                {{ detailLog.currentDetail.productId }}</label
                              >
                            </td>
                          </tr>
                          <tr>
                            <td scope="row">Product Name</td>
                            <td v-if="detailLog.previousDetail.productName != null">
                              <label> {{ detailLog.previousDetail.productName }} </label>
                            </td>
                            <td v-else>-</td>
                            <td>
                              <label
                                class="different-content"
                                v-if="
                                  detailLog.currentDetail.productName !=
                                  detailLog.previousDetail.productName
                                "
                              >
                                {{ detailLog.currentDetail.productName }}</label
                              >
                              <label v-else>
                                {{ detailLog.currentDetail.productName }}</label
                              >
                            </td>
                          </tr>
                          <tr>
                            <td scope="row">Price</td>
                            <td v-if="detailLog.previousDetail.price != null">
                              <label>{{ detailLog.previousDetail.price }}</label>
                            </td>
                            <td v-else>-</td>
                            <td>
                              <label
                                class="different-content"
                                v-if="
                                  detailLog.previousDetail.price !=
                                  detailLog.currentDetail.price
                                "
                                >{{ detailLog.currentDetail.price }}</label
                              >
                              <label v-else>{{ detailLog.currentDetail.price }}</label>
                            </td>
                          </tr>
                          <tr>
                            <td scope="row">Create By</td>
                            <td v-if="detailLog.previousDetail.createBy != null">
                              <label>{{ detailLog.previousDetail.createBy }}</label>
                            </td>
                            <td v-else>-</td>
                            <td>
                              <label
                                class="different-content"
                                v-if="
                                  detailLog.currentDetail.createBy !=
                                  detailLog.previousDetail.createBy
                                "
                                >{{ detailLog.currentDetail.createBy }}</label
                              >
                              <label v-else>{{ detailLog.currentDetail.createBy }}</label>
                            </td>
                          </tr>
                          <tr>
                            <td scope="row">Create Date</td>
                            <td v-if="detailLog.previousDetail.createDate != null">
                              <label>{{ detailLog.previousDetail.createDate }}</label>
                            </td>
                            <td v-else>-</td>
                            <td>
                              <label
                                class="different-content"
                                v-if="
                                  detailLog.currentDetail.createDate !=
                                  detailLog.previousDetail.createDate
                                "
                                >{{ detailLog.currentDetail.createDate }}</label
                              >
                              <label v-else>{{
                                detailLog.currentDetail.createDate
                              }}</label>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </template>
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import http from "../axios/http-common";
import { parse } from "vue-currency-input";
import { extend } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import { VMoney } from "v-money";

// Add the required rule
extend("required", {
  ...required,
  message: "This field is required.",
});
export default {
  data() {
    return {
      criteria: "",
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      accountCurrent: JSON.parse(localStorage.getItem("user")).accountId,
      userCurrent: JSON.parse(localStorage.getItem("user")).userName,
      labelPrice: "",
      money: {
        thousands: ",",
        precision: 2,
        masked: true /* doesn't work with directive */,
      },
      listCategory: [],
      listProduct: [],
      productLogList: [],
      detailLog: {
        currentDetail: {
          productId: "",
          productName: "",
          image: "",
          price: "",
          createBy: "",
          createDate: "",
        },
        previousDetail: {
          productId: "",
          productName: "",
          image: "",
          price: "",
          createBy: "",
          createDate: "",
        },
      },
      categoryModelEdit: {
        categoryId: "",
        categoryName: "",
      },
      categoryModelAdd: {
        categoryId: "",
        categoryName: "",
      },
      product: {
        productId: "",
        categoryId: "",
        productName: "",
        price: "",
        seqId: "",
        priceFormatString: "",
      },
      productLogFieds: [
        { key: "action", sortable: false },
        { key: "logDate", sortable: true },
        { key: "actionUser", sortable: true },
        { key: "createBy", sortable: true },
      ],
      checked: false,
      selectedFile: null,
      show: true,
      sortBy: "createDate",
      sortDesc: true,
      perPage: 50,
      currentPage: 1,
      modeAddForm: false,
      modeEditForm: false,
    };
  },

  directives: { money: VMoney },
  mounted() {
    $("#loading").hide();
    this.checkLocalStorage();
    this.getAllCategories();
    this.getProducts();
  },

  computed: {
    // options() {
    //   return {
    //     locale: "vn-VN",
    //     currency: "VND",
    //     precision: 2,
    //     hideCurrencySymbolOnFocus: true,
    //     hideGroupingSeparatorOnFocus: true,
    //     hideNegligibleDecimalDigitsOnFocus: true,
    //     autoDecimalDigits: false,
    //     exportValueAsInteger: true,
    //     autoSign: false,
    //     useGrouping: true,
    //   };
    // },
    rows() {
      return this.productLogList.length;
    },
    convertValueToInt() {
      return parse(this.product.price, this.options);
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
    // get list category
    getAllCategories() {
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
            this.show = false;
          }
        })
        .catch((error) => {
          this.$router.push({
            name: "Login",
          });
          this.show = false;
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
        .get("/product/api/get-all-products/" + this.accountCurrent)
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

          this.$router.push({
            name: "NotFound",
          });
        });
    },

    callBackCategories() {
      this.getAllCategories();
    },

    callBackProducts() {
      this.getProducts();
    },

    // save category
    saveCategory() {
      var request = {
        categoryId: "",
        categoryName: this.categoryModelAdd.categoryName,
      };
      if (request.categoryName != "") {
        http
          .post("/category/api/save-category/" + this.accountCurrent, request)
          .then((response) => {
            if (response.status == "200") {
              this.listCategory.push(request);
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Successfully. !!!",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
              this.categoryModelAdd.categoryName = "";
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
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to save category",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
        $("button.close").click();
      }
    },

    // edit category
    bindingData(object) {
      this.categoryModelEdit.categoryId = object.idCategory;
      this.categoryModelEdit.categoryName = object.categoryName;
    },

    clearData() {
      $("#selectCategory").css("display", "block");
      $("#inputCategory").css("display", "none");
      $("#checkBoxEditMode").css("display", "none");
      $("#priceDiv").css("display", "block");
      $("#price-format-string").css("display", "none");
      this.product.productId = "";
      this.product.productName = "";
      this.product.categoryId = "";
      this.selectedFile = "";
      this.product.price = "";
      this.labelPrice = "";
      this.modeAddForm = true;
      this.modeEditForm = false;
    },

    // save after edit
    editCategory() {
      var request = {
        categoryId: this.categoryModelEdit.categoryId,
        categoryName: this.categoryModelEdit.categoryName,
      };
      if (request.categoryName != "") {
        http
          .post("/category/api/save-category/" + this.accountCurrent, request)
          .then((response) => {
            if (response.status == "200") {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title:
                  "Change " + this.categoryModelEdit.categoryName + " successfully. !!!",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
              this.callBackCategories();
              this.callBackProducts();
              $("button.close").click();
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
            $(".modal").hide();
            $(".modal-backdrop").css("display", "none");
          });
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to save category",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
        $("button.close").click();
      }
    },

    // delete category
    deleteCategory(categoryId) {
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
              "/category/api/delete-category/" + categoryId + "/" + this.accountCurrent
            )
            .then((response) => {
              if (response.status == "200") {
                this.$swal("Deleted!", "Your category has been deleted.", "success");
                this.callBackCategories();
                this.callBackProducts();
              } else {
                this.$swal({
                  toast: true,
                  showProgressBar: true,
                  position: "top-end",
                  title: "An error occured: " + error,
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
                title: "An error occured: " + error,
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
              this.$router({
                name: "NotFound",
              });
              $("button.close").click();
            });
        }
      });
    },

    // save product
    saveProduct() {
      var request = {
        productId: this.product.productId,
        categoryId: this.product.categoryId,
        productName: this.product.productName,
        image: this.selectedFile,
        seqId: parseInt(this.product.seqId) || 1,
        price: this.product.price,
        createBy: this.userCurrent,
        createDate: "",
      };
      if (request.categoryId != "" && request.productName != "" && request.price != "") {
        http
          .post("/product/api/save-product/" + this.accountCurrent, request)
          .then((response) => {
            if (response.status == "200") {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Successfully ...!!!",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
              this.callBackProducts();
              $("button.close").click();
            } else {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Failed ...!!!",
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
              $("button.close").click();
            }
          })
          .catch((error) => {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "An error occured: " + error,
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            $("button.close").click();
          });
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to save product",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
        $("button.close").click();
      }
    },

    // binding data product
    bindingDataProduct(productId) {
      $("#addNewProductModal").css("display", "block");
      http
        .get("/product/api/get-product-by-id/" + productId + "/" + this.accountCurrent)
        .then((response) => {
          if (response.status == "200") {
            this.product.categoryId = response.data.categoryId;
            this.product.productId = response.data.productId;
            this.product.productName = response.data.productName;
            this.product.price = response.data.price;
            this.product.imageContent = response.data.imageContent;
            this.product.createBy = response.data.c;
            this.product.createDate = response.data.createBy;
            this.product.seqId = parseInt(response.data.seqId);
            this.selectedFile = response.data.imageContent;
            this.modeAddForm = false;
            this.modeEditForm = true;
            this.labelPrice = response.data.price;
          }
        })
        .catch((error) => {
          this.$swal({
            toast: true,
            showProgressBar: true,
            position: "top-end",
            title: "An error occured: " + error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
        });
    },

    // delete product
    deleteProduct(productId) {
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
              "/product/api/delete-product/" + productId + "/" + this.accountCurrent
            )
            .then((response) => {
              if (response.status == "200") {
                this.$swal("Deleted!", "Your category has been deleted.", "success");
                this.callBackCategories();
                this.callBackProducts();
              } else {
                this.$swal({
                  toast: true,
                  showProgressBar: true,
                  position: "top-end",
                  title: "An error occured: " + error,
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
                title: "An error occured: " + error,
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
              this.$router({
                name: "NotFound",
              });
            });
        }
      });
    },

    // get all product by category
    getProductByCategoryId(pCategoryId) {
      this.show = true;
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
          this.$router.push({
            name: "NotFound",
          });
        });
    },

    // get all product by name
    getProductsByName() {
      this.show = true;
      var pProductName = this.criteria;
      if (pProductName != "") {
        http
          .get(
            "/product/api/get-products-by-name/" +
              this.accountCurrent +
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
          });
      } else {
        this.callBackProducts();
      }
    },

    selectImage() {
      this.$refs.fileInput.click();
    },

    pickFile(event) {
      this.selectedFile = event.target.files[0];
      let input = this.$refs.fileInput;
      let file = input.files;
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFile = e.target.result;
        };
        reader.readAsDataURL(file[0]);
        this.$emit("input", file[0]);
      }
    },

    changePrice(value) {
      if (value == "0.00") {
        $("#label-price").removeClass("text-decoration-line");
      } else {
        $("#label-price").addClass("text-decoration-line");
      }
    },

    getListProductLogById(productId) {
      http
        .get(
          "/product-log/api/get-list-product-log/" + this.accountCurrent + "/" + productId
        )
        .then((response) => {
          if (response.status == "200") {
            this.productLogList = response.data;
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
        });
    },

    getDetailLog(row) {
      this.show = true;
      $("tr.b-table-details").remove();
      $("tr.b-table-has-details").find("button").click();
      http
        .get(
          "/product-log/api/get-product-log-detail/" +
            this.accountCurrent +
            "/" +
            row.item.productId +
            "/" +
            parseInt(row.item.seqId)
        )
        .then((response) => {
          if (response.status == "200") {
            this.detailLog.currentDetail = response.data.current;
            this.detailLog.previousDetail = response.data.previous;
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
        });
      this.show = false;
    },
  },
};
</script>

<style scoped>
button {
  text-align: left;
  height: 30px;
}
.imagePreviewWrapper {
  width: 250px;
  height: 250px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
  background-size: cover;
  background-position: center center;
}
img {
  height: 10rem;
  width: 14rem;
}

label {
  font-size: 13;
  margin-left: 5px;
  font-family: Tahoma;
}

.card-body {
  width: 14rem;
  height: fit-content;
}
.card {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: transparent;
  width: 14rem;
  height: fit-content;
  padding: auto;
  margin: 20px auto auto auto;
}

p {
  font-size: 13px;
}

h4.card-title {
  font-size: 14px;
  font-weight: bold;
  font-family: "Lucida Bright";
}

#input-search {
  height: 30px;
}

.different-content {
  color: red;
}
.form-row-left {
  display: flex;
  flex-wrap: wrap;
  float: left;
  margin-left: -5px;
}

.form-row-right {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  float: left;
  right: 0;
}

.text-decoration-line {
  text-decoration-line: line-through;
}
</style>
>
