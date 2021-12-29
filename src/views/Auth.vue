<template>
  <div class="holder">
    <div v-if="step === 0">
      <div class="auth col-12 pt-5 px-5">
        <div class="row m-auto px-5 rounded-lg auth-wrapper">
          <div class="col-md-6 p-5 auth-boxes">
            <div class="row bg-light p-3">
              <div class="col-12">
                <img
                  src="../assets/illustration-robot 3.png"
                  alt="robo-1"
                  class="w-25 float-left robo"
                />
              </div>
              <div class="col-8">
                <p>{{ $t('auth.login.info') }}</p>
                <h4>{{ $t('auth.login.heading') }}</h4>
              </div>
              <div class="col-12 pt-5">
                <button class="btn btn-secondary btn-small" @click="step = 1">
                  {{ $t('auth.login.button') }}
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 p-5 auth-boxes">
            <div class="row bg-light p-3">
              <div class="col-12">
                <img
                  src="../assets/illustration-robot 1.png"
                  alt="robo-1"
                  class="w-25 float-left robo"
                />
              </div>
              <div class="col-8">
                <p>{{ $t('auth.signup.info') }}</p>
                <h4>{{ $t('auth.signup.heading') }}</h4>
              </div>
              <div class="col-12 pt-5">
                <button class="btn btn-primary btn-small" @click="step = 2">
                  {{ $t('auth.signup.button') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="step === 1" class="auth col-12 pt-5 px-5 auth-child">
      <div class="row m-auto px-5 rounded-lg auth-boxes">
        <div class="bg-light p-3 m-auto auth-child-wrapper">
          <Login @email-not-set="step = 2" @back="step = 0" @signup="step = 2" />
        </div>
      </div>
    </div>
    <div v-if="step === 2" class="auth col-12 pt-5 px-5 auth-child">
      <div class="row m-auto px-5 rounded-lg auth-boxes">
        <div class="bg-light p-3 m-auto auth-child-wrapper">
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
  created() {
    if (this.$route.params.ref) {
      this.$store.commit("setReferral", this.$route.params.ref);
      this.$router.push('/auth')
    }

  }
};
</script>

<style>
.robo {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

@media (max-width: 768px) {
  .auth-child-wrapper {
    width: 100% !important;
    margin: 0 !important;
    padding: 20 !important;
  }
  .auth-wrapper,  .auth-child {
    width: 100%;
    padding: 0 !important;
  }
  .auth-boxes {
    width: 100%;
    padding: 10px !important;
  }
 }

</style>