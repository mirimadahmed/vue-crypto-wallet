<template>
  <div id="app">
    <div id="nav">
      <Navbar />
    </div>
    <div class="px-5 py-3">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
</style>
<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>