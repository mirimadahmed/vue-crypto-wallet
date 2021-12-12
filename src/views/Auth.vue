<template>
  <div class="auth px-5">
    <div class="px-5 w-50 m-auto">
      <b-tabs content-class="mt-3" justified>
        <b-tab title="Login" active>
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
            description="We'll never share your email with anyone else."
          >
            <b-form-input
              id="input-1"
              v-model="form.email"
              type="email"
              placeholder="Enter email"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group
            id="input-group-1"
            label="Password:"
            label-for="input-1"
            description="We'll never share your password with anyone else."
          >
            <b-form-input
              id="input-1"
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              required
            ></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Login</b-button>
        </b-tab>
        <b-tab title="Signup">
          <div v-if="step === 1">
            <b-form-group
              id="input-group-1"
              label="Email address:"
              label-for="input-1"
              description="We'll never share your email with anyone else."
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-1"
              label="Password:"
              label-for="input-1"
              description="Choose a complex password."
            >
              <b-form-input
                id="input-1"
                v-model="form.password"
                type="password"
                placeholder="Enter password"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-1"
              label="Confirm Password:"
              label-for="input-1"
              description="Enter again."
            >
              <b-form-input
                id="input-1"
                v-model="form.password"
                type="password"
                placeholder="Confirm password"
                required
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary" @click="step++"
              >Next</b-button
            >
          </div>
          <div v-if="step === 2">
            <b-form-group
              id="input-group-1"
              label="Name:"
              label-for="input-1"
              description="What do they call you?"
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="text"
                placeholder="Enter name"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-1"
              label="Surname:"
              label-for="input-1"
              description="What's your surname?"
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="text"
                placeholder="Enter surname"
                required
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-1"
              label="Username:"
              label-for="input-1"
              description="Let's setup a username?"
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="text"
                placeholder="Enter username"
                required
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="danger" @click="step--"
              >Back</b-button
            >
            <b-button type="submit" variant="primary" 
              >OK</b-button
            >
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      form: {
        email: "",
        password: "",
      },
    };
  },
};
</script>