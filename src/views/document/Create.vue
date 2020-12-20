<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 40%;">
            <div class="card-header">Создать документ</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="input-title" class="form-label">Название</label>
                    <input type="text" class="form-control" id="input-title" v-model="title" />
                </div>
                <div class="mb-3">
                    <div class="form-group">
                        <label for="input-auditor-user-ids">Выберите аудиторов</label>
                        <select
                            multiple
                            class="form-control"
                            id="input-auditor-user-ids"
                            style="height: 20rem;"
                            v-model="selectedAuditorIds"
                        >
                            <option v-for="auditor in auditorIdsList" :key="auditor.userId" :value="auditor.userId">{{
                                auditor.name
                            }}</option>
                        </select>
                    </div>
                </div>
                <button type="button" class="btn btn-primary" @click="createDocument()">Создать</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from '@/common/axios'
import { defineComponent, onMounted, ref } from 'vue'
import { paths } from '@/common/openapi'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

interface IAuditorListItem {
    name: string
    userId: number
}

function useDepartment() {
    const auditorIdsList = ref<IAuditorListItem[]>([])

    async function loadDepartment() {
        const { data } = await axios.get<paths['/department']['get']['responses']['200']['application/json']>(
            '/department'
        )

        for (const department of data) {
            for (const user of department.users) {
                auditorIdsList.value.push({
                    name: `${user.lastName} ${user.firstName} ${user.middleName} - ${department.name}`,
                    userId: user.id
                })
            }
        }
    }

    return { auditorIdsList, loadDepartment }
}

function useDocument() {
    const router = useRouter()
    const toast = useToast()

    const title = ref<string>('')
    const selectedAuditorIds = ref<number[]>([])

    async function createDocument() {
        const { data } = await axios.put<paths['/document']['put']['responses']['201']['application/json']>(
            '/document',
            {
                title: title.value,
                auditorUserIds: selectedAuditorIds.value
            }
        )

        toast.success('Документ создан')

        router.push({ name: 'documentUpload', params: { id: data.id } })
    }

    return { title, selectedAuditorIds, createDocument }
}

export default defineComponent({
    setup() {
        const { auditorIdsList, loadDepartment } = useDepartment()
        const { title, selectedAuditorIds, createDocument } = useDocument()

        onMounted(() => loadDepartment())

        return { title, selectedAuditorIds, auditorIdsList, createDocument }
    }
})
</script>
