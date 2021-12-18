<template>
  <div class="">
    <div class="row p-4 login-wrapper">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">ACCESS YOUR {{$name}} WALLET</h2>
      </div>
      <div class="col-12">
        <a
          @click.prevent="$emit('signup')"
          href="#"
          class="text-center font-weight-lighter text-secondary"
        >
          <p>Don't have a wallet?</p>
        </a>
      </div>
      <div class="col-12">
        <b-form-group id="input-group-1" label="Username:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.email"
            type="text"
            placeholder="Enter username"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group id="input-group-2" label="Password:" label-for="input-1">
          <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12" v-if="error">
        <p class="text-center font-weight-lighter text-danger">{{ error }}</p>
      </div>
      <div class="col-12 text-center">
        <b-button type="submit" variant="primary" @click="login()" :disabled="isLoading">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="isLoading"></span>
          <span class="sr-only" v-if="isLoading">Loading...</span>
          ACCESS YOUR WALLET
        </b-button>
      </div>
      <div class="col-12 pt-5">
        <a
          @click.prevent="$emit('back')"
          href="#"
          class="text-center font-weight-light text-info"
        >
          <p>CANCEL</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import MoralisFactory from "@/moralis";
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      error: null,
      isLoading: false
    };
  },
  methods: {
    login() {
      this.isLoading = true
      this.error = null
      MoralisFactory()
        .User.logIn(this.form.email, this.form.password, { usePost: true })
        .then((user) => {
          this.isLoading = false
          this.$store.commit("setAuthentication", user);
          this.$router.replace({ name: "Wallet" });
        })
        .catch((error) => {
          this.isLoading = false
          this.error = error.message
        });
    },
  },
};
</script>

<style>

@media (max-width: 768px) { 
  .login-wrapper {
    width: 100%;
    padding: 0 !important;
  }
  .auth-boxes {
    width: 100%;
    padding: 10px !important;
  }
 }

@media (min-width: 769px) { 
  .auth-boxes {
    width: 60%;
  }
 }
</style>