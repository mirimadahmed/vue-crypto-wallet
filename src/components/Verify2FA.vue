<template>
  <div>
    <div class="row p-4 m-0 mt-5 login-wrapper bg-light">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">Verify 2FA Before Sending</h2>
      </div>
      <div class="col-12">
        <b-form-group id="input-group-1" label="Enter OTP:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="state"
            type="text"
            placeholder="OTP"
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
          @click="verify()"
          :disabled="isLoading"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="isLoading"
          ></span>
          <span class="sr-only" v-if="isLoading">Loading...</span>
          Verify
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
import speakeasy from "speakeasy";
export default {
  data() {
    return {
      user: null,
      secret: null,
      qr: null,
      state: null,
      verified: false,
      otpauth_url: null,
      isLoading: false,
      error: null,
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = moralis.User.current();
      this.generate2FA();
    },
    generate2FA() {
      this.secret = this.user.get("twoFactorSecret");
      if (!this.secret) {
        this.$router.push("/enable-2fa");
      }
    },
    verify() {
      this.error = null;
      this.verified = speakeasy.totp.verify({
        secret: this.secret,
        encoding: "ascii",
        token: this.state,
        algorithm: "sha512",
      });
      if (this.verified) {
        this.$emit("otp-verified");
      } else {
        this.error = "Unable to verify that OTP.";
      }
    },
  },
};
</script>

<style>
</style>