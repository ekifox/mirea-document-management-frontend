<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Регистрация</div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="input-login" class="form-label">Логин</label>
                    <input type="text" class="form-control" id="input-login" v-model="login" />
                </div>
                <div class="mb-3">
                    <label for="input-password" class="form-label">Пароль</label>
                    <input type="password" class="form-control" id="input-password" v-model="password" />
                </div>
                <div class="mb-3">
                    <label for="input-password-confirmation" class="form-label">Повторный пароль</label>
                    <input
                        type="password"
                        class="form-control"
                        id="input-password-confirmation"
                        v-model="passwordConfirmation"
                    />
                </div>
                <button type="button" class="btn btn-primary" @click="registerButton()">Зарегистрироваться</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from '@/common/axios'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter()

        const login = ref('')
        const password = ref('')
        const passwordConfirmation = ref('')

        async function registerButton() {
            await axios.post('/authentication/register', {
                login: login.value,
                password: password.value,
                passwordConfirmation: passwordConfirmation.value
            })

            router.push({ name: 'userEdit' })
        }

        return { login, password, passwordConfirmation, registerButton }
    }
})
</script>
