<template>
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-3">
        <h5>
          <b-icon icon="map"></b-icon>
          POSITION AVAILABLE
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
    <div class="row" style="height: 670px; min-height: 10px; overflow-y: scroll">
      <template v-for="p in positions">
        <div class="col-md-3" style="margin-top: 25px" v-bind:key="p.positionId">
          <div class="card">
            <div class="card-header">{{ p.positionName }}</div>
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
                <div class="col-sm-7">
                  <strong>{{ p.positionStatus }}</strong>
                  <b-icon
                    icon="circle-fill"
                    animation="throb"
                    font-scale="1"
                    variant="success"
                  ></b-icon>
                </div>
              </template>
              <template v-else>
                <div class="col-sm-7">
                  <strong>{{ p.positionStatus }}</strong>
                  <b-icon icon="x-circle-fill" font-scale="1" variant="danger"></b-icon>
                </div>
              </template>
              <div class="col-sm-5">
                <b-button
                  block
                  variant="light"
                  title="Go to detail"
                  @click="goToPageOrder(p)"
                >
                  <b-icon icon="power"></b-icon>
                  OPEN
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <!------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
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
                <h5 id="title-form" class="modal-title">LIST ORDER PRODUCT PENDING</h5>
              </div>
              <div class="col-sm-1" id="div-spinner-check-done" style="display: none">
                <b-spinner class="m-3" label="Busy"></b-spinner>
              </div>
            </div>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
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
                        <b-icon icon="chevron-double-up" variant="danger"></b-icon>
                      </template>
                      <template v-else-if="prd.quantity <= 3 && prd.quantity > 1">
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
      listOrderPending: [],
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

    // get list order is pending
    getListOrderPending() {
      $("#loading").css("display", "block");
      http
        .get("/order-product/api/get-order-product-pending/" + this.accountUserValid)
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

    // go to page order
    // param: object
    goToPageOrder(object) {
      localStorage.setItem("table", JSON.stringify(object));
      this.$router.push({ name: "OrderProduct" });
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

button {
  text-align: center;
}
</style>
>
