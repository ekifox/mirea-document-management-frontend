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
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav">
                    <NavBar to="/login" name="Аутентификация" />
                    <NavBar to="/register" name="Регистрация" />
                </ul>
            </div>
        </div>
    </nav>

    <router-view v-slot="{ Component }">
        <suspense>
            <template #default>
                <component class="pt-5" :is="Component" />
            </template>
            <template #fallback>
                <div>
                    Loading...
                </div>
            </template>
        </suspense>
    </router-view>
</template>

<script>
import NavBar from '@/components/navbar'

export default {
    components: {
        NavBar
    }
}
</script>
