<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Аутентификация</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="input-login" class="form-label">Логин</label>
                    <input type="text" class="form-control" id="input-login" v-model="login" />
                </div>
                <div class="mb-3">
                    <label for="input-password" class="form-label">Пароль</label>
                    <input type="password" class="form-control" id="input-password" v-model="password" />
                </div>
                <button type="button" class="btn btn-primary" @click="auth()">Войти</button>
                <button type="button" class="ml-3 btn btn-secondary" @click="$router.push('/register')">
                    Регистрация
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios, { axiosStandartErrorHandler } from '@/common/axios'
import { useRouter } from 'vue-router'
import { stateIsUserAuthed } from '../../common/store'

export default defineComponent({
    setup() {
        const toast = useToast()
        const router = useRouter()

        const login = ref('')
        const password = ref('')

        async function auth() {
            try {
                const { data } = await axios.post('/authentication/login', {
                    login: login.value,
                    password: password.value
                })

                if (!data) {
                    return false
                }

                toast.success('Вы успешно вошли в аккаунт')

                router.push({ name: 'documentSearch' })
            } catch (e) {
                axiosStandartErrorHandler(e)
            }
        }

        if (stateIsUserAuthed.value) {
            router.push({ name: 'documentSearch' })
        }

        return { login, password, auth }
    }
})
</script>
