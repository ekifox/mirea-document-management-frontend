<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Загрузить документ</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="input-id" class="form-label">Идентификатор</label>
                    <input type="text" class="form-control" id="input-id" :value="id" disabled />
                </div>
                <div class="mb-3">
                    <label for="input-file" class="form-label">Файл</label>
                    <input type="file" class="form-control" id="input-file" @change="filePickedEvent" />
                </div>
                <button type="button" class="btn btn-primary" @click="uploadDocument()">Загрузить</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios, { axiosStandartErrorHandler } from '@/common/axios'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
    props: {
        id: String
    },
    setup(props) {
        const toast = useToast()
        const router = useRouter()

        let file: File

        function filePickedEvent(event: any) {
            file = event.target.files[0]
        }

        async function uploadDocument() {
            const formData = new FormData()
            formData.append('document', file)

            try {
                await axios.put('/document/upload', formData, {
                    params: {
                        uuid: props.id
                    }
                })

                toast.success('Файл загружен')

                router.push({ name: 'documentGet', params: { id: props.id! } })
            } catch (e) {
                axiosStandartErrorHandler(e)
            }
        }

        return { filePickedEvent, uploadDocument }
    }
})
</script>
