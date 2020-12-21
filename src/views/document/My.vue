<template>
    <div class="container-fluid" style="max-width: 85%">
        <h2 class="mb-3">Мои документы</h2>
        <div class="table-responsive">
            <table class="table table-hover table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">UUID</th>
                        <th scope="col">Название</th>
                        <th scope="col">Статус</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        style="cursor: pointer"
                        v-for="document in documentsList"
                        :key="document.id"
                        @click="documentGo(document.id)"
                    >
                        <th scope="row" class="text-truncate" style="max-width: 150px;">{{ document.id }}</th>
                        <td>{{ document.title }}</td>
                        <td>{{ documentStatuses[document.status] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from '@/common/axios'
import moment from 'moment'
import { useRouter } from 'vue-router'
import { documentStatuses } from '@/common/enum'

export default defineComponent({
    setup() {
        const router = useRouter()
        const documentsList = ref([])

        async function getDocuments() {
            const { data } = await axios.get('/document/mylist')
            documentsList.value = data
        }

        function documentGo(id: string) {
            router.push({ name: 'documentGet', params: { id } })
        }

        onMounted(() => getDocuments())

        return { documentStatuses, documentsList, documentGo }
    }
})
</script>
