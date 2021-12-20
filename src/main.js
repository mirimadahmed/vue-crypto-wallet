import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.prototype.$name = "SARDIS"

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn) next({ name: 'Auth' })
    else if (store.getters.isLoggedIn && to.name === 'Auth') next({ name: 'Wallet' })
    else next()
})

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')