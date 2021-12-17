<template>
  <div>
    <div class="row p-4" v-if="step === 1">
      <div class="col-12">
        <h2 class="p-2 mt-3 text-center">SETUP NEW SARDIS WALLET</h2>
      </div>
      <div class="col-12">
        <a @click.prevent="$emit('login')" href="#" class="text-center font-weight-lighter text-secondary">
         <p>Already have a wallet?</p>
        </a>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-3"
          label="Email address:"
          label-for="input-1"
          description="We'll never share your email with anyone else."
        >
          <b-form-input
            id="input-3"
            v-model="form.email"
            type="email"
            placeholder="Enter email"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group id="input-group-4" label="Password:" label-for="input-1">
          <b-form-input
            id="input-4"
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            required
          ></b-form-input>
          <password
            v-model="form.password"
            :strength-meter-only="true"
            @score="setScore"
          />
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group
          id="input-group-5"
          label="Confirm Password:"
          label-for="input-1"
          description="Enter again."
        >
          <b-form-input
            id="input-5"
            v-model="form.confirmpassword"
            type="password"
            placeholder="Confirm password"
            :state="passwordConfirmationRule"
            required
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 text-center">
        <b-button type="submit" variant="primary" @click="signup()"
          >CREATE WALLET</b-button
        >
      </div>
      <div class="col-12 pt-5">
        <a @click.prevent="$emit('back')" href="#">
          <p class="text-center text-muted font-weight-light">CANCEL</p>
        </a>
      </div>
    </div>
    <div class="row" v-if="step === 2">
      <b-form-group
        id="input-group-6"
        label="Name:"
        label-for="input-1"
        description="What do they call you?"
      >
        <b-form-input
          id="input-6"
          v-model="form.name"
          type="text"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-7"
        label="Surname:"
        label-for="input-1"
        description="What's your surname?"
      >
        <b-form-input
          id="input-7"
          v-model="form.surname"
          type="text"
          placeholder="Enter surname"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-8"
        label="Username:"
        label-for="input-1"
        description="Let's setup a username?"
      >
        <b-form-input
          id="input-8"
          v-model="form.username"
          type="text"
          placeholder="Enter username"
          required
        ></b-form-input>
      </b-form-group>
      <b-button block type="submit" variant="danger" @click="step--"
        >Back</b-button
      >
      <b-button block type="submit" variant="primary">OK</b-button>
      <p class="text-center" @click="$emit('back')">Cancel</p>
    </div>
  </div>
</template>

<script>
import Password from "vue-password-strength-meter";
import MoralisFactory from "@/moralis";
const moralis = MoralisFactory();
export default {
  components: {
    Password,
  },
  data() {
    return {
      step: 1,
      form: {
        email: "",
        password: "",
        confirmpassword: "",
        name: "",
        surname: "",
        username: "",
        score: 0,
      },
    };
  },
  computed: {
    passwordConfirmationRule() {
      return (
        this.form.score >= 3 && this.form.password === this.form.confirmpassword
      );
    },
  },
  methods: {
    setScore(score) {
      this.form.score = score;
    },
    signup() {
      if (this.form.score < 3) {
        alert("Password is not strong enough");
        return;
      }
      const user = new moralis.User();
      user.set("username", this.form.email);
      user.set("password", this.form.password);
      user.set("email", this.form.email);
      user.set("phone", "415-392-0202");
      user
        .signUp()
        .then((user) => console.log(user))
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style>
</style>