import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/* eslint-disable no-new */
const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        user: null,
        referral: null
    },
    getters: {
        isLoggedIn(state) {
            return state.user
        },
        referredBy(state) {
            return state.referral
        }
    },
    mutations: {
        setAuthentication(state, user) {
            state.user = user;
        },
        setReferral(state, referral) {
            state.referral = referral;
        }
    }
})

export default store