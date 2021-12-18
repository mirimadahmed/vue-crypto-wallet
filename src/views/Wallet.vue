<template>
  <div class="wallet row px-5 mt-5">
    <div class="row text-left col-12 p-0 m-0" v-if="admin_message">
      <div class="col-md-10 m-auto p-0">
        <div class="alert alert-success" role="alert">
          {{ admin_message }}
        </div>
      </div>
    </div>
    <div class="col-md-10 m-auto bg-light">
      <div class="row font-weight-bold px-2 text-center" v-if="!isLoading">
        <div class="col-md-6 my-3">
          <h2>Your Wallet</h2>
          <img
            src="../assets/illustration-other 4.png"
            alt="graph-3"
            class="w-25"
          />
          <div class="row">
            <h6 class="text-secondary col pt-2" style="overflow-wrap: anywhere">
              {{ user.get("wallet") }}
              <copy-to-clipboard :text="user.get('wallet')" @copy="handleCopy">
                <a href="#"><b-icon icon="clipboard-check"></b-icon></a>
              </copy-to-clipboard>
            </h6>
          </div>
        </div>
        <div class="col-md-6 my-3 align-self-center">
          <h2>Total Balance</h2>
          <img
            src="../assets/illustration-graph 3.png"
            alt="graph-4"
            class="w-25"
          />
          <h6 class="text-secondary mr-0 pr-0 mb-0">SRDS {{ userBalance }}</h6>
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
            <b-table
              hover
              :items="transactions"
              :fields="['type', 'token', 'amount', 'transaction']"
            >
              <template #cell(transaction)="data">
                <a
                  target="_blank"
                  :href="`https://snowtrace.io/tx/${data.item.transaction}`"
                  >Transaction <b-icon icon="link45deg"
                /></a>
              </template>
            </b-table>
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
const web3 = new moralis.Web3();
export default {
  components: {
    CopyToClipboard,
  },
  data() {
    return {
      admin_message: null,
      isLoading: true,
      balance: 0,
      user: null,
      assets: [],
      transactions: [],
      address: null,
      tokenAddressSymbolMap: {
        "0x71d78d01cf3e8cf1945e93abc9fd6017ec562999": "SRDS",
      }
    };
  },
  created() {
    this.getUser();
    this.getStaticMessage();
    this.manageTokens();
    this.manageTokenTransactions();
    this.manageAvax();
    this.manageAvaxTransactions();
  },
  computed: {
    userBalance() {
      return this.balance;
    },
  },
  methods: {
    getUser() {
      this.user = moralis.User.current();
      this.address = this.user.get("wallet").toLowerCase();
    },
    getStaticMessage() {
      this.isLoading = true;
      const query = new moralis.Query("StaticInfo");
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.admin_message = result.get("info");
          });
        }
        this.isLoading = false;
      });
    },
    async manageTokens() {
      this.isLoading = true;
      const query = new moralis.Query("AvaxTokenBalance");
      query.equalTo("address", this.address);
      // subscribe for real-time updates
      const subscription = await query.subscribe();
      subscription.on("create", (result) => {
        this.assets.push({
          value: web3.utils.fromWei(result.get("balance")),
          name: result.get("symbol"),
          id: result.id,
        });
      });
      subscription.on("update", (data) => {
        this.assets.forEach((asset) => {
          if (asset.id === data.id) {
            asset.value = web3.utils.fromWei(data.get("balance"));
          }
          if (data.get("symbol") === "SRDS") {
            this.balance = web3.utils.fromWei(data.get("balance"));
          }
        });
      });
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.assets.push({
              value: web3.utils.fromWei(result.get("balance")),
              name: result.get("symbol"),
            });
            if (result.get("symbol") === "SRDS") {
              this.balance = web3.utils.fromWei(result.get("balance"));
            }
          });
        }
        this.isLoading = false;
      });
    },
    async manageTokenTransactions() {
      const toQuery = new moralis.Query("AvaxTokenTransfers");
      toQuery.equalTo("to_address", this.address);

      const fromQuery = new moralis.Query("AvaxTokenTransfers");
      fromQuery.equalTo("from_address", this.address);

      const query = moralis.Query.or(toQuery, fromQuery);

      // subscribe for real-time updates
      const subscription = await query.subscribe();
      subscription.on("create", (transaction) => {
        this.transactions.push({
          confirmed: transaction.get("confirmed"),
          id: transaction.id,
          type:
            transaction.get("to_address") === this.address
              ? "Received"
              : "Sent",
          token: this.getTokenSymbol(transaction.get("token_address")),
          amount: web3.utils.fromWei(transaction.get("value")),
          transaction: transaction.get("transaction_hash"),
        });
      });
      subscription.on("update", (data) => {
        this.transactions.forEach((transaction) => {
          if (transaction.id === data.id) {
            transaction.confirmed = data.get("confirmed");
          }
        });
      });
      query.find().then((transactions) => {
        transactions.forEach((transaction) => {
          this.transactions.push({
            confirmed: transaction.get("confirmed"),
            id: transaction.id,
            type:
              transaction.get("to_address") === this.address
                ? "Received"
                : "Sent",
            token: this.getTokenSymbol(transaction.get("token_address")),
            amount: web3.utils.fromWei(transaction.get("value")),
            transaction: transaction.get("transaction_hash"),
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
    async manageAvax() {
      this.isLoading = true;
      const query = new moralis.Query("WatchedAvaxAddress");
      query.equalTo("address", this.address);
      // subscribe for real-time updates
      const subscription = await query.subscribe();
      subscription.on("update", (data) => {
        this.assets.forEach((asset) => {
          if (asset.id === data.id) {
            asset.value = web3.utils.fromWei(data.get("balance"));
          }
        });
      });
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.assets.push({
              value: web3.utils.fromWei(result.get("balance")),
              name: "AVAX",
            });
          });
        }
        this.isLoading = false;
      });
    },
    async manageAvaxTransactions() {
      const toQuery = new moralis.Query("AvaxTransactions");
      toQuery.equalTo("to_address", this.address);

      const fromQuery = new moralis.Query("AvaxTransactions");
      fromQuery.equalTo("from_address", this.address);

      const query = moralis.Query.or(toQuery, fromQuery);

      // subscribe for real-time updates
      const subscription = await query.subscribe();
      subscription.on("create", (transaction) => {
        this.transactions.push({
          confirmed: transaction.get("confirmed"),
          id: transaction.id,
          type:
            transaction.get("to_address") === this.address
              ? "Received"
              : "Sent",
          token: "AVAX",
          amount: web3.utils.fromWei(transaction.get("value")),
          transaction: transaction.get("transaction_hash"),
        });
      });
      subscription.on("update", (data) => {
        this.transactions.forEach((transaction) => {
          if (transaction.id === data.id) {
            transaction.confirmed = data.get("confirmed");
          }
        });
      });
      query.find().then((transactions) => {
        transactions.forEach((transaction) => {
          this.transactions.push({
            confirmed: transaction.get("confirmed"),
            id: transaction.id,
            type:
              transaction.get("to_address") === this.address
                ? "Received"
                : "Sent",
            token: "AVAX",
            amount: web3.utils.fromWei(transaction.get("value")),
            transaction: transaction.get("transaction_hash"),
          });
        });
      });
    },
    getTokenSymbol(tokenAddress) {
      return this.tokenAddressSymbolMap[tokenAddress] || "";
    }
  },
};
</script>