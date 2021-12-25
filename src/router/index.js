import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/auth'
    },
    {
        path: '/refer/:ref',
        name: 'AuthWithRef',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Auth.vue'),
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
        path: '/buy',
        name: 'Buy',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Buy.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/enable-2fa',
        name: '2FA',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/2FA.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/send/:token',
        name: 'Send',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Send.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router