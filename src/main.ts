import { BootstrapIconsPlugin } from 'bootstrap-icons-vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.css'

import App from './App.vue'
const app = createApp(App)

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Register.vue')
        },
        {
            path: '/document/create',
            name: 'documentCreate',
            component: () => import('@/views/document/Create.vue')
        },
        {
            path: '/document/upload/:id',
            name: 'documentUpload',
            props: true,
            component: () => import('@/views/document/Upload.vue')
        },
        {
            path: '/document/:id',
            name: 'documentGet',
            props: true,
            component: () => import('@/views/document/Get.vue')
        },
        {
            path: '/document/search',
            name: 'documentSearch',
            component: () => import('@/views/document/Search.vue')
        }
    ]
})

app.use(router)
app.use(BootstrapIconsPlugin)
app.use(Toast, { position: POSITION.TOP_RIGHT, timeout: 10000 })

app.mount('#app')
