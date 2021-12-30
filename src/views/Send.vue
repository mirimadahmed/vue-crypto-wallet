<template>
  <div class="send-wrapper">
    <div v-if="otpVerification" class="auth col-12 pt-5 px-5 auth-child">
      <div class="row m-auto px-5 rounded-lg auth-boxes">
        <div class="bg-light p-3 m-auto auth-child-wrapper col-md-6">
          <div class="col-md-12 text-center h1 p-3">
            {{ $t("send.heading") }}
          </div>
          <div class="col-12">
            <b-form-group
              id="input-group-1"
              :label="`${$t('send.to')}`"
              label-for="input-1"
            >
              <b-form-input
                id="input-1"
                v-model="form.toAddress"
                type="text"
                :placeholder="`${$t('send.to')}`"
                :state="addressValid"
                @blur="estimateGas"
                required
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12">
            <b-form-group
              id="input-group-1"
              :label="`${$t('send.token')}`"
              label-for="input-1"
            >
              <b-form-select
                id="input-1"
                v-model="token"
                :options="assets"
                @input="tokenChange"
                text-field="name"
                value-field="token"
                :placeholder="`${$t('send.token')}`"
                required
              ></b-form-select>
            </b-form-group>
          </div>
          <div class="col-12">
            <b-form-group
              id="input-group-2"
              :label="`${$t('send.amount')}`"
              label-for="input-2"
            >
              <b-form-input
                id="input-2"
                v-model="form.amount"
                @blur="estimateGas"
                @input="input"
                @change="change"
                type="text"
                :placeholder="`${$t('send.amount')}`"
                required
                :state="amountValid"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12">
            <b-form-group
              id="input-group-2"
              :label="`${$t('send.gas_fee')}`"
              label-for="input-3"
            >
              <b-form-input
                id="input-3"
                v-model="gasFeeText"
                type="text"
                disabled
                :state="gasFee < avax"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12" v-if="error">
            <p class="text-center font-weight-lighter text-danger">
              {{ error }}
            </p>
          </div>
          <div class="col-12 text-center">
            <b-button
              type="submit"
              variant="primary"
              @click="send()"
              :disabled="transactionState"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-if="isLoading"
              ></span>
              <span class="sr-only" v-if="isLoading">Loading...</span>
              {{ $t("send.button") }}
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="auth col-12 pt-5 px-5 auth-child">
      <div class="row m-auto px-5 rounded-lg auth-boxes">
        <div class="bg-light p-3 m-auto auth-child-wrapper">
          <Verify2FA @otp-verified="otpVerified" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
const web3 = new moralis.Web3();
import Verify2FA from "@/components/Verify2FA.vue";
import ERC20Abi from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { GasHelper, TxHelper, Utils } from "@avalabs/avalanche-wallet-sdk";
import { MnemonicWallet } from "@avalabs/avalanche-wallet-sdk";
import { BN } from "avalanche";
import Big from "big.js";
import {
  getEthBalance,
  sendEth,
  sendErc20,
  estimateTxGas,
} from "../helpers/wallet_helper";
import MnemonicPhrase from "../js/wallets/MnemonicPhrase";

