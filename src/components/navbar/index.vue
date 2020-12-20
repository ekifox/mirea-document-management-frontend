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
            <template v-if="stateIsUserAuthed">
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <RouterItem to="/document/search" name="Поиск" />
                        <RouterItem to="/document/create" name="Добавить документ" />
                        <RouterItem
                            to="/admin/users"
                            name="Просмотреть пользователей"
                            v-if="stateUser.role === 'ADMIN'"
                        />
                    </ul>
                </div>
                <form class="form-inline">
                    <b-icon-person-fill class="mr-2" />
                    <div style="cursor: pointer" @click="$router.push({ name: 'userEdit' })">
                        {{ stateUser.lastName }} {{ stateUser.firstName }} {{ stateUser.middleName }}
                    </div>
                </form>
            </template>
            <template v-else>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav">
                        <RouterItem to="/login" name="Аутентификация" />
                        <RouterItem to="/register" name="Регистрация" />
                    </ul>
                </div>
            </template>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import RouterItem from '@/components/routeritem/index.vue'
import { stateUser, stateIsUserAuthed, actionLoadUser } from '@/common/store'

export default defineComponent({
    components: {
        RouterItem
    },
    setup() {
        onMounted(() => actionLoadUser())

        return { stateUser, stateIsUserAuthed }
    }
})
</script>
