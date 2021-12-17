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
      <div class="row font-weight-bold px-2 text-center" v-if="!isLoading">
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
          <h2>SRDS {{ userBalance }}</h2>
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
      isLoading: true,
      balance: 0,
      user: null,
      assets: [
        { asset: "SRDS", value: 0 },
        { asset: "WBTC.e", value: 2 },
        { asset: "WETH.e", value: 10 },
        { asset: "USDC.e", value: 38 },
      ],
      transactions: [],
    };
  },
  created() {
    this.fetch();
    this.manageTransactions();
  },
  computed: {
    userBalance() {
      return this.balance;
    },
  },
  methods: {
    async fetch() {
      this.isLoading = true;
      this.user = moralis.User.current();
      let address = this.user.get("wallet");
      address = address.toLowerCase();
      const query = new moralis.Query("AvaxTokenBalance");
      query.equalTo("address", address);

      // subscribe for real-time updates
      const web3 = new moralis.Web3();
      this.manageUpdates(query, web3);
      query.find().then((results) => {
        if (results.length > 0) {
          this.balance = web3.utils.fromWei(results[0].get("balance"));
          this.assets[0].value = this.balance;
          this.isLoading = false;
        } else {
          this.balance = 0;
          this.assets[0].value = 0;
        }
        this.isLoading = false;
      });
    },
    async manageUpdates(query, web3) {
      const subscription = await query.subscribe();
      subscription.on("create", (data) => {
        this.balance = web3.utils.fromWei(data.get("balance"));
        this.assets[0].value = this.balance;
        console.log("create", data);
      });
      subscription.on("update", (data) => {
        console.log("update", data);
        this.balance = web3.utils.fromWei(data.get("balance"));
        this.assets[0].value = this.balance;
      });
    },
    async manageTransactions() {
      let address = this.user.get("wallet");
      address = address.toLowerCase();
      const query = new moralis.Query("AvaxTokenTransfers");
      query.equalTo("to_address", address);
      const web3 = new moralis.Web3();
      // subscribe for real-time updates
      const subscription = await query.subscribe();
      subscription.on("create", (data) => {
        const amountEth = web3.utils.fromWei(data.get("value"));
        this.transactions.push({
          confirmed: data.get("confirmed"),
          type: "Received",
          asset: "SRDS",
          amount: amountEth,
        });
      });
      subscription.on("update", (data) => {
        this.transactions.forEach((transaction) => {
          if(transaction.id === data.id) {
            transaction.confirmed = data.get("confirmed");
          }
        })
      });
      query.find().then((transactions) => {
        transactions.forEach((transaction) => {
          const amountEth = web3.utils.fromWei(transaction.get("value"));
          this.transactions.push({
            id: transaction.id,
            confirmed: transaction.get("confirmed"),
            type: "Received",
            asset: "SRDS",
            amount: amountEth,
          });
        });
      });
    },
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