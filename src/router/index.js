import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ( /* webpackChunkName: "home" */ '../views/Home.vue')
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Auth.vue')
    },
    {
        path: '/onboard',
        name: 'Onboard',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Onboard.vue')
    },
    {
        path: '/wallet',
        name: 'Wallet',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Wallet.vue')
    },
    {
        path: '/refferals',
        name: 'Referrals',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Referrals.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router