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
            <h6
              class="text-secondary col pt-2"
              style="overflow-wrap: break-word"
            >
              {{ user.get("wallet") }}
              <copy-to-clipboard :text="user.get('wallet')" @copy="handleCopy">
                <a href="#"><b-icon icon="clipboard-check"></b-icon></a>
              </copy-to-clipboard>
            </h6>
          </div>
        </div>
        <div class="col-md-6 my-3">
          <h2>Total SRDS Balance</h2>
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
            <div class="col-12 p-2 text-center">
              <b-table
                class="m-0"
                hover
                :items="assets"
                :fields="['name', 'value', 'action']"
              >
                <template #cell(action)="data">
                  <div class="h5">
                    <a :href="`/send/${data.item.token}`"
                      ><b-icon
                        icon="arrow-up-right-square"
                        class="text-success"
                        size="large"
                      ></b-icon
                    ></a>
                  </div>
                </template>
              </b-table>
              <p v-if="assets.length === 0">
                It's empty here. Send some SRDS to your wallet.
              </p>
            </div>
          </b-tab>
          <b-tab title="Transactions">
            <div class="col-12 p-2 text-center">
              <b-table
                class="m-0"
                hover
                :items="transactions"
                :fields="['status', 'token', 'amount', 'transaction']"
              >
                <template #cell(status)="data" class="align-self-start">
                  <div class="h5">
                    <b-icon
                      v-if="data.item.status"
                      icon="check"
                      class="text-success"
                      size="large"
                    ></b-icon>
                    <b-icon
                      v-else
                      icon="clock"
                      class="text-info"
                      size="large"
                    ></b-icon>
                  </div>
                </template>
                <template #cell(transaction)="data">
                  <a
                    target="_blank"
                    :href="`https://testnet.snowtrace.io/tx/${data.item.transaction}`"
                    >View on explorer <b-icon icon="link45deg"
                  /></a>
                </template>
              </b-table>
              <p v-if="transactions.length === 0">
                Send or receive something to see your transactions.
              </p>
            </div>
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
        "0x86523d83624b04cf4e62cbeb00c213bbc4486f34": "SRDS",
      },
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
          token: result.get("token_address"),
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
              token: result.get("token_address"),
              name: result.get("symbol"),
              id: result.id,
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
          status: transaction.get("confirmed"),
          id: transaction.id,
          token: this.getTokenSymbol(transaction.get("token_address")),
          amount:
            transaction.get("to_address") === this.address
              ? "+" + web3.utils.fromWei(transaction.get("value")).toString()
              : "-" + web3.utils.fromWei(transaction.get("value")).toString(),
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
            status: transaction.get("confirmed"),
            id: transaction.id,
            type:
              transaction.get("to_address") === this.address
                ? "Received"
                : "Sent",
            token: this.getTokenSymbol(transaction.get("token_address")),
            amount:
              transaction.get("to_address") === this.address
                ? "+" + web3.utils.fromWei(transaction.get("value")).toString()
                : "-" + web3.utils.fromWei(transaction.get("value")).toString(),
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
            if (result.get("balance") && result.get("balance") !== "0") {
              this.assets.push({
                value: web3.utils.fromWei(result.get("balance")),
                token: "AVAX",
                name: "AVAX",
                id: result.id,
              });
            }
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
          status: transaction.get("confirmed"),
          id: transaction.id,
          token: "AVAX",
          amount:
            transaction.get("to_address") === this.address
              ? "+" + web3.utils.fromWei(transaction.get("value")).toString()
              : "-" + web3.utils.fromWei(transaction.get("value")).toString(),
          transaction: transaction.get("hash"),
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
            status: transaction.get("confirmed"),
            id: transaction.id,
            token: "AVAX",
            amount:
              transaction.get("to_address") === this.address
                ? "+" + web3.utils.fromWei(transaction.get("value")).toString()
                : "-" + web3.utils.fromWei(transaction.get("value")).toString(),
            transaction: transaction.get("hash"),
          });
        });
      });
    },
    getTokenSymbol(tokenAddress) {
      return this.tokenAddressSymbolMap[tokenAddress] || "";
    },
  },
};
</script>