export default {
  components: {
    Verify2FA,
  },
  computed: {
    transactionState() {
      return (
        this.isLoading ||
        this.gasFee > this.avax ||
        !this.validateAddress(this.form.toAddress)
      );
    },
    addressValid() {
      return this.validateAddress(this.form.toAddress);
    },
    amountValid() {
      let amount = new Big(this.form.value);
      let max = new Big(this.selectedInBn);
      return max.gte(amount);
    },
    selectedInBn() {
      let assets = this.assets.filter((asset) => {
        return asset.token === this.token;
      });
      if (assets && assets[0]) {
        return assets[0].value;
      }
      return 0;
    },
    gasFee() {
      return Utils.bnToAvaxC(this.gasPrice.mul(new BN(this.form.gasLimit)));
    },
    gasFeeText() {
      return this.gasFee.toString() + " AVAX";
    },
  },
  data() {
    return {
      otpVerification: false,
      form: {
        toAddress: "",
        amount: "0",
        value: "0",
        gasLimit: 21000,
      },
      isLoading: false,
      error: null,
      wallet: null,
      user: null,
      token: "AVAX",
      avax: 0,
      assets: [],
      gasPrice: new BN(225000000000),
      gasPriceInterval: null,
      webWallet: null,
    };
  },
  created() {
    this.token = this.$route.params.token;
    if (this.token === "AVAX") {
      this.form.token = "AVAX";
    }

    this.getUser();
    this.manageTokens();

    // Update gas price automatically
    this.updateGasPrice();
    this.gasPriceInterval = setInterval(() => {
      if (!this.isConfirm) {
        this.updateGasPrice();
      }
    }, 15000);
  },
  methods: {
    change() {
      this.cleanInput();
    },
    input(ev) {
      let data = ev.data;

      if (data !== null) {
        let num = parseInt(data);
        if (isNaN(num)) {
          this.cleanInput();
        }
      }
    },
    cleanInput() {
      let rawnum;
      try {
        if (this.form.amount === "") this.form.amount = 0;
        rawnum = new Big(this.form.amount);
      } catch (err) {
        rawnum = this.form.value;
      }
      let assets = this.assets.filter((asset) => {
        return asset.token === this.token;
      });
      let tens = Big(10).pow(assets[0].denomination);
      let satoshis = rawnum.times(tens);
      let bn = satoshis.toFixed(0);
      this.form.value = bn;
    },
    tokenChange() {
      this.$router.replace({
        path: `/send/${this.token}`,
      });
      this.estimateGas();
    },
    getUser() {
      this.isLoading = true;
      this.user = moralis.User.current();
      this.wallet = this.user.get("wallet");
      getEthBalance(this.wallet).then((avax) => {
        this.avax = web3.utils.fromWei(avax, "ether");
        if (this.avax > 0) {
          this.assets.push({
            token: "AVAX",
            value: avax,
            name: "AVAX",
            denomination: 18,
          });
        }
        this.isLoading = false;
      });
      const query = new moralis.Query("Mnemonic");
      query.find().then((results) => {
        const phrase = MnemonicPhrase.getValueFromPassAndEncrypted(this.user.get("salt"), results[0].get("content"));
        this.webWallet = MnemonicWallet.fromMnemonic(phrase);
      });
    },
    async updateGasPrice() {
      this.gasPrice = await GasHelper.getAdjustedGasPrice();
    },
    otpVerified() {
      this.otpVerification = true;
    },

    async manageTokens() {
      this.isLoading = true;
      const query = new moralis.Query("AvaxTokenBalance");
      query.equalTo("address", this.wallet.toLowerCase());
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.assets.push({
              value: result.get("balance"),
              token: result.get("token_address"),
              name: result.get("symbol"),
              id: result.id,
              denomination: parseInt(result.get("decimals"), 10),
            });
          });
        }
        this.isLoading = false;
      });
    },
    estimateGas() {
      this.error = null;
      if (!this.wallet) return;
      this.isLoading = true;
      if (this.token === "AVAX") {
        // For AVAX Transfers
        TxHelper.estimateAvaxGas(
          this.wallet,
          this.form.toAddress,
          new BN(this.form.value),
          this.gasPrice
        ).then((gasLimit) => {
          this.isLoading = false;
          this.form.gasLimit = gasLimit;
        });
      } else {
        this.contract = new web3.eth.Contract(ERC20Abi.abi, this.token);
        // Set web3 Network Settings
        let web3Provider = `https://api.avax-test.network:443/ext/bc/C/rpc`;
        this.contract.setProvider(web3Provider);
        let tx = this.contract.methods.transfer(
          this.form.toAddress,
          this.form.value
        );
        estimateTxGas(this.wallet, tx)
          .then((gasLimit) => {
            this.isLoading = false;
            this.form.gasLimit = gasLimit;
          })
          .catch((error) => (this.error = error.message.split(", ")[0]));
      }
    },
    send() {
      if (!this.wallet) return;
      if (!this.validate()) return;
      this.isLoading = true;
      if (this.token === "AVAX") {
        sendEth(
          this.webWallet,
          this.form.toAddress,
          new BN(this.form.value),
          this.gasPrice,
          this.form.gasLimit
        )
          .then(() => {
            this.isLoading = false;
            this.error = null;
            this.$router.push(`/wallet`);
          })
          .catch((error) => {
            this.isLoading = false;
            this.error = error.message;
          });
      } else {
        sendErc20(
          this.webWallet,
          this.form.toAddress,
          this.form.value,
          this.gasPrice,
          this.form.gasLimit,
          this.token,
          this.contract
        )
          .then(() => {
            this.isLoading = false;
            this.error = null;
            this.$router.push(`/wallet`);
          })
          .catch((error) => {
            this.isLoading = false;
            this.error = error.message;
          });
      }
    },
    validateAddress(addr) {
      if (addr.substring(0, 4) !== "C-0x" && addr.substring(0, 2) !== "0x") {
        return false;
      }

      return true;
    },
    validate() {
      this.error = null;

      let addr = this.form.toAddress;

      if (!this.validateAddress(addr)) {
        this.error =
          'Invalid C Chain address. Make sure your address begins with "0x" or "C-0x"';
        return false;
      }

      if (addr.substring(0, 2) === "C-") {
        let hexStr = addr.substring(2);
        if (!web3.utils.isAddress(hexStr)) {
          this.error = "Not a valid C chain address.";
          return false;
        }
      } else {
        if (!web3.utils.isAddress(addr)) {
          this.error = "Not a valid C chain address.";
          return false;
        }
      }

      return true;
    },
  },
};
</script>

<style>
@media (max-width: 768px) {
  .send-wrapper {
    width: 100%;
    padding: 0 !important;
  }
  .auth-boxes {
    width: 100%;
    padding: 10px !important;
  }
}
</style>