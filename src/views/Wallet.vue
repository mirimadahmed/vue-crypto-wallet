<template>
  <div class="wallet row px-5 mt-5">
    <div class="row text-center col-12 p-0 m-0">
      <div class="col-md-10 m-auto p-0">
        <div class="alert alert-success" role="alert">
          Static Message from Admin
        </div>
      </div>
    </div>
    <div class="col-md-10 m-auto bg-light">
      <div class="row font-weight-bold px-2 text-center">
        <div class="col-md-6 my-3 align-self-center">
          <h2>Your wallet</h2>
        </div>
        <div class="col-md-6">
          <img
            src="../assets/illustration-graph 3.png"
            alt="graph-3"
            class="w-25"
          />
        </div>
        <div class="col-md-6 text-secondary">
          <p>Address</p>
          <p class="text-truncate mb-0">{{ user.get("wallet") }}</p>
          <copy-to-clipboard :text="user.get('wallet')" @copy="handleCopy">
            <a href="#"><b-icon icon="clipboard-check"></b-icon></a>
          </copy-to-clipboard>
        </div>
        <div class="col-md-6 my-2">
          <h5>Total Balance</h5>
          <h2>${{ user.get("amount") }}</h2>
        </div>
      </div>
    </div>
    <div class="col-md-10 m-auto p-0">
      <div class="w-100 bg-light my-4">
        <b-tabs content-class="mt-3" justified>
          <b-tab title="Assets" active>
            <b-table hover :items="assets"></b-table>
          </b-tab>
          <b-tab title="Transactions">
            <b-table hover :items="transactions"></b-table>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import CopyToClipboard from "vue-copy-to-clipboard";
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
export default {
  components: {
    CopyToClipboard,
  },
  data() {
    return {
      user: null,
      assets: [
        { asset: "SXRDX", value: 40 },
        { asset: "WBTC.e", value: 2 },
        { asset: "WETH.e", value: 10 },
        { asset: "USDC.e", value: 38 },
      ],
      transactions: [
        { type: "Sent", asset: "SXRDX", amount: 40 },
        { type: "Received", asset: "SXRDX", amount: 2 },
        { type: "Sent", asset: "SXRDX", amount: 10 },
        { type: "Received", asset: "SXRDX", amount: 38 },
      ],
    };
  },
  created() {
    this.user = moralis.User.current();
  },
  methods: {
    handleCopy() {
      this.$bvToast.toast("Address copied to clipboard", {
        title: "Copy",
        variant: "info",
        solid: true,
      });
    },
  },
};
</script>