import { createRouter, createWebHistory } from 'vue-router'
import { stateUser, stateIsUserAuthed, actionLoadUser } from '@/common/store'

enum EAuthRoutes {
    LOGIN = 'authLogin',
    REGISTER = 'authRegister',
    NOT_VERIFIED = 'authNotVerified'
}

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'main',
            component: () => import('@/views/Main.vue')
        },
        {
            path: '/login',
            name: EAuthRoutes.LOGIN,
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/register',
            name: EAuthRoutes.REGISTER,
            component: () => import('@/views/auth/Register.vue')
        },
        {
            path: '/verification',
            name: EAuthRoutes.NOT_VERIFIED,
            component: () => import('@/views/auth/NotVerified.vue')
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
        },
        {
            path: '/document/audit',
            name: 'documentAudit',
            component: () => import('@/views/document/Audit.vue')
        },
        {
            path: '/document/my',
            name: 'documentMy',
            component: () => import('@/views/document/My.vue')
        },
        {
            path: '/admin/users',
            name: 'adminUsers',
            component: () => import('@/views/admin/Users.vue')
        },
        {
            path: '/user/edit',
            name: 'userEdit',
            component: () => import('@/views/user/Edit.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('@/views/404.vue')
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const toRouteName = to.name!.toString()

    // Trying to access user data
    await actionLoadUser()

    // NOT_VERIFIED Route can be accessable anyway
    if (toRouteName === EAuthRoutes.NOT_VERIFIED) {
        return next()
    }

    // If user is not authed and he tries to access login page, we give him access
    if (!stateIsUserAuthed.value && (toRouteName === EAuthRoutes.LOGIN || toRouteName === EAuthRoutes.REGISTER)) {
        return next()
    }

    // If user not authed and tries access another page, we redirect him to login page
    if (!stateIsUserAuthed.value) {
        return next({ name: EAuthRoutes.LOGIN })
    }

    // If user is authed but not received verification yet, we redirect him to not-verified page
    if (stateIsUserAuthed.value && !stateUser.verified) {
        return next({ name: EAuthRoutes.NOT_VERIFIED })
    }

    // Anyway grant him access
    return next()
})

export default router
