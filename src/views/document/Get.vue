<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 80%">
            <div class="card-header">Просмотр документа</div>
            <div class="card-body" v-if="document && document.user">
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
                            <label class="form-label">Название</label>
                            <input
                                type="text"
                                class="form-control"
                                :value="
                                    `${document.user.lastName} ${document.user.firstName} ${document.user.middleName}`
                                "
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

                        <button
                            type="button"
                            class="btn btn-success mr-3"
                            @click="publishFileButton()"
                            v-if="currentUserCreator && canBePublished"
                        >
                            Опубликовать
                        </button>

                        <button type="button" class="btn btn-primary mr-3" @click="showFileButton()">
                            Скачать PDF
                        </button>

                        <button
                            type="button"
                            class="btn btn-warning"
                            @click="uploadFileButton()"
                            v-if="currentUserCreator"
                        >
                            Обновить PDF
                        </button>
                    </div>
                    <div class="col-md-6 col-lg-8" style="height: 900px;">
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
import { stateUser } from '@/common/store'
import Loader from '@/components/loader/index.vue'

type documentInterface = paths['/document/{uuid}']['get']['responses']['200']['application/json']

const documentStatuses = {
    CREATED: 'Недавно создан',
    AUDITOR_REJECTED: 'Возвращен на доработку',
    AUDITOR_AWAITING: 'Проверяется аудиторами',
    PUBLISHED: 'Опубликован'
}

function useDocument(documentId: string) {
    const document = reactive({}) as documentInterface

    async function getDocumentData() {
        const { data } = await axios.get(`/document/${documentId}`)
        Object.assign(document, data)
    }

    return { document, getDocumentData }
}

function useDocumentButtons(documentId: string) {
    const toast = useToast()
    const router = useRouter()

    async function publishFileButton() {
        const { data } = await axios.post('/document/publish', {
            uuid: documentId
        })

        toast.success('Файл добавлен в поиск')
    }

    async function uploadFileButton() {
        router.push({ name: 'documentUpload', params: { id: documentId } })
    }

    async function auditorButton(isAgreed = false) {
        const { data } = await axios.post('/document/auditor', {
            documentId,
            isAgreed
        })

        if (!data) {
            return false
        }

        router.go(0)
    }

    return { publishFileButton, uploadFileButton, auditorButton }
}

function useDocumentComputed(document: documentInterface) {
    const currentUserCreator = computed(() => document.userId === stateUser.id)

    const canBePublished = computed(() => document.auditors && document.auditors.every(x => x.status === 'ACCEPTED'))

    const currentUserAuditor = computed(() =>
        document.auditors ? document.auditors.find(x => x.userId === stateUser.id && x.status === 'AWAITING') : false
    )

    const auditors = computed(() =>
        document.auditors && currentUserAuditor.value
            ? document.auditors.filter(x => x.userId !== stateUser.id)
            : document.auditors
    )

    return {
        canBePublished,
        currentUserAuditor,
        auditors,
        currentUserCreator
    }
}

function useDocumentLink(documentId: string) {
    const linkToPdf = ref('')
    const isPdfLoading = ref(true)

    async function getFileLink() {
        const { data } = await axios.post('/document/link', { uuid: documentId })
        linkToPdf.value = data
        isPdfLoading.value = false
    }

    async function showFileButton() {
        await getFileLink()
        const win = window.open(linkToPdf.value, '_blank')
        win!.focus()
    }

    return {
        linkToPdf,
        isPdfLoading,
        showFileButton,
        getFileLink
    }
}

export default defineComponent({
    components: {
        Loader
    },
    props: {
        id: String
    },
    setup(props) {
        const { document, getDocumentData } = useDocument(props.id!)
        const { uploadFileButton, publishFileButton, auditorButton } = useDocumentButtons(props.id!)
        const { canBePublished, currentUserAuditor, auditors, currentUserCreator } = useDocumentComputed(document)
        const { linkToPdf, isPdfLoading, showFileButton, getFileLink } = useDocumentLink(props.id!)

        onMounted(async () => {
            await getDocumentData()
            await getFileLink()

            setInterval(() => getDocumentData(), 3000)
        })

        return {
            document,
            linkToPdf,
            isPdfLoading,
            showFileButton,
            documentStatuses,
            uploadFileButton,
            publishFileButton,
            auditorButton,
            stateUser,
            canBePublished,
            currentUserAuditor,
            auditors,
            currentUserCreator
        }
    }
})
</script>
