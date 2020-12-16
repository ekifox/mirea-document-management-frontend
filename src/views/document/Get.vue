<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Просмотр документа</div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Название</label>
                    <input type="text" class="form-control" :value="document.title" disabled />
                </div>

                <div class="mb-3">
                    <label class="form-label">Статус</label>
                    <input type="text" class="form-control" :value="document.status" disabled />
                </div>

                <div class="mb-3">
                    <label class="form-label">Опубликован</label>
                    <input type="text" class="form-control" :value="document.isAgreed ? 'Да' : 'Нет'" disabled />
                </div>

                <div class="mb-3">
                    <label for="input-title" class="form-label">Список аудиторов</label>
                    <ul class="list-group">
                        <li
                            class="list-group-item d-flex justify-content-between align-items-center"
                            v-for="auditor in document.auditors"
                            :key="auditor.id"
                        >
                            {{ auditor.user.lastName }} {{ auditor.user.firstName }} {{ auditor.user.middleName }}
                            <span class="badge badge-pill badge-warning" v-if="auditor.status === 'AWAITING'"
                                >Ожидание</span
                            >
                            <span class="badge badge-pill badge-success" v-if="auditor.status === 'ACCEPTED'"
                                >Согласован</span
                            >
                            <span class="badge badge-pill badge-danger" v-if="auditor.status === 'REJECTED'"
                                >Не согласован</span
                            >
                        </li>
                    </ul>
                </div>

                <button type="button" class="btn btn-primary" @click="showFile()">Просмотреть PDF</button>

                <button type="button" class="btn btn-success ml-3" @click="publishFile()">
                    Опубликовать
                </button>
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
    props: {
        id: String
    },
    setup(props) {
        const toast = useToast()
        const document = reactive({}) as paths['/document/{uuid}']['get']['responses']['200']['application/json']

        onMounted(async () => {
            const { data } = await axios.get(`/document/${props.id}`)
            Object.assign(document, data)
        })

        const canBePublished = computed(
            () => document.auditors && document.auditors.every(x => x.status === 'ACCEPTED')
        )

        async function showFile() {
            const { data } = await axios.post('/document/link', {
                uuid: props.id
            })

            const win = window.open(data.url, '_blank')
            win!.focus()
        }

        async function publishFile() {
            const { data } = await axios.post('/document/publish', {
                uuid: props.id
            })

            toast.success('Файл добавлен в поиск')
        }

        return { document, showFile, canBePublished, publishFile }
    }
})
</script>
