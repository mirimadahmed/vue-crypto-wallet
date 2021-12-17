<template>
  <div>
    <div class="row p-4">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">ACCESS YOUR SARDIS WALLET</h2>
      </div>
      <div class="col-12">
        <a @click.prevent="$emit('signup')" href="#" class="text-center font-weight-lighter text-secondary">
         <p>Don't have wallet?</p>
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
      <div class="col-12 text-center">
        <b-button type="submit" variant="primary" @click="login()">
          ACCESS YOUR WALLET
        </b-button>
      </div>
      <div class="col-12 pt-5">
        <a @click.prevent="$emit('back')" href="#" class="text-center font-weight-light text-info">
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
    };
  },
  methods: {
    login() {
      MoralisFactory()
        .User.logIn(this.form.email, this.form.password, { usePost: true })
        .then((user) => console.log(user))
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style>
</style>