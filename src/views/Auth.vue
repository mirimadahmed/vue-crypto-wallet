<template>
  <div class="holder">
    <div v-if="step === 0">
      <div class="auth col-12 pt-5 px-5">
        <div class="row m-auto px-5 rounded-lg">
          <div class="col-6 p-5">
            <div class="row bg-light p-3">
              <div class="col-12">
                <img
                  src="../assets/illustration-robot 3.png"
                  alt="robo-1"
                  class="w-25 float-left robo"
                />
              </div>
              <div class="col-8">
                <p>WELCOME BACK!</p>
                <h4>Access your existing Sardis wallet here.</h4>
              </div>
              <div class="col-12 pt-5">
                <button class="btn btn-secondary btn-small" @click="step = 1">
                  ACCESS WALLET
                </button>
              </div>
            </div>
          </div>
          <div class="col-6 p-5">
            <div class="row bg-light p-3">
              <div class="col-12">
                <img
                  src="../assets/illustration-robot 1.png"
                  alt="robo-1"
                  class="w-25 float-left robo"
                />
              </div>
              <div class="col-8">
                <p>NEW TO SARDIS?</p>
                <h4>Create a new wallet to send and receive Sardis.</h4>
              </div>
              <div class="col-12 pt-5">
                <button class="btn btn-primary btn-small" @click="step = 2">
                  CREATE NEW WALLET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="step === 1" class="auth col-12 pt-5 px-5">
      <div class="row m-auto px-5 rounded-lg">
        <div class="col-8 bg-light p-3 m-auto">
          <Login @back="step = 0" @signup="step = 2" />
        </div>
      </div>
    </div>
    <div v-if="step === 2" class="auth col-12 pt-5 px-5">
      <div class="row m-auto px-5 rounded-lg">
        <div class="col-8 bg-light p-3 m-auto">
          <Signup @back="step = 0" @login="step = 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Signup from "@/components/Signup.vue";
export default {
  components: {
    Login,
    Signup,
  },
  data() {
    return {
      step: 0,
      form: {
        email: "",
        password: "",
      },
    };
  },
};
</script>

<style>
.robo {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>