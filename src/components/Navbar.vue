<template>
  <div>
    <b-navbar toggleable="lg" variant="faded" type="light">
      <b-navbar-brand href="#">
        <router-link to="/">
          <img
            :alt="`${$name} logo`"
            src="../assets/logofull.png"
            class="img-small w-25 px-5"
          />
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" v-if="$store.getters.isLoggedIn">
            <router-link to="/wallet">Wallet</router-link>
          </b-nav-item>
          <b-nav-item href="#" v-if="$store.getters.isLoggedIn">
            <router-link to="/refferals">Referrals</router-link>
          </b-nav-item>
          <b-nav-item href="#" v-if="$store.getters.isLoggedIn">
            <a href="#" @click="logout">Logout</a>
          </b-nav-item>

          <b-nav-item-dropdown right>
            <template #button-content>
              English <country-flag country="usa" size="small" />
            </template>
            <b-dropdown-item href="#">
              <country-flag country="usa" size="small" /> English
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <country-flag country="tr" size="small" /> Turkish
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import CountryFlag from "vue-country-flag";
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
export default {
  name: "Navbar",
  components: {
    CountryFlag,
  },
  data() {
    return {
      deferredPrompt: null,
      count: 0
    };
  },
  mounted() {
    this.captureEvent();
  },
  methods: {
    logout() {
      moralis.User.logOut().then(() => {
        this.$store.commit("setAuthentication", null);
        this.$router.push("/");
      });
    },
    captureEvent() {
      window.addEventListener("beforeinstallprompt", (e) => {
        this.showToast();
        // ! Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
      });
    },
    clickCallback(id) {
      // Show the prompt
      this.$bvToast.hide(id);
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          // Call another function?
        }
        this.deferredPrompt = null;
      });
    },
    showToast() {
      // Use a shorter name for `this.$createElement`
      const h = this.$createElement;
      // Create a ID with a incremented count
      const id = `my-toast-${this.count++}`;

      // Create the custom close button
      const $closeButton = h(
        "b-button",
        {
          on: { click: () => this.clickCallback(id) },
        },
        "Add to home screen"
      );

      // Create the toast
      this.$bvToast.toast([$closeButton], {
        id: id,
        title: `Add Sardis to your home screen`,
        variant: "primary",
        solid: true
      });
    },
  },
};
</script>
