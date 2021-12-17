import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/auth'
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Auth.vue'),
    },
    {
        path: '/onboard',
        name: 'Onboard',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Onboard.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/wallet',
        name: 'Wallet',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Wallet.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/refferals',
        name: 'Referrals',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Referrals.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '*',
        redirect: '/auth'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router