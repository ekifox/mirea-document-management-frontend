<template>
    <div class="container-fluid" style="max-width: 85%">
        <h2 class="mb-3">Пользователи</h2>
        <div class="table-responsive">
            <table class="table table-hover table-striped table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>

                        <th scope="col">Фамилия</th>
                        <th scope="col">Имя</th>
                        <th scope="col">Отчество</th>
                        <th scope="col">Номер телефона</th>
                        <th scope="col">EMail</th>
                        <th scope="col">Дата рождения</th>
                        <th scope="col">Департамент</th>
                        <th scope="col">Дата регистрации</th>
                        <th scope="col">Верификация</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <th scope="row">{{ user.id }}</th>
                        <td>{{ user.lastName }}</td>
                        <td>{{ user.firstName }}</td>
                        <td>{{ user.middleName }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.dateOfBirth }}</td>
                        <td>{{ user.department.name }}</td>
                        <td>{{ user.createdAt }}</td>
                        <td>
                            <span class="badge badge-secondary" v-if="user.verified">Подтвержден</span>
                            <button type="button" class="btn btn-sm btn-success" v-else @click="activateUser(user.id)">
                                Активировать
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from '@/common/axios'
import moment from 'moment'
import { useRouter } from 'vue-router'

export default defineComponent({
    setup() {
        const router = useRouter()
        const users = ref([])

        async function activateUser(userId: number) {
            await axios.post('/admin/user/verify', { userId })
            router.go(0)
        }

        async function getUsers() {
            const { data } = await axios.get('/admin/user/list')
            for (const user of data) {
                user.createdAt = moment(user.createdAt).format('YYYY-MM-DD HH:mm:ss')
            }
            users.value = data
        }

        onMounted(() => getUsers())

        return {
            users,
            activateUser
        }
    }
})
</script>
