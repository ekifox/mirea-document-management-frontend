<template>
    <router-link :to="to" v-slot="{ href, navigate, isActive, isExactActive }">
        <li class="nav-item">
            <a
                :class="['nav-link', isActive && 'active', isExactActive && 'active-exact']"
                :href="href"
                @click="navigate"
                >{{ name }}</a
            >
        </li>
    </router-link>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        to: String,
        name: String
    }
})
</script>
