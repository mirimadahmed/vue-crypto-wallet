<template>
  <div>
    <b-navbar toggleable="lg" variant="faded" type="light">
      <b-navbar-brand href="#">
        <router-link to="/">
          <img
            alt="Sardis logo"
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
            <router-link to="/auth">Login/Signup</router-link>
          </b-nav-item>
          <b-nav-item href="#" v-if="$store.getters.isLoggedIn">
            <router-link to="/onboard">Onboard</router-link>
          </b-nav-item>

          <b-nav-item-dropdown right>
            <template #button-content>
              <em>EN</em>
            </template>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">TR</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",
};
</script>
