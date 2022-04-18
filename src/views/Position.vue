<template>
  <div class="content">
    <b-overlay :show="show" rounded="sm">
      <b-row>
        <b-col>
          <h5>
            <b-icon icon="map"></b-icon>
            POSITION AVAILABLE
          </h5>
        </b-col>
        <b-col>
          <b-button-group>
            <b-button squared variant="outline-success" @click="getPositionsOpening()">
              <b-icon
                icon="circle-fill"
                animation="throb"
                font-scale="1"
                variant="success"
              ></b-icon>
              OPENING : {{ isOpening }}
            </b-button>
            <b-button squared variant="outline-danger" @click="getPositionsClosed()">
              <b-icon icon="x-circle-fill" font-scale="1" variant="danger"></b-icon>
              CLOSED : {{ isClosed }}
            </b-button>
            <b-button squared variant="outline-primary" @click="getPosition()">
              <b-icon icon="arrow-clockwise" font-scale="1" variant="primary"></b-icon>
              Refresh
            </b-button>
          </b-button-group>
        </b-col>
        <b-col></b-col>
        <b-col></b-col>
        <b-col style="text-align: right">
          <b-button-group>
            <button
              type="button"
              class="btn btn-warning"
              data-toggle="modal"
              data-target="#listOrderPendingModal"
              @click="getListOrderPending()"
            >
              <b-icon icon="diagram3-fill" font-scale="1" variant="dark"></b-icon>
              ORDERED QUEUE
            </button>
          </b-button-group>
        </b-col>
      </b-row>
      <hr class="my-2" />

      <!-- Card detail table -->
      <div class="row">
        <template>
          <div
            v-for="p in positions"
            class="col-md-3"
            style="margin-top: 25px"
            v-bind:key="p.positionId"
          >
            <div class="card" style="border: 0.5px solid #a9a6a6; boder-radius: 0.5rem">
              <div v-if="p.positionStatus == 'CLOSED'" class="card-header">
                {{ p.positionName }}
              </div>
              <div v-else class="card-header card-success">{{ p.positionName }}</div>
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
              <div class="card-footer">
                <div class="row">
                  <template v-if="p.positionStatus === 'OPENING'">
                    <div class="col-sm-7">
                      <strong>{{ p.positionStatus }}</strong>
                      <b-icon
                        style="margin-left: 5px"
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
                      <b-icon
                        style="margin-left: 5px"
                        icon="x-circle-fill"
                        font-scale="1"
                        variant="danger"
                      ></b-icon>
                    </div>
                  </template>
                  <div class="col-sm-5">
                    <b-button
                      block
                      squared
                      variant="outline-dark"
                      title="Go to detail"
                      @click="goToPageOrder(p)"
                    >
                      <b-icon variant="info" icon="power"></b-icon>
                      OPEN
                    </b-button>
                  </div>
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
              </div>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <b-overlay :show="load" rounded="sm">
              <div class="modal-body">
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
                  :items="listOrderPending"
                  :fields="fieldsPending"
                  :per-page="perPage"
                  :current-page="currentPage"
                >
                  <template v-slot:cell(quantity)="data">
                    <template v-if="data.value >= 4">
                      <b-icon icon="chevron-double-up" variant="danger"></b-icon>
                      {{ data.value }}
                    </template>
                    <template v-else-if="data.value <= 3 && data.value > 1">
                      <b-icon icon="chevron-up" variant="success"></b-icon>
                      {{ data.value }}
                    </template>
                    <template v-else>{{ data.value }}</template>
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button
                      squared
                      size="sm"
                      variant="success"
                      @click="checkDone(data.item)"
                    >
                      <b-icon icon="check-circle"></b-icon> Check out
                    </b-button>
                  </template>
                </b-table>
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
            </b-overlay>
          </div>
        </div>
      </div>
    </b-overlay>
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
      fieldsPending: [
        { key: "tableId", sortable: true },
        { key: "productName", sortable: true },
        { key: "quantity", sortable: true },
        { key: "status", sortable: true },
        { key: "createBy", sortable: true },
        { key: "createDate", sortable: true },
        { key: "action", sortable: false },
      ],
      currentPage: 1,
      perPage: 25,
      show: true,
      load: false,
    };
  },

  mounted() {
    this.checkLocalStorage();
    this.getPosition();
  },

  computed: {
    rows() {
      return this.listOrderPending.length;
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

    // get all position available
    getPositionsOpening() {
      $("#loading").show();
      http
        .get("/position/api/get-positions-opening/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.positions = response.data.positions;
            this.isOpening = response.data.isOpening;
            this.isClosed = response.data.isClosed;
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

    // get all position available
    getPositionsClosed() {
      $("#loading").show();
      http
        .get("/position/api/get-positions-closed/" + this.accountUserValid)
        .then((response) => {
          if (response.status == "200") {
            this.positions = response.data.positions;
            this.isOpening = response.data.isOpening;
            this.isClosed = response.data.isClosed;
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
      this.load = true;
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
            this.load = false;
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
          this.load = true;
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
ul,
li,
strong,
h6 {
  color: black;
}

.card-order {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: auto;
  text-align: center;
  background-color: transparent;
  padding: 30px;
  height: 200px;
}

.card-footer {
  background-color: whitesmoke;
}

.card-success {
  background-color: #28a745 !important;
}

#input-quantity {
  width: 70px;
  height: 30px;
  font-size: 13px;
  text-align: center;
}

.modal-xl {
  max-width: auto;
  font-size: 13px;
  height: auto;
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
