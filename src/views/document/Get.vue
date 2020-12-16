<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Просмотр документа</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="input-title" class="form-label">Название</label>
                    <input type="text" class="form-control" id="input-title" :value="document.title" disabled />
                </div>

                <div class="mb-3">
                    <label for="input-title" class="form-label">Статус</label>
                    <input type="text" class="form-control" id="input-title" :value="document.status" disabled />
                </div>

                <div class="mb-3">
                    <label for="input-title" class="form-label">Опубликован</label>
                    <input type="text" class="form-control" id="input-title" :value="document.isAgreed" disabled />
                </div>

                <button type="button" class="btn btn-primary" @click="showFile()">Просмотреть</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from '@/common/axios'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { paths } from '@/common/openapi'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export default defineComponent({
    props: {
        id: Number
    },
    setup(props) {
        const document = reactive({}) as paths['/document/{uuid}']['get']['responses']['200']['application/json']

        onMounted(async () => {
            const { data } = await axios.get(`/document/${props.id}`)
            Object.assign(document, data)
        })

        async function showFile() {
            const { data } = await axios.post('/document/link', {
                uuid: props.id
            })

            const win = window.open(data.url, '_blank')
            win!.focus()
        }

        return { document, showFile }
    }
})
</script>
