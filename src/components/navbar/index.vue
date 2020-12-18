<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">DocumentManagement</a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" v-if="!user">
                <ul class="navbar-nav">
                    <RouterItem to="/login" name="Аутентификация" />
                    <RouterItem to="/register" name="Регистрация" />
                </ul>
            </div>
            <div class="collapse navbar-collapse" v-else>
                <ul class="navbar-nav">
                    <RouterItem to="/document/search" name="Поиск" />
                    <RouterItem to="/document/create" name="Добавить документ" />
                </ul>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { paths } from '@/common/openapi'
import axios from '../../common/axios'
import RouterItem from '@/components/routeritem'

export default defineComponent({
    components: {
        RouterItem
    },
    setup() {
        const user = reactive({}) //as paths['/user']['get']['responses']['200']

        async function loadUser() {
            const { data } = await axios.get('/user')
            Object.assign(user, data)
        }

        return { user }
    }
})
</script>
