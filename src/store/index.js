import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        user: null,
        referral: null,
        lang: "en"
    },
    getters: {
        isLoggedIn(state) {
            return state.user
        },
        referredBy(state) {
            return state.referral
        },
        lang(state) {
            return state.lang
        },
    },
    mutations: {
        setAuthentication(state, user) {
            state.user = user;
        },
        setReferral(state, referral) {
            state.referral = referral;
        },
        setLang(state, lang) {
            state.lang = lang;
        }
    }
})

export default store