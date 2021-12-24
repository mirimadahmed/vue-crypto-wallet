<template>
  <div class="col-md-6 m-auto">
    <div class="row p-4 m-0 mt-5 login-wrapper bg-light">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">Setup 2FA</h2>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-2"
          label="QR Code:"
          label-for="input-2"
          class="text-center"
        >
          <img :src="qr" alt="Scan qr here" />
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group id="input-group-1" label="OTP:" label-for="input-1">
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
          Enable 2FA
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
import speakeasy from "speakeasy";
import QRCode from "qrcode";
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

      if (this.user.get("twoFactorEnabled")) {
        // move user away from here
        this.$router.push("/wallet");
      } else {
        this.generateTempSecret();
      }
    },
    verify2FA() {
      this.secret = this.user.get("twoFactorSecret");
      this.otpauth_url = speakeasy.otpauthURL({
        secret: this.user.get("twoFactorSecret"),
        label: "Sardis Wallet",
        algorithm: "sha512",
      });
      QRCode.toDataURL(this.otpauth_url, (err, data_url) => {
        this.qr = data_url;
      });
    },
    generateTempSecret() {
      let secret = speakeasy.generateSecret();
      this.secret = secret.ascii;
      this.user.set("tempSecret", this.secret);
      this.otpauth_url = speakeasy.otpauthURL({
        secret: this.secret,
        label: "Sardis Wallet",
        algorithm: "sha512",
      });

      QRCode.toDataURL(this.otpauth_url, (err, data_url) => {
        this.qr = data_url;
      });
    },
    verify() {
      this.verified = speakeasy.totp.verify({
        secret: this.secret,
        encoding: "ascii",
        token: this.state,
        algorithm: "sha512",
      });
      if (this.verified) {
        this.isLoading = true;
        this.user.set("twoFactorEnabled", true);
        this.user.set("twoFactorSecret", this.secret);
        this.user.set("tempSecret", null);
        this.user
          .save()
          .then(() => {
            this.isLoading = false;
            this.$router.push("/wallet");
          })
          .catch((error) => {
            this.error = error.message;
          });
      } else {
        this.error = "Unable to verify that OTP.";
      }
    },
  },
};
</script>

<style>
</style>