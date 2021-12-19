<template>
  <div class="referrals">
    <div class="row p-0 mx-0 my-5 referral-info">
      <div class="col-12 m-auto p-5 bg-light mt-5 referral-info-holder">
        <div class="row">
          <div class="col-md-8 align-self-center">
            <h4>
              Refer Sardis to your friends, you both earn 10% on their first
              purchase.
            </h4>
            <div class="col-md-12 my-3">
              <p style="overflow-wrap: anywhere">
                <copy-to-clipboard
                  :text="`https://wallet-app-sardis.herokuapp.com/refer/${user.get('email')}`"
                  @copy="handleCopy"
                >
                  <a href="#" class="mr-2">
                    <b-icon icon="clipboard-check"></b-icon>
                  </a>
                </copy-to-clipboard>
                Your unique link:
                <a
                  :href="`https://wallet-app-sardis.herokuapp.com/refer/${user.get('email')}`"
                  target="_blank"
                >
                  https://wallet-app-sardis.herokuapp.com/refer/{{ user.get('email') }}
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
          <h5>Friends who have signed up with your unique link</h5>
          <div class="text-center my-5" v-if="isLoadingReferrals">
            <b-spinner variant="primary" label="Spinning" small></b-spinner>
          </div>
          <div v-else>
            <b-table
              hover
              :items="referrals"
              :fields="['user', 'dated']"
            ></b-table>
            <p v-if="referrals.length === 0">
              Feeling lonely here? You can invite your friends to join Sardis
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-6 px-5 refer-box">
        <div class="bg-light p-3">
          <h5>Rewards earned</h5>
          <div class="text-center my-5" v-if="isLoadingRewards">
            <b-spinner variant="primary" label="Spinning" small></b-spinner>
          </div>
          <div v-else>
            <b-table
              hover
              :items="rewards"
              :fields="['amount', 'paid', 'dated']"
            ></b-table>
            <p v-if="rewards.length === 0">
              You haven't earned any rewards yet.
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
      const query = new moralis.Query("ReferralRewards");
      query.equalTo("user", this.user);
      query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            this.rewards.push({
              amount: result.get("amount"),
              paid: result.get("paid"),
              dated: new Date(result.get("createdAt")).toLocaleDateString("en-US"),
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
              dated: new Date(result.get("createdAt")).toLocaleDateString("en-US"),
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