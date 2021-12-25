<template>
  <div class="referrals">
    <div class="row p-0 mx-0 my-5 referral-info">
      <div class="col-12 m-auto p-5 bg-light mt-5 referral-info-holder">
        <div class="row">
          <div class="col-md-8 align-self-center">
            <h4>
              {{ $t("referral.heading") }}
            </h4>
            <div class="col-md-12 my-3">
              <p style="overflow-wrap: break-word">
                <copy-to-clipboard
                  :text="`https://wallet-app-sardis.herokuapp.com/refer/${user.get(
                    'email'
                  )}`"
                  @copy="handleCopy"
                >
                  <a href="#" class="mr-2">
                    <b-icon icon="clipboard-check"></b-icon>
                  </a>
                </copy-to-clipboard>
                {{ $t("referral.unique_link") }}

                <a
                  :href="`https://wallet-app-sardis.herokuapp.com/refer/${user.get(
                    'email'
                  )}`"
                  target="_blank"
                >
                  https://wallet-app-sardis.herokuapp.com/refer/{{
                    user.get("email")
                  }}
                </a>
              </p>
            </div>
          </div>

          <div class="col-md-4 align-self-center text-center">
            <img
              src="../assets/illustration-graph 2.png"
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
          <h5>{{ $t("referral.referrals_heading") }}</h5>
          <div class="text-center my-5" v-if="isLoadingReferrals">
            <b-spinner variant="primary" label="Spinning" small></b-spinner>
          </div>
          <div v-else>
            <b-table
              hover
              :items="referrals"
              :fields="['user', 'date']"
            ></b-table>
            <p v-if="referrals.length === 0">
              {{ $t("referral.referrals_empty_message") }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 px-5 refer-box">
        <div class="bg-light p-3">
          <h5>{{ $t("referral.rewards_heading") }}</h5>
          <div class="text-center my-5" v-if="isLoadingRewards">
            <b-spinner variant="primary" label="Spinning" small></b-spinner>
          </div>
          <div v-else>
            <b-table
              hover
              :items="rewards"
              :fields="['amount', 'status', 'date']"
            ></b-table>
            <p v-if="rewards.length === 0">
              {{ $t("referral.rewards_empty_message") }}
            </p>
          </div>
        </div>
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
      isLoadingRewards: true,
      isLoadingReferrals: true,
      user: null,
      referrals: [],
      rewards: [],
    };
  },
  created() {
    this.getUser();
    this.getReferrals();
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
      this.isLoadingRewards = true;
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
        this.isLoadingRewards = false;
      });
    },
    getReferrals() {
      this.isLoadingReferrals = true;
      const query = new moralis.Query("Referrals");
      query.equalTo("userfrom", this.user.get("email"));
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.referrals.push({
              user: result.get("userto"),
              date: new Date(result.get("createdAt")).toLocaleDateString(
                "en-US"
              ),
            });
          });
        }
        this.isLoadingReferrals = false;
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