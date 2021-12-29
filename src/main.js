import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueI18n from 'vue-i18n'
import en from '@/lang/en.json'
import tr from '@/lang/tr.json'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './registerServiceWorker'
import MoralisFactory from './moralis'
const moralis = MoralisFactory();

Vue.use(VueI18n)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.prototype.$name = "SARDIS"

Vue.config.productionTip = false

const i18n = new VueI18n({
    locale: "en", // set locale
    fallbackLocale: "tr",
    messages: { en, tr }// set locale messages
})

router.beforeEach((to, from, next) => {
    if (store.getters.isLoggedIn) {
        const user = moralis.User.current();
        if (!user) {
            store.commit("setAuthentication", null);
            next({ name: "Auth" });
        } else {
            user.fetch().then(() => {
                if (user.get('deleted')) {
                    moralis.User.logOut().then(() => {
                        store.commit("setAuthentication", null);
                        next({ name: "Auth" });
                    });
                }
            });
        }
    }
    if (to.matched.some(record => record.meta.requiresAuth) && !store.getters.isLoggedIn) next({ name: 'Auth' })
    else if (store.getters.isLoggedIn && to.name === 'Auth') next({ name: 'Wallet' })
    else if (store.getters.isLoggedIn && to.name !== 'Wallet') {
        // Check if user has approved kyc
        if (MoralisFactory().User.current().get("kyc") === 2) next()
        else next({ name: 'Wallet' })
        // else send to wallet
    }
    else next()
})

new Vue({
    i18n,
    store,
    router,
    render: h => h(App)
}).$mount('#app')