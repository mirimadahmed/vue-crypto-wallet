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
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12" v-if="error">
        <p class="text-center font-weight-lighter text-danger">{{ error }}</p>
      </div>
      <div class="col-12 text-center">
        <b-button
          type="submit"
          variant="secondary"
          @click="setEmailAndOthers"
          :disabled="isLoading"
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
  </div>
</template>

<script>
import Password from "vue-password-strength-meter";
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
export default {
  components: {
    Password,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      step: 1,
      user: null,
      form: {
        email: "",
        password: "",
        confirmpassword: "",
        name: "",
        surname: "",
        username: "",
        score: 0,
        referral: "",
      },
    };
  },
  created() {
    this.form.referral = this.$store.getters.referredBy;
    const currentUser = moralis.User.current();
    if (currentUser) {
      this.user = currentUser;
      // If we reached here, this means we have a logged in user who needs to set details.
      this.step = 2;
    }
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
      this.error = null;
      this.user.set("email", this.form.email);
      this.user.set("name", this.form.name);
      this.user.set("surname", this.form.surname);
      this.user
        .save()
        .then((user) => {
          this.user = user;
          this.$store.commit("setAuthentication", user);
          this.createReferralRecord(this.form.email, this.form.referral);
          this.$router.replace({ name: "Onboard" });
        })
        .catch((error) => {
          this.error = error.message;
          this.isLoading = false;
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