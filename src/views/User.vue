<template>
  <b-overlay :show="show" rounded="sm">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <b-icon icon="person-fill"></b-icon>
            USER AVAILABLE
          </h5>
        </div>
        <div class="col-sm-4" style="text-align: right">
          <b-button
            variant="success"
            data-toggle="modal"
            data-target="#addNewUserModal"
            v-on:click="clearData()"
            title="Add new user"
          >
            <b-icon icon="person-plus-fill"></b-icon> ADD NEW
          </b-button>
        </div>
        <div class="col-sm-2">
          <input
            id="input-search"
            class="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="criteria"
            @keyup="searchUser()"
          />
        </div>
        <div class="col-sm-1">
          <b-icon icon="search"></b-icon>
        </div>
      </div>
      <hr class="my-4" />
      <div class="card-body">
        <div class="user-div">
          <b-table
            :items="listUser"
            :fields="fields"
            head-variant="dark"
            id="my-table-systemLogList"
            responsive="sm"
            striped
            hover
            small
            :per-page="perPage"
            :current-page="currentPage"
          >
            <template v-slot:cell(option)="data">
              <div class="row">
                <div class="col-md-3">
                  <button
                    class="btn btn-link btn-sm"
                    type="button"
                    @click="clickOnEditUser(data.item.userId)"
                    data-toggle="modal"
                    data-target="#profileUserModal"
                  >
                    <b-icon icon="exclamation-circle-fill" variant="info"></b-icon>
                  </button>
                </div>
                <div class="col-md-3">
                  <button
                    class="btn btn-link btn-sm"
                    @click="clickOnEditUser(data.item.userId)"
                    data-toggle="modal"
                    data-target="#addNewUserModal"
                  >
                    <b-icon icon="pen-fill"></b-icon>
                  </button>
                </div>
                <template v-if="currentRole === 'ROLE_ADMINISTRATOR'">
                  <div class="col-md-3">
                    <button
                      type="button"
                      class="btn btn-link btn-sm"
                      v-on:click="deleteUserById(data.item.userId)"
                    >
                      <b-icon icon="archive-fill" variant="danger"></b-icon>
                    </button>
                  </div>
                </template>
              </div>
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
      </div>

      <!-- Modal object create new user-->
      <div
        class="modal fade"
        id="addNewUserModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="false"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="title-form" class="modal-title">ADD/ UPDATE INFORMATION USER</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group row" id="div_user_id" style="display: none">
                <label for="inputPassword" class="col-sm-2 col-form-label">
                  <b-icon icon="code"></b-icon>
                  User ID
                </label>
                <div class="col-sm-4" style="text-align: left">
                  <input
                    disabled
                    type="text"
                    class="form-control"
                    v-model="profileInfo.userId"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">
                  <b-icon icon="person-square"></b-icon>
                  Full name
                </label>
                <div class="col-sm-3">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-first-name"
                        type="text"
                        class="form-control"
                        v-model="profileInfo.firstName"
                        placeholder="Entry frist name"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-sm-4">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-midle-name"
                        type="text"
                        class="form-control"
                        v-model="profileInfo.midleName"
                        placeholder="Entry midle name"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-sm-3">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-last-name"
                        type="text"
                        class="form-control"
                        v-model="profileInfo.lastName"
                        placeholder="Entry last name"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="calendar2-date"></b-icon>
                  Date of birth
                </label>
                <div class="col-sm-4" style="text-align: left">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="dpDateOfBirth"
                        type="date"
                        class="form-control"
                        v-model="profileInfo.dateOfBirth"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">
                  <b-icon icon="card-heading"></b-icon>
                  Id card
                </label>
                <div class="col-sm-10">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-card-number"
                        type="text"
                        class="form-control"
                        v-model="profileInfo.idCard"
                        maxlength="12"
                        placeholder="Entry id card number"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">
                  <b-icon icon="geo-fill"></b-icon>
                  Address
                </label>
                <div class="col-sm-10">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-address"
                        type="address"
                        class="form-control"
                        v-model="profileInfo.address"
                        placeholder="Entry address"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">
                  <b-icon icon="phone-vibrate"> </b-icon>
                  Phone
                </label>
                <div class="col-sm-10">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-phone-number"
                        type="phone"
                        class="form-control"
                        v-model="profileInfo.phoneNumber"
                        maxlength="11"
                        placeholder="Entry phone number"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div id="div-select-role">
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-2 col-form-label">
                    <b-icon icon="shield-shaded"></b-icon>
                    Role
                  </label>
                  <div class="col-sm-5">
                    <ValidationProvider rules="required">
                      <div slot-scope="{ errors }">
                        <select
                          id="select-role"
                          class="form-control"
                          v-model="profileInfo.role"
                          aria-placeholder="Select a role"
                        >
                          <option value="ROLE_ADMINISTRATOR">Role Administrator</option>
                          <option value="ROLE_MANAGER">Role Manager</option>
                          <option value="ROLE_STAFF">Role Staff</option>
                        </select>
                        <p>{{ errors[0] }}</p>
                      </div>
                    </ValidationProvider>
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">
                  <b-icon icon="mailbox2"></b-icon>
                  Email
                </label>
                <div class="col-sm-10">
                  <ValidationProvider rules="required">
                    <div slot-scope="{ errors }">
                      <input
                        id="input-email"
                        type="email"
                        class="form-control"
                        v-model="profileInfo.email"
                        placeholder="Entry email"
                      />
                      <p>{{ errors[0] }}</p>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-success btn-sm"
                v-on:click="saveNewUser()"
              >
                <b-icon icon="box-arrow-in-down-right"></b-icon>SAVE CHANGE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal profile user-->
      <div
        class="modal fade"
        id="profileUserModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="false"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="title-form" class="modal-title">INFORMATION DETAIL</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="code"></b-icon>
                  User Id
                </label>

                <div class="col-sm-4">
                  {{ profileInfo.userId }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="person-square"></b-icon>
                  Full name
                </label>

                <div class="col-sm-4">
                  {{ profileInfo.fullName }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="calendar2-date"></b-icon>
                  Date of birth
                </label>
                <div class="col-sm-4" style="text-align: left">
                  {{ profileInfo.dateOfBirth }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="card-heading"></b-icon>
                  Id card
                </label>
                <div class="col-sm-6">
                  {{ profileInfo.idCard }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="map"></b-icon>
                  Address
                </label>
                <div class="col-sm-8">
                  {{ profileInfo.address }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="phone-vibrate"> </b-icon>
                  Phone
                </label>
                <div class="col-sm-8">
                  {{ profileInfo.phoneNumber }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="mailbox2"></b-icon>
                  Email
                </label>
                <div class="col-sm-8">
                  {{ profileInfo.email }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="bezier2"></b-icon>
                  Create by
                </label>
                <div class="col-sm-8">
                  {{ profileInfo.createdBy }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label">
                  <b-icon icon="calendar2-check"></b-icon>
                  Create on date
                </label>
                <div class="col-sm-8">
                  {{ profileInfo.createdDate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-overlay>
</template>

<style lang="scss" scoped>
.form-inline {
  text-align: right;
}

.user-div {
  font-size: 13px;
  height: 660px;
}

tbody {
  height: 100px;
  /* Just for the demo          */
  overflow-y: auto;
  /* Trigger vertical scroll    */
  overflow-x: show;
  position: relative;
  font-size: 14px;
}

tr,
td {
  max-width: fit-content;
}

thead,
tbody {
  width: 100%;
  height: 20px;
  font-size: 13px;
}

#input-search {
  height: 30px;
}

.user-div {
  height: 660px;
  font-size: 13px;
}
</style>
>

<script>
import http from "../axios/http-common";
import $ from "jquery";
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
      currentRole: "",
      listUser: [],
      currentPage: 1,
      perPage: 25,
      fields: [
        { key: "userId", sortable: true },
        { key: "fullName", sortable: true },
        { key: "address", sortable: true },
        { key: "phoneNumber", sortable: true },
        { key: "email", sortable: true },
        { key: "createdBy", sortable: true },
        { key: "createdDate", sortable: true },
        "option",
      ],
      // object user
      profileInfo: {
        userId: "",
        firstName: "",
        midleName: "",
        lastName: "",
        fullName: "",
        dateOfBirth: "",
        idCard: "",
        email: "",
        address: "",
        phoneNumber: "",
        createBy: "",
        createDate: "",
        accountId: "",
        userName: "",
        role: "",
        status: "",
        accountCreateBy: "",
        accountCreateDate: "",
      },
      show: false,
      // search criteria
      criteria: "",
    };
  },

  mounted() {
    this.checkLoaclStorage();
    this.getListUser();
  },

  computed: {
    rows() {
      return this.listUser.length;
    },
  },

  methods: {
    // check localstorage
    checkLoaclStorage() {
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

    // get all list user
    getListUser() {
      this.show = true;
      var data = JSON.parse(localStorage.getItem("user"));
      this.currentRole = data.roleCode;
      var accountValid = data.accountId;
      http
        .get("/user/api/get-list-user/" + accountValid)
        .then((response) => {
          if ((response.status = "200")) {
            this.listUser = response.data;
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
          this.$router.push({
            name: "NotFound",
          });
          this.show = false;
        });
    },

    callBack() {
      this.getListUser();
    },

    // save a new user
    saveNewUser() {
      var data = JSON.parse(localStorage.getItem("user"));
      this.show = true;
      var request = {
        userId: this.profileInfo.userId,
        accountIdValid: data.accountId,
        fristName: this.profileInfo.firstName,
        midleName: this.profileInfo.midleName,
        lastName: this.profileInfo.lastName,
        idCard: this.profileInfo.idCard,
        dateOfBirth: this.profileInfo.dateOfBirth,
        address: this.profileInfo.address,
        phoneNumber: this.profileInfo.phoneNumber,
        email: this.profileInfo.email,
        role: this.profileInfo.role,
        createBy: data.userName,
      };
      if (
        request.fristName != "" &&
        request.midleName != "" &&
        request.lastName != "" &&
        request.idCard != "" &&
        request.dateOfBirth != "" &&
        request.address != "" &&
        request.phoneNumber != "" &&
        request.email != "" &&
        request.role != ""
      ) {
        http
          .post("/user/api/create-new-user", request)
          .then((response) => {
            if (response.status == "200") {
              this.show = false;
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Save user success !!!...",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
              this.callBack();
              $(".modal").css("display", "none");
              $(".modal-backdrop").css("display", "none");
            } else {
              this.show = false;
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Save user is not success !!!...",
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
            }
          })
          .catch((error) => {
            this.show = false;
            $(".modal").css("display", "none");
            $(".modal-backdrop").css("display", "none");
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
      } else {
        this.show = false;
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to save user",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
      }
    },

    // click to move form edit user
    clickOnEditUser(userId) {
      var data = JSON.parse(localStorage.getItem("user"));
      var accountIdValid = data.accountId;
      $("#div-select-role").css("display", "none");
      http
        .post("/user/api/get-user-by-id" + "/" + userId + "/" + accountIdValid)
        .then((response) => {
          this.profileInfo = response.data;
        })
        .catch((error) => {
          this.show = false;
          this.$swal({
            toast: true,
            showProgressBar: true,
            position: "top-end",
            title: "An error occured: " + error,
            icon: "error",
            showConfirmButton: false,
            timer: 2100,
          });
          $("#profileUserModal").modal("hide");
          this.$router.push({
            name: "NotFound",
          });
        });
    },

    // clear object when initialze modal popup
    clearData() {
      this.profileInfo.userId = "";
      this.profileInfo.userName = "";
      this.profileInfo.firstName = "";
      this.profileInfo.midleName = "";
      this.profileInfo.lastName = "";
      this.profileInfo.dateOfBirth = "";
      this.profileInfo.email = "";
      this.profileInfo.phoneNumber = "";
      this.profileInfo.createBy = "";
      this.profileInfo.address = "";
      this.profileInfo.idCard = "";
      $("#div-select-role").css("display", "block");
    },

    deleteUserById(pUserId) {
      var data = JSON.parse(localStorage.getItem("user"));
      var accountIdValid = data.accountId;
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
            .delete("/user/api/delete-user-by-id/" + pUserId + "/" + accountIdValid)
            .then((response) => {
              if (response.status == "200") {
                this.$swal("Deleted!", "Your user has been deleted.", "success");
                this.callBack();
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
          this.show = false;
        }
      });
    },

    // search user by criteria
    searchUser() {
      $("#loading").show();
      var data = JSON.parse(localStorage.getItem("user"));
      var accountIdValid = data.accountId;
      var criteria = this.criteria;
      if (criteria != "") {
        http
          .get(
            "/user/api/search-user-by-criteria" + "/" + criteria + "/" + accountIdValid
          )
          .then((response) => {
            if (response.status == "200") {
              this.listUser = response.data;
              $("#loading").hide();
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
            this.$router.push({
              name: "NotFound",
            });
          });
      } else {
        this.getListUser();
      }
    },
  },
};
</script>
