<template>
  <div class="jumbotron">
    <b-overlay :show="show" rounded="sm">
      <b-row>
        <b-col>
          <h5>
            <b-icon icon="cup"></b-icon>
            FOOD & DRINK MANAGEMENT
          </h5>
        </b-col>
        <b-col>
          <b-button-group>
            <b-button
              squared
              v-b-toggle.sidebar-footer
              title="Show category"
              variant="light"
            >
              <b-icon icon="card-text" variant="dark"></b-icon> SHOW CATEGORY
            </b-button>

            <template v-if="currentRole == 'ROLE_ADMINISTRATOR'">
              <b-button
                squared
                variant="success"
                data-toggle="modal"
                data-target="#addNewProducModal"
                @click="clearData()"
              >
                <b-icon icon="plus-circle"></b-icon> ADD NEW PRODUCT
              </b-button>
            </template>
          </b-button-group>
        </b-col>
        <b-col></b-col>
        <b-col></b-col>
        <b-col>
          <b-input
            id="input-search"
            class="form-control"
            type="search"
            size="sm"
            placeholder="Search"
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
            <h5 style="color: black; text-algin: left">CATEGORY AVAILABLE</h5>
            <hr class="my-4" />
            <b-button block variant="light" @click="callBackProducts()">
              <b-icon icon="star-fill" variant="dark"></b-icon> All
            </b-button>
            <template>
              <b-list-group v-for="c in listCategory" :key="c.idCategory">
                <div class="row">
                  <div class="col-sm-8">
                    <b-button
                      block
                      variant="light"
                      v-model="categoryModelEdit.categoryId"
                      @click="getProductByCategoryId(c.idCategory)"
                    >
                      <b-icon icon="star-fill" variant="dark"></b-icon>
                      {{ c.categoryName }}
                    </b-button>
                  </div>
                  <template v-if="currentRole === 'ROLE_ADMINISTRATOR'">
                    <div class="col-sm-2">
                      <b-button
                        variant="light"
                        title="Delete category"
                        @click="deleteCategory(c.idCategory)"
                      >
                        <b-icon icon="trash-fill" variant="danger"></b-icon>
                      </b-button>
                    </div>
                    <div class="col-sm-2">
                      <b-button
                        variant="light"
                        title="Edit this category"
                        data-toggle="modal"
                        data-target="#categoryDetailModal"
                        @click="bindingData(c)"
                      >
                        <b-icon icon=" pen"> </b-icon>
                      </b-button>
                    </div>
                  </template>
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
        </b-sidebar>
      </div>
      <div style="height: 670px; min-height: 10px; overflow-x: scroll">
        <b-row>
          <template v-for="prd in listProduct">
            <b-col :key="prd.productId">
              <b-card
                v-bind:key="prd.productId"
                :title="prd.productName"
                :img-src="prd.imageContent"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem"
                class="mb-2"
              >
                <b-card-text>
                  {{ prd.priceFormatString }}
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
                </b-button-group>
              </b-card>
            </b-col>
          </template>
        </b-row>
      </div>

      <!-- <b-button-group>
                      <b-button
                        size="sm"
                        block
                        squared
                        variant="light"
                        @click="bindingDataProduct(prd.productId)"
                      >
                        <b-icon variant="primary" icon="pen-fill"></b-icon>
                      </b-button>
                      <template v-if="currentRole === 'ROLE_ADMINISTRATOR'">
                        <b-button
                          size="sm"
                          block
                          squared
                          variant="light"
                          @click="deleteProduct(prd.productId)"
                        >
                          <b-icon icon="archive-fill" variant="danger"></b-icon>
                        </b-button>
                      </template>
                    </b-button-group> -->

      <!-- Modal category-->
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
        <div class="modal-dialog modal-md" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="title-form" class="modal-title">ADD NEW/ UPDATE PRODUCT</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group row" style="display: none">
                <label for="inputPassword" class="col-sm-4 col-form-label">
                  <b-icon icon="code"></b-icon>
                  Product Id
                </label>
                <div class="col-sm-8">
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
                <div class="col-sm-8">
                  <div>
                    <ValidationProvider rules="required">
                      <div slot-scope="{ errors }">
                        <select
                          class="form-control"
                          id="selectCategory"
                          v-model="product.categoryId"
                        >
                          <option
                            v-for="ctg in listCategory"
                            selected="ctg.categoryId"
                            :key="ctg.idCategory"
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
                <div class="col-sm-8" style="text-align: left">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Entry name of product"
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
                <input ref="fileInput" type="file" @change="pickFile" />
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
                  <h5 id="price-format-string" style="display: block">
                    {{ product.priceFormatString }}
                  </h5>
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }" id="priceDiv" style="display: none">
                      <b-input
                        class="form-control"
                        ref="input"
                        v-model="product.price"
                        v-mask="'###,###,###,###'"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-sm-4">
                  <b-form-checkbox
                    id="checkBoxEditMode"
                    v-model="checked"
                    name="check-button"
                    switch
                    @change="showEditPrice($event)"
                  >
                    Edit mode
                  </b-form-checkbox>
                </div>
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
    </b-overlay>
  </div>
</template>

<script>
import http from "../axios/http-common";
import { parse } from "vue-currency-input";
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
      criteria: "",
      currentRole: JSON.parse(localStorage.getItem("user")).roleCode,
      accountCurrent: JSON.parse(localStorage.getItem("user")).accountId,
      userCurrent: JSON.parse(localStorage.getItem("user")).userName,
      listCategory: [],
      listProduct: [],
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
        priceFormatString: "",
      },
      checked: false,
      selectedFile: null,
      show: true,
    };
  },

  mounted() {
    $("#loading").hide();
    this.checkLocalStorage();
    this.getAllCategories();
    this.getProducts();
  },

  computed: {
    options() {
      return {
        distractionFree: false,
        currency: "VND",
        valueAsInteger: true,
        autoDecimalMode: true,
      };
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
        $(".modal").hide();
        $(".modal-backdrop").css("display", "none");
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
      this.selectedFile = null;
      this.product.price = "";
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
              $(".modal").hide();
              $(".modal-backdrop").css("display", "none");
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
        $(".modal").hide();
        $(".modal-backdrop").css("display", "none");
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
              $(".modal").hide();
              $(".modal-backdrop").css("display", "none");
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
              $(".modal").hide();
              $(".modal-backdrop").css("display", "none");
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
              $(".modal").hide();
              $(".modal-backdrop").css("display", "none");
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
            $(".modal").hide();
            $(".modal-backdrop").css("display", "none");
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
        $(".modal").hide();
        $(".modal-backdrop").css("display", "none");
      }
    },

    // binding data product
    bindingDataProduct(productId) {
      $("#addNewProductModal").css("display", "block");
      http
        .get("/product/api/get-product-by-id/" + productId + "/" + this.accountCurrent)
        .then((response) => {
          if (response.status == "200") {
            this.product = response.data;
            this.selectedFile = response.data.imageContent;
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

    // show input edit price
    showEditPrice: function (event) {
      if (event == true) {
        $("#priceDiv").css("display", "block");
        $("#price-format-string").css("display", "none");
      } else {
        $("#priceDiv").css("display", "none");
        $("#price-format-string").css("display", "block");
      }
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
  width: 19rem;
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

p {
  font-size: 13px;
}
#input-search {
  height: 30px;
}
</style>
>
