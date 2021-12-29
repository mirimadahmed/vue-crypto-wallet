<template>
  <div class="row px-5 mt-5">
    <div class="col-lg-10 m-auto">
      <div class="row">
        <div class="col-md-6 wrapper-box">
          <div class="row">
            <div class="col-12 p-2 bg-light">
              <div class="row px-2">
                <div
                  class="col-6 col-sm-4 col-md-4 col-lg-3 px-2"
                  v-for="(word, i) in words"
                  :key="word + i"
                >
                  <div
                    class="bg-white text-secondary px-2 py-3 my-1 mnemonic-word"
                  >
                    <span>{{ i + 1 }}.</span>
                    <span
                      class="
                        float-right
                        pr-2
                        text-center text-primary
                        font-weight-bold
                      "
                      >{{ word }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 bg-light my-3 p-3 font-weight-bold">
              {{ mnemonic }}
            </div>
          </div>
        </div>
        <div class="col-md-6 p-5 selection-box">
          <div class="row">
            <div class="col-12">
              <img
                src="../assets/illustration-other 4.png"
                alt="other-4"
                class="w-25"
              />
            </div>
            <div class="col-12">
              <h1>{{ $t("auth.onboard.heading") }}</h1>
              <p>
                {{ $t("auth.onboard.lead") }}
              </p>
            </div>
            <div class="col-12">
              <h4 class="text-danger">{{ $t("auth.onboard.sub_heading") }}</h4>

              <h6 class="text-muted">
                {{ $t("auth.onboard.info") }}
              </h6>
            </div>
            <div class="col-12 mt-4">
              <b-form-checkbox size="lg" v-model="secured">
                {{ $t("auth.onboard.checkbox") }}
              </b-form-checkbox>
            </div>
            <div class="col-12 my-3">
              <button
                class="btn btn-primary btn-small"
                @click="access"
                :disabled="!secured"
              >
                {{ $t("auth.onboard.btn") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { MnemonicWallet } from "@avalabs/avalanche-wallet-sdk";
import MoralisFactory from "@/moralis";
import MnemonicPhrase from "../js/wallets/MnemonicPhrase";
const moralis = MoralisFactory();
export default {
  data() {
    return {
      mnemonic: "",
      caddress: "",
      wallet: null,
      words: [],
      secured: false,
    };
  },
  created() {
    const currentUser = moralis.User.current();
    if (currentUser) {
      // If user already has a wallet dont stay here
      if (currentUser.get("wallet") && currentUser.get("wallet").length > 0) {
        if (currentUser.get("twoFactorEnabled")) {
          this.$router.replace({ name: "Wallet" });
        } else {
          this.$router.replace({ name: "2FA" });
        }
      }
    }
    this.create();
  },
  methods: {
    access() {
      const currentUser = moralis.User.current();
      if (currentUser) {
        const Mnemonic = moralis.Object.extend("Mnemonic");

        const phrase = new MnemonicPhrase(this.mnemonic);

        const privateMnemonic = new Mnemonic();
        privateMnemonic.set("content", phrase.encrypted);
        privateMnemonic.setACL(new moralis.ACL(currentUser));
        privateMnemonic.save();

        const Wallet = moralis.Object.extend("Wallet");
        const publicWallet = new Wallet();
        publicWallet.set("wallet", this.caddress.toLowerCase());
        publicWallet.set("email", currentUser.get("email"));
        publicWallet.save();

        currentUser.set("salt", phrase.pass);
        currentUser.set("wallet", this.caddress.toLowerCase());
        currentUser.save().then(() => {
          moralis.Cloud.run("watchAvaxAddress", {
            address: this.caddress.toLowerCase(),
            sync_historical: false,
          }).then(() => {
            this.$router.replace({ name: "2FA" });
          });
        });
      } else {
        // show the signup or login page
        this.$router.replace({ name: "Auth" });
      }
    },
    create() {
      // Create a new wallet
      this.mnemonic = MnemonicWallet.generateMnemonicPhrase();
      this.wallet = MnemonicWallet.fromMnemonic(this.mnemonic);
      this.caddress = this.wallet.getAddressC();
      this.words = this.mnemonic.split(" ");
    },
  },
};
</script>
<style>
@media (max-width: 768px) {
  .selection-box {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .mnemonic-word {
    font-size: 12px;
    padding: 10px !important;
  }
  .wrapper-box {
    padding: 30px !important;
  }
}
</style>
