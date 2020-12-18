<template>
    <NavBar />
    <router-view v-slot="{ Component }">
        <component class="pt-5" :is="Component" />
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
