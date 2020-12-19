<template>
    <div class="justify-content-center">
        <div class="container mb-3">
            <div class="row">
                <div class="input-group mb-3">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Что будем искать?"
                        v-model="searchText"
                        @keyup.enter="doSearch()"
                    />
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click="doSearch()">Поиск</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-5" v-if="isLoading">
            <div class="row">
                <img class="mx-auto d-block" src="@/assets/tail-spin.svg" height="64" />
            </div>
        </div>

        <div class="container" v-if="!isLoading && response.length === 0">
            <div class="row">
                <div class="jumbotron" style="width: 100%">
                    <div class="container">
                        <h1 class="display-4">Ни-че-го :(</h1>
                        <p class="lead">
                            На данный момент мы не смогли найти информацию в базе документов, проверьте правильность
                            запроса
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-fluid" style="width: 90%" v-if="!isLoading && response.length > 0">
            <div class="row">
                <div class="col-md-3" v-for="{ document, score, highlight } in response" :key="document.id">
                    <div class="card">
                        <div class="card-header">
                            <div @click="openDocument(document.id)">{{ document.title }}</div>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-dark" v-for="(text, index) in highlight" :key="index">
                                <p v-html="text" />
                            </div>
                            <span class="badge badge-primary mr-3">Score: {{ score }}</span>
                            <span class="badge badge-secondary"
                                >Автор: {{ document.user.lastName }} {{ document.user.firstName }}
                                {{ document.user.middleName }}</span
                            >
                        </div>
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

export default defineComponent({
    setup() {
        const searchText = ref('требований к системе')
        const isLoading = ref(false)

        const toast = useToast()
        const router = useRouter()
        const response = ref<paths['/document/search']['post']['responses']['201']['application/json']>([])

        async function doSearch() {
            isLoading.value = true

            const { data } = await axios.post('/document/search', {
                text: searchText.value
            })
            response.value = data

            isLoading.value = false
        }

        async function openDocument(id: string) {
            router.push({ name: 'documentGet', params: { id } })
        }

        return { response, searchText, doSearch, isLoading, openDocument }
    }
})
</script>
