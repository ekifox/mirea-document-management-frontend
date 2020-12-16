<template>
    <div class="justify-content-center">
        <div class="container mb-3">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Что будем искать?" />
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button">Поиск</button>
                </div>
            </div>
        </div>

        <div class="container mb-3">
            <div class="card" v-for="{ document, score } in response" :key="document.id">
                <div class="card-header">{{ document.title }}</div>
                <div class="card-body">
                    {{ score }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from '@/common/axios'
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { paths } from '@/common/openapi'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
    setup() {
        const toast = useToast()
        const response = ref<paths['/document/search']['post']['responses']['201']['application/json']>([])

        onMounted(async () => {
            const { data } = await axios.post('/document/search', {
                text: 'требований к системе'
            })

            response.value = data
        })

        return { response }
    }
})
</script>
