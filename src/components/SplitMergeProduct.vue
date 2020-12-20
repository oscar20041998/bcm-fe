<template>
  <b-modal
    id="modal-xl"
    size="xl"
    title="Split or Merge product to new position"
    no-close-on-backdrop
  >
    <b-row>
      <b-col>{{ table.positionId }}</b-col>
      <b-col>
        <b-form-group
          label="Select mode:"
          label-for="table-select-mode-select"
          label-cols-md="4"
        >
          <b-form-select
            id="table-select-mode-select"
            v-model="selectMode"
            :options="modes"
            class="mb-3"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col
        ><select
          data-toggle="tooltip"
          data-placement="top"
          title="Select to move to new position"
          class="form-control input-sm"
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
    <div class="region-button-select">
      <b-row>
        <b-button-group>
          <b-button size="sm" @click="selectAllRows">Select all</b-button>
          <b-button size="sm" @click="clearSelected">Clear selected</b-button>
        </b-button-group>
      </b-row>
    </div>
    <b-row>
      <b-col>
        <div class="region-table">
          <b-table
            :items="listOrder"
            :fields="fieldsOrder"
            head-variant="dark"
            id="my-table-systemLogList"
            responsive="md"
            sticky-header
            striped
            hover
            small
            show-empty
            :select-mode="selectMode"
            ref="selectableTable"
            selectable
            @row-selected="onRowSelected"
          >
            <template #cell(selected)="{ rowSelected }">
              <template v-if="rowSelected">
                <b-icon icon="check-circle-fill" variant="success"></b-icon>
                <span class="sr-only">Selected</span>
              </template>
              <template v-else>
                <span aria-hidden="true">&nbsp;</span>
                <span class="sr-only">Not selected</span>
              </template>
            </template>
          </b-table>
        </div>
      </b-col>
      <b-col>
        <div class="region-table">
          <b-table
            :items="listSplit"
            :fields="fieldsSplit"
            head-variant="dark"
            id="my-table-systemLogList"
            responsive="md"
            sticky-header
            striped
            hover
            small
            show-empty
          ></b-table>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>
<script>
import http from "../axios/http-common";
export default {
  data() {
    return {
      listOrder: [],
      listSplit: [],
      listSelected: [],
      positions: [],
      table: JSON.parse(localStorage.getItem("table")),
      userName: JSON.parse(localStorage.getItem("user")).userName,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
      fieldsOrder: [
        { key: "selected", sortable: false },
        { key: "productName", sortable: true },
        { key: "quantity", sortable: true },
        { key: "priceConvert", sortable: true, label: "Price" },
      ],
      fieldsSplit: [
        { key: "productName", sortable: true },
        { key: "quantity", sortable: true },
        { key: "priceConvert", sortable: true, label: "Price" },
      ],
      modes: ["single", "multi"],
      selectedRows: [],
      selectMode: "single",
      totalPrice: "",
      positionSelected: "",
    };
  },

  mounted() {
    this.getListOrderByTable(this.table.positionId);
    this.getPosition();
  },

  methods: {
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
            this.listOrder = response.data.listOrder;
            this.totalPrice = response.data.totalPrice || 0;
            localStorage.setItem("orderInfo", JSON.stringify(response.data));
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

    // when click select row
    onRowSelected(items) {
      var temListOrder = this.listOrder;
      var temSplitOrder = this.listSplit;
      $.each(items, function (i, e) {
        temSplitOrder.push(e);
        $.each(temListOrder, function (ii, ee) {
          if (ee.productName === e.productName) {
            temListOrder.splice(ii, 1);
          }
        });
      });
    },

    // select all row
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },

    // clear all selected
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
  },
};
</script>
<style lang="scss" scoped>
.region-button-select {
  margin: 0px 10px 10px 20px;
}

.region-table {
  font-size: 13px;
}
</style>
>
