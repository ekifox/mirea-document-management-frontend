<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Аутентификация</div>
            <div class="card-body">
                <form>
                    <div class="mb-3">
                        <label for="input-login" class="form-label">Логин</label>
                        <input type="text" class="form-control" id="input-login" v-model="login" />
                    </div>
                    <div class="mb-3">
                        <label for="input-password" class="form-label">Пароль</label>
                        <input type="password" class="form-control" id="input-password" v-model="password" />
                    </div>
                    <button type="button" class="btn btn-primary" @click="sendRequest()">Войти</button>
                    <button type="button" class="ml-3 btn btn-secondary" @click="$router.push('/register')">
                        Регистрация
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/common/axios'

export default defineComponent({
    setup() {
        const login = ref('')
        const password = ref('')

        return { login, password, toast: useToast() }
    },
    methods: {
        async sendRequest() {
            await axios.post('/authentication/login', {
                login: this.login,
                password: this.password
            })

            return
        }
    }
})
</script>
