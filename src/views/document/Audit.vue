<template>
    <div class="container-fluid" style="max-width: 85%" v-if="documentAuditList.length > 0">
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
                    <tr
                        style="cursor: pointer"
                        v-for="{ document } in documentAuditList"
                        :key="document.id"
                        @click="documentGo(document.id)"
                    >
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
    <div class="container" v-else>
        <div class="row">
            <div class="jumbotron" style="width: 100%">
                <div class="container">
                    <h1 class="display-4">Ни-че-го :(</h1>
                    <p class="lead">
                        На данный момент документов для аудита вами нет
                    </p>
                </div>
            </div>
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
        const documentAuditList = ref([])

        async function getDocuments() {
            const { data } = await axios.get('/document/auditor/list')
            documentAuditList.value = data
        }

        function documentGo(id: string) {
            router.push({ name: 'documentGet', params: { id } })
        }

        onMounted(() => getDocuments())

        return {
            documentAuditList,
            documentGo
        }
    }
})
</script>
