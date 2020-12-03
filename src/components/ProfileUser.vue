<template>
  <div class="jumbotron">
    <h5 style="text-align: center">
      <b-icon icon="person-circle" font-scale="2"></b-icon>
      PROFILE DETAIL OF USER
    </h5>
    <hr class="my-4" />
    <div
      id="carouselExampleInterval"
      class="carousel slide"
      data-ride="carousel"
    >
      <!--PERSONAL LOG-->
      <div class="carousel-inner">
        <div class="carousel-item active" data-interval="1000">
          <div class="card">
            <div class="card-body">
              <div class="card-header">PERSONAL INFORMATION</div>
              <div class="card-body">
                <div class="form-group row">
                  <label for="staticEmail" class="col-sm-3 col-form-label">
                    <b-icon icon="info-circle-fill"></b-icon> User ID
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.userId }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="person-square"></b-icon>
                    Full name
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.fullName }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="calendar2-date"></b-icon>
                    Birthday
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.dateOfBirth }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="card-heading"></b-icon>
                    Id card
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.idCard }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="map"></b-icon>
                    Address
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.address }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="phone-vibrate"> </b-icon>
                    Phone number
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.phoneNumber }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="mailbox2"></b-icon>
                    Email
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.email }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="cursor"></b-icon>
                    Created by
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.createBy }}
                  </div>
                </div>
                <div class="form-group row">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b-icon icon="calendar2-check-fill"></b-icon>
                    Created on date
                  </label>
                  <div class="col-sm-5">
                    {{ profileInfo.createDate }}
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  data-toggle="modal"
                  data-target="#profileUserModal"
                  @click="hideDivRole()"
                >
                  <b-icon icon=" tools"></b-icon> EDIT INFORMATION
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="card-header">ACCOUNT INFORMATION</div>
            <div class="card-body secondary">
              <div class="form-group row">
                <label for="" class="col-sm-3 col-form-label">Account ID</label>
                <div class="col-sm-5">
                  {{ profileInfo.accountId }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >User name</label
                >
                <div class="col-sm-5">
                  {{ profileInfo.userName }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Role code</label
                >
                <div class="col-sm-5">
                  {{ profileInfo.role }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Status</label
                >
                <div class="col-sm-5">
                  {{ profileInfo.statusAccount }}
                  <template v-if="profileInfo.statusAccount === 'ACTIVE'">
                    <b-icon icon="check-circle-fill" variant="success"></b-icon>
                  </template>
                  <template v-else-if="profileInfo.statusAccount === 'BLOCKED'">
                    <b-icon icon="lock-fill" variant="danger"></b-icon>
                  </template>
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Created by</label
                >
                <div class="col-sm-5">
                  {{ profileInfo.accountCreatedBy }}
                </div>
              </div>
              <div class="form-group row">
                <label for="inputPassword" class="col-sm-3 col-form-label"
                  >Created date</label
                >
                <div class="col-sm-5">
                  {{ profileInfo.accountCreatedDate }}
                </div>
              </div>
            </div>
            <div class="card-footer">
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                data-toggle="modal"
                data-target="#changPasswordUserModal"
              >
                <b-icon icon="tools"></b-icon> CHANGE PASSWORD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a
      class="carousel-control-prev"
      href="#carouselExampleInterval"
      role="button"
      data-slide="prev"
    >
      <b-icon
        icon="arrow-left-circle-fill"
        font-scale="4"
        variant="secondary"
      ></b-icon>
    </a>
    <a
      class="carousel-control-next"
      href="#carouselExampleInterval"
      role="button"
      data-slide="next"
    >
      <b-icon
        icon="arrow-right-circle-fill"
        font-scale="4"
        variant="secondary"
      ></b-icon>
    </a>

    <!-- Modal profile user -->
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
            <h5 class="modal-title" id="exampleModalLabel">
              EDIT PROFILE USER
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
              <label for="staticEmail" class="col-sm-2 col-form-label">
                <b-icon icon="info-circle-fill"></b-icon> User ID
              </label>
              <div class="col-sm-10">
                <input
                  type="text"
                  disabled
                  class="form-control"
                  v-model="profileInfo.userId"
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">
                <b-icon icon="person-square"></b-icon>
                Frist name
              </label>

              <div class="col-sm-3">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="text"
                      class="form-control"
                      v-model="profileInfo.firstName"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
              <div class="col-sm-4">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="text"
                      class="form-control"
                      v-model="profileInfo.midleName"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
              <div class="col-sm-3">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="text"
                      class="form-control"
                      v-model="profileInfo.lastName"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">
                <b-icon icon="calendar2-date"></b-icon>
                Date of birth
              </label>
              <div class="col-sm-4">
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
                      type="text"
                      class="form-control"
                      v-model="profileInfo.idCard"
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
                      type="text"
                      class="form-control"
                      v-model="profileInfo.address"
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
                      type="text"
                      class="form-control"
                      v-model="profileInfo.phoneNumber"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
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
                      type="text"
                      class="form-control"
                      v-model="profileInfo.email"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
            </div>
          </div>
          <div class="form-group row" id="div-role" style="display: none">
            <label for="inputPassword" class="col-sm-2">
              <b-icon icon="shield-shaded"></b-icon>
              Role
            </label>
            <div class="col-sm-5">
              <input
                disabled
                type="text"
                class="form-control"
                v-model="profileInfo.role"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              data-dismiss="modal"
            >
              <b-icon icon="bookmark-x"></b-icon>
              CANCEL
            </button>
            <button
              type="button"
              class="btn btn-success btn-sm"
              v-on:click="saveProfileUser()"
            >
              <b-icon icon="box-arrow-in-down-right"></b-icon>SAVE CHANGE
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal change password user -->
    <div
      class="modal fade"
      id="changPasswordUserModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="false"
      data-backdrop="static"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">UPDATE PASSWORD</h5>
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
            <form>
              <div class="form-group">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="password"
                      class="form-control"
                      id="current-pass"
                      placeholder="Current password"
                      maxlength="25"
                      v-model="passwordChange.currentPass"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
              <div class="form-group">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="password"
                      class="form-control"
                      id="new-pass"
                      placeholder="New password"
                      maxlength="25"
                      v-model="passwordChange.newPass"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
              <div class="form-group">
                <ValidationProvider rules="required">
                  <div slot-scope="{ errors }">
                    <input
                      type="password"
                      class="form-control"
                      id="confirm-new-pass"
                      placeholder="Confirm new password"
                      maxlength="25"
                      v-model="passwordChange.confirmNewPass"
                    />
                    <p>{{ errors[0] }}</p>
                  </div>
                </ValidationProvider>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success btn-sm"
              v-on:click="saveChangePassword()"
            >
              <b-icon icon="box-arrow-in-down-right"></b-icon>
              SAVE AND CHANGE
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../axios/http-common";
import jquery from "jquery";
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
      profileInfo: {
        userId: "",
        firstName: "",
        midleName: "",
        lastName: "",
        fullName: "",
        dateOfBirth: "",
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

      passwordChange: {
        currentPass: "",
        newPass: "",
        cofirmNewPass: "",
      },
    };
  },

  mounted() {
    $("#loadingButton").modal("hide");
    this.getProfileUser();
  },

  methods: {
    // move to screen change password
    goToChangPassword() {
      this.$router.push({
        name: "ChangePassword",
      });
    },

    // get profile user
    getProfileUser() {
      this.checkLoaclStorage();
      var data = JSON.parse(localStorage.getItem("user"));
      var userId = data.userId;
      var accountId = data.accountId;
      http
        .get("/api/account/get-profile-user/" + userId + "/" + accountId)
        .then((response) => {
          if (response.status == "200") {
            this.profileInfo = response.data;
            this.profileInfo.fullName = response.data.firstName
              .concat(" ")
              .concat(response.data.midleName)
              .concat(" ")
              .concat(response.data.lastName);
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

    // save new password
    saveChangePassword() {
      var data = JSON.parse(localStorage.getItem("user"));
      var request = {
        accountId: data.accountId,
        userId: data.userId,
        currentPass: this.passwordChange.currentPass,
        newPass: this.passwordChange.newPass,
        confirmNewPass: this.passwordChange.confirmNewPass,
      };
      if (
        request.currentPass != "" &&
        request.newPass != "" &&
        request.confirmNewPass != ""
      ) {
        http
          .post("/api/account/change-password", request)
          .then((response) => {
            if (response.status == "200") {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Change password success !!!...",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
              $("#changPasswordUserModal").modal("hide");
            } else {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Change password not sucess" + error,
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
              $("#changPasswordUserModal").modal("hide");
            }
          })
          .catch((error) => {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Change password not sucess" + error,
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            $("#changPasswordUserModal").modal("hide");
            console.log(error);
          });
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to change password",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
        $("#changPasswordUserModal").modal("hide");
      }
    },

    // save profile user
    saveProfileUser() {
      var data = JSON.parse(localStorage.getItem("user"));
      var accountId = data.accountId;
      var request = {
        accountIdValid: accountId,
        userId: this.profileInfo.userId,
        fristName: this.profileInfo.firstName,
        midleName: this.profileInfo.midleName,
        lastName: this.profileInfo.lastName,
        idCard: this.profileInfo.idCard,
        address: this.profileInfo.address,
        phoneNumber: this.profileInfo.phoneNumber,
        role: this.profileInfo.role,
        email: this.profileInfo.email,
        dateOfBirth: this.profileInfo.dateOfBirth,
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
        request.email != ""
      ) {
        http
          .post("/user/api/create-new-user", request)
          .then((response) => {
            if (response.status == "200") {
              $("#profileUserModal").modal("hide");
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Save info success !!!",
                icon: "success",
                showConfirmButton: false,
                timer: 2100,
              });
            } else {
              this.$swal({
                toast: true,
                showProgressBar: true,
                position: "top-end",
                title: "Save not sucess",
                icon: "error",
                showConfirmButton: false,
                timer: 2100,
              });
              $("#profileUserModal").modal("hide");
            }
          })
          .catch((error) => {
            this.$swal({
              toast: true,
              showProgressBar: true,
              position: "top-end",
              title: "Save info not sucess" + error,
              icon: "error",
              showConfirmButton: false,
              timer: 2100,
            });
            $("#profileUserModal").modal("hide");
          });
      } else {
        this.$swal({
          toast: true,
          showProgressBar: true,
          position: "top-end",
          title: "Missing info to save ",
          icon: "error",
          showConfirmButton: false,
          timer: 2100,
        });
        $("#profileUserModal").modal("hide");
      }
    },

    // check local storage
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
  },
};
</script>

<style scoped>
.card {
  width: 80%;
  font-size: 14px;
  padding: 2px;
  margin-left: auto;
  margin-right: auto;
}

label {
  font-size: 14px;
  border: black;
}

.card-footer {
  text-align: right;
}

.carousel-control-prev,
.carousel-control-next {
  background-color: #ffa50000;
  height: 100px;
  width: auto;
  margin-top: 35%;
}
</style>
