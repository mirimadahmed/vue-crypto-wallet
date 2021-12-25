<template>
  <div class="referrals">
    <div class="row p-0 mx-0 my-5 referral-info">
      <div class="col-12 m-auto p-5 bg-light referral-info-holder">
        <div class="row">
          <div class="col-md-8 align-self-center">
            <h4>
              {{ $t("buy.heading") }}
            </h4>
          </div>

          <div class="col-md-4 align-self-center text-center">
            <img
              src="../assets/illustration-other 1.png"
              alt="graph-4"
              class="w-50"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row mx-0">
      <div class="col-md-6 px-5 mb-5 refer-box">
        <div class="bg-light p-3">
          <h5>{{ $t("buy.transactions_heading") }}</h5>
          <div class="text-center my-5" v-if="isLoadingBuyOrders">
            <b-spinner variant="primary" label="Spinning" small></b-spinner>
          </div>
          <div v-else>
            <b-table
              hover
              :items="buyOrders"
              :fields="['amount', 'date', 'time', 'status']"
            ></b-table>
            <p v-if="buyOrders.length === 0">
              {{ $t("buy.transactions_empty_message") }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 px-5 refer-box">
        <div class="bg-light p-3">
          <h5>{{ $t("buy.new_order_heading") }}</h5>
          <div class="text-center my-5" v-if="isLoadingNewOrder">
            <b-spinner variant="primary" label="Spinning" small></b-spinner>
          </div>
          <div v-else>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
const web3 = new moralis.Web3();
export default {
  data() {
    return {
      isLoadingNewOrder: true,
      isLoadingBuyOrders: true,
      user: null,
      buyOrders: [],
      rewards: [],
    };
  },
  created() {
    this.getUser();
    this.getbuyOrders();
    this.getRewards();
  },
  methods: {
    getUser() {
      this.user = moralis.User.current();
    },
    handleCopy() {
      this.$bvToast.toast("Link copied to clipboard", {
        title: "Copy",
        variant: "info",
        solid: true,
      });
    },
    getRewards() {
      this.isLoadingNewOrder = true;
      const query = new moralis.Query("ReferralReward");
      query.equalTo("user", this.user.get("email"));
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.rewards.push({
              amount: web3.utils.fromWei(result.get("amount").toString()),
              status: result.get("paid") ? "Paid" : "Pending",
              date: new Date(result.get("createdAt")).toLocaleDateString(
                "en-US"
              ),
            });
          });
        }
        this.isLoadingNewOrder = false;
      });
    },
    getbuyOrders() {
      this.isLoadingBuyOrders = true;
      const query = new moralis.Query("buyOrders");
      query.equalTo("userfrom", this.user.get("email"));
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.buyOrders.push({
              user: result.get("userto"),
              date: new Date(result.get("createdAt")).toLocaleDateString(
                "en-US"
              ),
            });
          });
        }
        this.isLoadingBuyOrders = false;
      });
    },
  },
};
</script>
<style>
@media (max-width: 768px) {
  .referral-info-holder {
    padding: 20px !important;
  }
  .referral-info {
    margin: 20px 0 !important;
  }
  .refer-box {
    margin: 0 0 10px 0 !important;
    padding: 0 !important;
  }
}
</style>