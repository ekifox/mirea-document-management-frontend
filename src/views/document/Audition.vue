<template>
    <div class="container-fluid" style="max-width: 85%">
        <h2 class="mb-3">Документы для аудита</h2>
        <div class="table-responsive">
            <table class="table table-hover table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">UUID</th>
                        <th scope="col">Название</th>
                        <th scope="col">Департамент</th>
                        <th scope="col">Автор</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="{ document } in documentAuditionList" :key="document.id">
                        <th scope="row" class="text-truncate" style="max-width: 150px;">{{ document.id }}</th>
                        <td>{{ document.title }}</td>
                        <td>{{ document.user.department.name }}</td>
                        <td>
                            {{ document.user.lastName }} {{ document.user.firstName }} {{ document.user.middleName }}
                        </td>
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

export default defineComponent({
    setup() {
        const router = useRouter()
        const documentAuditionList = ref([])

        async function getUsers() {
            const { data } = await axios.get('/document/auditor/list')

            documentAuditionList.value = data
        }

        onMounted(() => getUsers())

        return {
            documentAuditionList
        }
    }
})
</script>
