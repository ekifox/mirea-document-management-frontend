<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 80%">
            <div class="card-header">Просмотр документа</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 col-lg-4">
                        <div class="mb-3">
                            <label class="form-label">Название</label>
                            <input type="text" class="form-control" :value="document.title" disabled />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Статус</label>
                            <input
                                type="text"
                                class="form-control"
                                :value="documentStatuses[document.status]"
                                disabled
                            />
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Опубликован</label>
                            <input
                                type="text"
                                class="form-control"
                                :value="document.isAgreed ? 'Да' : 'Нет'"
                                disabled
                            />
                        </div>

                        <div class="mb-3">
                            <label for="input-title" class="form-label">Список аудиторов</label>
                            <ul class="list-group mb-2">
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-center"
                                    v-if="currentUserAuditor"
                                >
                                    <div><b-icon-person-square /> Вы</div>
                                    <div class="btn-group btn-group-toggle">
                                        <label class="btn btn-success btn-sm" @click="auditorButton(true)">
                                            Принять
                                        </label>
                                        <label class="btn btn-danger btn-sm" @click="auditorButton(false)">
                                            Отклонить
                                        </label>
                                    </div>
                                </li>
                            </ul>
                            <ul class="list-group">
                                <li
                                    class="list-group-item d-flex justify-content-between align-items-center"
                                    v-for="auditor in auditors"
                                    :key="auditor.id"
                                >
                                    <div>
                                        {{ auditor.user.lastName }} {{ auditor.user.firstName }}
                                        {{ auditor.user.middleName }}
                                    </div>
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

                        <button type="button" class="btn btn-primary mr-3" @click="showFileButton()">
                            Скачать PDF
                        </button>

                        <button type="button" class="btn btn-success" @click="publishFileButton()">
                            Опубликовать
                        </button>
                    </div>
                    <div class="col-md-6 col-lg-8" style="height: 800px;">
                        <div v-if="isPdfLoading"><Loader /></div>
                        <object
                            v-else
                            :data="linkToPdf + '#view=FitH'"
                            type="application/pdf"
                            style="width: 100%; height: 100%"
                        >
                            <embed :src="linkToPdf + '#view=FitH'" type="application/pdf" />
                        </object>
                    </div>
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
import Loader from '@/components/loader/index.vue'
import { stateUser } from '@/common/store'

export default defineComponent({
    components: {
        Loader
    },
    props: {
        id: String
    },
    setup(props) {
        const toast = useToast()
        const router = useRouter()

        const document = reactive({}) as paths['/document/{uuid}']['get']['responses']['200']['application/json']

        const linkToPdf = ref('')
        const isPdfLoading = ref(true)

        async function getDocumentData() {
            const { data } = await axios.get(`/document/${props.id}`)
            Object.assign(document, data)
        }

        async function getFileLink() {
            const { data } = await axios.post('/document/link', { uuid: props.id })
            linkToPdf.value = data
            isPdfLoading.value = false
        }

        // buttons

        async function showFileButton() {
            const win = window.open(linkToPdf.value, '_blank')
            win!.focus()
        }

        async function publishFileButton() {
            const { data } = await axios.post('/document/publish', {
                uuid: props.id
            })

            toast.success('Файл добавлен в поиск')
        }

        async function auditorButton(isAgreed = false) {
            const { data } = await axios.post('/document/auditor', {
                documentId: props.id,
                isAgreed
            })

            if (!data) {
                return false
            }

            router.go(0)
        }

        // main

        onMounted(async () => {
            await getDocumentData()
            await getFileLink()
        })

        const canBePublished = computed(
            () => document.auditors && document.auditors.every(x => x.status === 'ACCEPTED')
        )

        const currentUserAuditor = computed(() =>
            document.auditors
                ? document.auditors.find(x => x.userId === stateUser.id && x.status === 'AWAITING')
                : false
        )

        const auditors = computed(() =>
            document.auditors && currentUserAuditor.value
                ? document.auditors.filter(x => x.userId !== stateUser.id)
                : document.auditors
        )

        const documentStatuses = {
            CREATED: 'Недавно создан',
            AUDITOR_REJECTED: 'Возвращен на доработку',
            AUDITOR_AWAITING: 'Проверяется аудиторами',
            PUBLISHED: 'Опубликован'
        }

        return {
            document,
            linkToPdf,
            isPdfLoading,
            canBePublished,
            showFileButton,
            publishFileButton,
            auditorButton,
            stateUser,
            currentUserAuditor,
            auditors,
            documentStatuses
        }
    }
})
</script>
