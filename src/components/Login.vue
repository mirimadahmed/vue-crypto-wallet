<template>
  <div class="">
    <div class="row p-4 login-wrapper">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">{{ $t("auth.login.main") }}</h2>
      </div>
      <div class="col-12">
        <a
          @click.prevent="$emit('signup')"
          href="#"
          class="text-center font-weight-lighter text-secondary"
        >
          <p>{{ $t("auth.login.dont_have_wallet") }}</p>
        </a>
      </div>
      <div class="col-12" v-if="!usingMnemonic">
        <a
          @click.prevent="usingMnemonic = true"
          href="#"
          class="text-center font-weight-lighter text-secondary"
        >
          <p>{{ $t("auth.login.forgot_password") }}</p>
        </a>
      </div>
      <div class="col-12" v-else>
        <a
          @click.prevent="usingMnemonic = false"
          href="#"
          class="text-center font-weight-lighter text-secondary"
        >
          <p>{{ $t("auth.login.know_password") }}</p>
        </a>
      </div>
      <div class="col-12" v-if="!usingMnemonic">
        <b-form-group
          id="input-group-1"
          :label="`${$t('auth.login.username_label')}`"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="text"
            :placeholder="`${$t('auth.login.username_placeholder')}`"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12" v-if="!usingMnemonic">
        <b-form-group
          id="input-group-2"
          :label="`${$t('auth.login.password_label')}`"
          label-for="input-1"
        >
          <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            :placeholder="`${$t('auth.login.password_placeholder')}`"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12" v-if="usingMnemonic">
        <b-form-group
          id="input-group-2"
          :label="`${$t('auth.login.mnemonic_label')}`"
          label-for="input-1"
        >
          <b-textarea
            id="input-2"
            v-model="form.mnemonic"
            type="text"
            :placeholder="`${$t('auth.login.mnemonic_placeholder')}`"
            required
          >
          </b-textarea>
        </b-form-group>
      </div>
      <div class="col-12" v-if="error">
        <p class="text-center font-weight-lighter text-danger">{{ error }}</p>
      </div>
      <div class="col-12 text-center">
        <b-button
          type="submit"
          variant="primary"
          @click="login()"
          :disabled="isLoading"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="isLoading"
          ></span>
          <span class="sr-only" v-if="isLoading">Loading...</span>
          {{ $t("auth.login.button") }}
        </b-button>
      </div>
      <div class="col-12 pt-5">
        <a
          @click.prevent="$emit('back')"
          href="#"
          class="text-center font-weight-light text-info"
        >
          <p>
            {{ $t("auth.login.cancel") }}
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import MoralisFactory from "@/moralis";
import { MnemonicWallet } from "@avalabs/avalanche-wallet-sdk";

export default {
  data() {
    return {
      usingMnemonic: false,
      form: {
        email: "",
        password: "",
        mnemonic: "",
      },
      error: null,
      isLoading: false,
    };
  },
  methods: {
    loginWithMnemonic() {
      this.isLoading = true;
      this.error = null;
      // Find wallet by mnemonic
      let myWallet = MnemonicWallet.fromMnemonic(this.form.mnemonic);
      let addressC = myWallet.getAddressC().toLowerCase();
      // Find email by addressC in Wallet table
      const moralis = MoralisFactory();
      const query = new moralis.Query("Wallet");
      query.equalTo("wallet", addressC);
      query
        .find()
        .then((wallets) => {
          this.isLoading = false;
          if (wallets.length === 1) {
            MoralisFactory()
              .User.requestPasswordReset(wallets[0].get("email"))
              .then(() => {
                this.error =
                  "Check your email. Password reset request was sent successfully.";
              })
              .catch((error) => {
                this.error = error.message;
              });
          } else {
            this.error = "Invalid mnemonic";
          }
        })
        .catch((error) => {
          this.error = error.message;
          this.isLoading = false;
        });
    },
    login() {
      this.isLoading = true;
      this.error = null;
      if (this.usingMnemonic) {
        this.loginWithMnemonic();
      } else {
        MoralisFactory()
          .User.logIn(this.form.email, this.form.password, { usePost: true })
          .then((user) => {
            this.isLoading = false;
            if (user.get("deleted")) {
              this.error = this.$t('auth.login.account_deleted');
              MoralisFactory().User.logOut();
            } else {
              this.$store.commit("setAuthentication", user);
              if (user.get("wallet") && user.get("wallet").length > 0) {
                // If the user don't have email already setup, send him to email onboarding
                if (user.get("email") && user.get("email").length > 0) {
                  // If the user don't have enabled 2fa send him to setup it
                  if (user.get("twoFactorEnabled")) {
                    this.$router.replace({ name: "Wallet" });
                  } else {
                    this.$router.replace({ name: "2FA" });
                  }
                } else {
                  this.$emit("email-not-set");
                }
              } else {
                // If the user don't have a wallet already setup, send him to wallet onboarding
                this.$router.replace({ name: "Onboard" });
              }
            }
          })
          .catch((error) => {
            this.isLoading = false;
            this.error = error.message;
          });
      }
    },
  },
};
</script>

<style>
@media (max-width: 768px) {
  .login-wrapper {
    width: 100%;
    padding: 0 !important;
  }
  .auth-boxes {
    width: 100%;
    padding: 10px !important;
  }
}

@media (min-width: 769px) {
  .auth-boxes {
    width: 60%;
  }
}
</style>