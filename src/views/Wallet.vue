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
          <h2>SRDS {{ user.balance }}</h2>
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
        { asset: "SRDS", value: 0 },
        { asset: "WBTC.e", value: 2 },
        { asset: "WETH.e", value: 10 },
        { asset: "USDC.e", value: 38 },
      ],
      transactions: [
        { type: "Sent", asset: "SRDS", amount: 10 },
        { type: "Received", asset: "SRDS", amount: 40 },
        { type: "Sent", asset: "SRDS", amount: 10 },
        { type: "Received", asset: "SRDS", amount: 30 },
      ],
    };
  },
  created() {
    this.user = moralis.User.current();
    const AvaxTokenBalance = moralis.Object.extend("AvaxTokenBalance");
    const query = new moralis.Query(AvaxTokenBalance);
    let address = this.user.get("wallet");
    address = address.toLowerCase();
    query.equalTo("address", address);
    query.find().then((results) => {
      if (results.length > 0) {
        console.log(results);
        this.$nextTick(() => {
          this.user.balance = results[0].get("balance") / 1000000000000000000;
        });
        this.assets[0].asset = "SRDS";
        this.assets[0].value = this.user.balance;
      } else {
        this.user.balance = 0;
        this.assets[0].asset = "SRDS";
        this.assets[0].value = 0;
      }
    });
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