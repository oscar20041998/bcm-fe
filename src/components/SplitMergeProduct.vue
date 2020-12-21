<template>
  <b-modal
    id="modal-xl"
    size="xl"
    title="PRODUCTION SPLIT"
    no-close-on-backdrop
    ok-title="Agree and split"
    ok-variant="success"
    @ok="saveSplitList"
  >
    <b-row>
      <b-col><strong>CURRENT: </strong> {{ table.positionName }}</b-col>
      <b-col> </b-col>
      <b-col><strong>SPLIT TO: </strong> </b-col>
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
            <caption>
              Items sold in August, grouped by Country and City:
            </caption>
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
            :select-mode="selectModeBackList"
            @row-selected="onRowSelectedBackList"
            selectable
            ref="selecttableTableBackList"
            head-variant="dark"
            id="my-table-systemLogList"
            responsive="md"
            sticky-header
            striped
            hover
            small
            show-empty
          >
            <template #cell(selected)="{ rowSelected }">
              <template v-if="rowSelected">
                <b-icon icon="x-circle-fill" variant="danger"></b-icon>
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
      listBack: [],
      positions: [],
      table: JSON.parse(localStorage.getItem("table")),
      userName: JSON.parse(localStorage.getItem("user")).userName,
      accountUserValid: JSON.parse(localStorage.getItem("user")).accountId,
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
      modes: ["single", "multi"],
      selectedRows: [],
      selectMode: "single",
      selectModeBackList: "single",
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

    // revert product into list order product
    onRowSelectedBackList(items) {
      var temListOrder = this.listOrder;
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
          this.revertListSplit();
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
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
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
      var data = this.listBack;
      var listOrder = this.listOrder;
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
              showProgressBar: true,
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
<style lang="scss" scoped>
.region-button-select {
  margin: 0px 10px 10px 20px;
}

.region-table {
  font-size: 13px;
}
</style>
>
