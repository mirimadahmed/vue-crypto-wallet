<template>
  <div>
    <div class="row p-4" v-if="step === 1">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">
          {{ $t("auth.signup.main") }}
        </h2>
      </div>
      <div class="col-12">
        <a
          @click.prevent="$emit('login')"
          href="#"
          class="text-center font-weight-lighter text-secondary"
        >
          <p>
            {{ $t("auth.signup.have_wallet") }}
          </p>
        </a>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-3"
          :label="`${$t('auth.signup.username_label')}`"
          label-for="input-1"
          description="Give yourself a unique username"
        >
          <b-form-input
            id="input-3"
            v-model="form.username"
            type="text"
            :placeholder="`${$t('auth.signup.username_placeholder')}`"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-4"
          :label="`${$t('auth.signup.password_label')}`"
          label-for="input-1"
        >
          <b-form-input
            id="input-4"
            v-model="form.password"
            type="password"
            :placeholder="`${$t('auth.signup.password_placeholder')}`"
            :state="passwordConfirmationRule"
            required
          ></b-form-input>
          <password
            v-model="form.password"
            :strength-meter-only="true"
            @score="setScore"
          />
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-5"
          :label="`${$t('auth.signup.confirm_password_label')}`"
          label-for="input-1"
          :description="`${$t('auth.signup.confirm_password_description')}`"
        >
          <b-form-input
            id="input-5"
            v-model="form.confirmpassword"
            type="password"
            :placeholder="`${$t('auth.signup.confirm_password_placeholder')}`"
            :state="confirmPasswordConfirmationRule"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.signup.referral_label')}`"
          label-for="input-1"
          :description="`${$t('auth.signup.referral_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.referral"
            type="email"
            :placeholder="`${$t('auth.signup.referral_placeholder')}`"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12" v-if="error">
        <p class="text-center font-weight-lighter text-danger">{{ error }}</p>
      </div>
      <div class="col-12 text-center">
        <b-button
          type="submit"
          variant="primary"
          @click="signup()"
          :disabled="
            !passwordConfirmationRule ||
            !confirmPasswordConfirmationRule ||
            isLoading
          "
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="isLoading"
          ></span>
          <span class="sr-only" v-if="isLoading">Loading...</span>
          {{ $t("auth.signup.button") }}
        </b-button>
      </div>
      <div class="col-12 pt-5">
        <a @click.prevent="$emit('back')" href="#">
          <p class="text-center text-muted font-weight-light">
            {{ $t("auth.signup.cancel") }}
          </p>
        </a>
      </div>
    </div>
    <div class="row p-4" v-if="step === 2">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">
          {{ $t("auth.setup.heading") }}
        </h2>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-8"
          :label="`${$t('auth.setup.email_label')}`"
          label-for="input-1"
          description="Let's setup an email?"
        >
          <b-form-input
            id="input-8"
            v-model="form.email"
            type="email"
            :placeholder="`${$t('auth.setup.email_placeholder')}`"
            required
            :state="detailsState['email']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-6"
          :label="`${$t('auth.setup.name_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.name_description')}`"
        >
          <b-form-input
            id="input-6"
            v-model="form.name"
            type="text"
            :placeholder="`${$t('auth.setup.name_placeholder')}`"
            required
            :state="detailsState['name']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.surname_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.surname_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.surname"
            type="text"
            :placeholder="`${$t('auth.setup.surname_placeholder')}`"
            required
            :state="detailsState['surname']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.dob_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.dob_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.dob"
            type="date"
            :placeholder="`${$t('auth.setup.dob_placeholder')}`"
            required
            :state="detailsState['dob']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.address1_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.address1_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.address1"
            type="text"
            :placeholder="`${$t('auth.setup.address1_placeholder')}`"
            required
            :state="detailsState['address1']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.address2_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.address2_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.address2"
            type="text"
            :placeholder="`${$t('auth.setup.address2_placeholder')}`"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.city_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.city_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.city"
            type="text"
            :placeholder="`${$t('auth.setup.city_placeholder')}`"
            required
            :state="detailsState['city']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.state_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.state_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.state"
            type="text"
            :placeholder="`${$t('auth.setup.state_placeholder')}`"
            required
            :state="detailsState['state']"
          ></b-form-input>
        </b-form-group>
      </div>

      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.country_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.country_description')}`"
        >
          <b-form-select
            id="input-7"
            v-model="form.country"
            :options="countries"
            :placeholder="`${$t('auth.setup.country_placeholder')}`"
            required
            :state="detailsState['country']"
            :text-field="'name'"
            :value-field="'name'"
          ></b-form-select>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.nationality_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.nationality_description')}`"
        >
        <b-form-select
            id="input-7"
            v-model="form.nationality"
            :options="countries"
            :placeholder="`${$t('auth.setup.nationality_placeholder')}`"
            required
            :state="detailsState['nationality']"
            :text-field="'name'"
            :value-field="'name'"
          ></b-form-select>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.setup.zip_label')}`"
          label-for="input-1"
          :description="`${$t('auth.setup.zip_description')}`"
        >
          <b-form-input
            id="input-7"
            v-model="form.zip"
            type="text"
            :placeholder="`${$t('auth.setup.zip_placeholder')}`"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12" v-if="error">
        <p class="text-center font-weight-lighter text-danger">{{ error }}</p>
      </div>
      <div class="col-12 text-center">
        <b-button
          type="submit"
          variant="primary"
          @click="setEmailAndOthers"
          :disabled="isLoading || !detailsValid"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="isLoading"
          ></span>
          <span class="sr-only" v-if="isLoading">Loading...</span>
          {{ $t("auth.setup.button") }}
        </b-button>
      </div>
    </div>
    <div class="row p-4" v-if="step === 3">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">
          {{ $t("auth.kyc.heading") }}
        </h2>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-8"
          :label="`${$t('auth.kyc.id_label')}`"
          label-for="input-1"
          :description="`${$t('auth.kyc.id_description')}`"
        >
          <b-form-input
            id="input-8"
            v-model="form.nid"
            type="text"
            :placeholder="`${$t('auth.kyc.id_placeholder')}`"
            required
            :state="kycState['nid']"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-7"
          :label="`${$t('auth.kyc.file_label')}`"
          label-for="input-1"
          :description="`${$t('auth.kyc.file_description')}`"
        >
          <b-form-file
            v-model="form.id_file"
            required
            :placeholder="`${$t('auth.kyc.file_description')}`"
            :drop-placeholder="`${$t('auth.kyc.file_description')}`"
            :state="kycState['id_file']"
          ></b-form-file>
        </b-form-group>
      </div>
      <div class="col-12" v-if="error">
        <p class="text-center font-weight-lighter text-danger">{{ error }}</p>
      </div>
      <div class="col-12 text-center">
        <b-button
          type="submit"
          variant="primary"
          @click="setKyc"
          :disabled="isLoading || !kycValid"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="isLoading"
          ></span>
          <span class="sr-only" v-if="isLoading">Loading...</span>
          {{ $t("auth.kyc.button") }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { countries } from "../countries.js";
import Password from "vue-password-strength-meter";
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
export default {
  components: {
    Password,
  },
  computed: {
    passwordConfirmationRule() {
      if (this.form.password.length === 0) return null;
      return this.form.score >= 3;
    },
    confirmPasswordConfirmationRule() {
      if (this.form.confirmpassword.length === 0) return null;
      return (
        this.form.score >= 3 && this.form.password === this.form.confirmpassword
      );
    },
    detailsValid() {
      return this.kycFields.every(
        (field) => this.form[field] && this.form[field].length >= 3
      );
    },
    detailsState() {
      return this.kycFields.reduce((acc, field) => {
        acc[field] = this.form[field].length >= 3;
        return acc;
      }, {});
    },
    kycState() {
      return {
        nid: this.form.nid.length >= 3,
        id_file: this.form.id_file !== null,
      };
    },
    kycValid() {
      return this.form.nid.length >= 3 && this.form.id_file !== null;
    },
  },
  data() {
    return {
      countries: countries,
      isLoading: false,
      error: null,
      step: 1,
      user: null,
      kycFields: [
        "email",
        "name",
        "surname",
        "dob",
        "address1",
        "city",
        "state",
        "country",
        "nationality",
      ],
      form: {
        email: "",
        password: "",
        confirmpassword: "",
        name: "",
        surname: "",
        username: "",
        score: 0,
        referral: "",
        dob: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        nationality: "",
        zip: "",
        nid: "",
        id_file: null,
        kyc: -1,
      },
    };
  },
  created() {
    this.form.referral = this.$store.getters.referredBy;
    const currentUser = moralis.User.current();
    if (currentUser) {
      this.user = currentUser;
      if (this.user.get("email")) {
        this.step = 3;
      } else {
        this.step = 2;
      }

      // If we reached here, this means we have a logged in user who needs to set details.
    }
  },
  methods: {
    setScore(score) {
      this.form.score = score;
    },
    signup() {
      this.error = null;
      this.isLoading = true;
      const user = new moralis.User();
      user.set("username", this.form.username);
      user.set("password", this.form.password);
      user
        .signUp()
        .then((user) => {
          this.user = user;
          this.isLoading = false;
          this.step++;
        })
        .catch((error) => {
          this.error = error.message;
          this.isLoading = false;
        });
    },
    setEmailAndOthers() {
      this.isLoading = true;
      this.error = null;
      this.user.set("email", this.form.email);
      this.user.set("name", this.form.name);
      this.user.set("surname", this.form.surname);
      this.user.set("dob", this.form.dob);
      this.user.set("address1", this.form.address1);
      this.user.set("address2", this.form.address2);
      this.user.set("city", this.form.city);
      this.user.set("state", this.form.state);
      this.user.set("country", this.form.country);
      this.user.set("nationality", this.form.nationality);
      this.user.set("zip", this.form.zip);
      this.user
        .save()
        .then((user) => {
          this.isLoading = false;
          this.user = user;
          this.step++;
        })
        .catch((error) => {
          this.error = error.message;
          this.isLoading = false;
        });
    },
    setKyc() {
      this.isLoading = true;
      this.error = null;
      this.user.set("nid", this.form.nid);

      const moralisFile = new moralis.File(
        this.form.nid + Date.now().toString(),
        this.form.id_file
      );

      moralisFile.save().then((retFile) => {
        this.user.set("id_file", retFile);
        this.user.set("kyc", 0);
        this.user
          .save()
          .then((user) => {
            this.isLoading = false;
            this.user = user;
            this.$store.commit("setAuthentication", user);
            this.createReferralRecord(this.form.email, this.form.referral);
            this.$router.replace({ name: "Onboard" });
          })
          .catch((error) => {
            this.error = error.message;
            this.isLoading = false;
          });
      });
    },
    createReferralRecord(user, referral) {
      if (referral && referral.length > 0) {
        const Referrals = moralis.Object.extend("Referrals");
        const referrals = new Referrals();
        referrals.set("userfrom", referral);
        referrals.set("userto", user);
        referrals.save();
      }
    },
  },
};
</script>

<style>
</style>