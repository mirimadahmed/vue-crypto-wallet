<template>
  <div id="app">
    <div id="nav" v-if="!isLoading">
      <Navbar />
    </div>
    <div v-if="!isLoading">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<script>
import axios from "axios";
import Navbar from "@/components/Navbar.vue";
import MoralisFactory from "./moralis";
const moralis = MoralisFactory();
export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  created() {
    this.$i18n.locale = this.$store.getters.lang;
    this.loadLanguageAsync();
  },
  methods: {
    loadLanguageAsync() {
      const query = new moralis.Query("Translation");
      const promises = [];
      promises.push(query.find().then((results) => {
        if (results.length > 0) {
          results.forEach((result) => {
            promises.push(
              axios.get(result.get("messages")._url).then((response) => {
                this.$i18n.setLocaleMessage(
                  result.get("shortname"),
                  response.data
                );
              })
            );
          });
        }
      }));
      Promise.all(promises).then(() => {
        this.isLoading = false;
      });
    },
  },
};
</script>