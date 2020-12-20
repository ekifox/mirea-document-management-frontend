<template>
    <div class="d-flex justify-content-center">
        <div class="card" style="width: 30rem;">
            <div class="card-header">Обновить свои данные</div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Фамилия</label>
                    <input type="text" class="form-control" v-model="stateUser.lastName" placeholder="Иванович" />
                </div>

                <div class="mb-3">
                    <label class="form-label">Имя</label>
                    <input type="text" class="form-control" v-model="stateUser.firstName" placeholder="Иван" />
                </div>

                <div class="mb-3">
                    <label class="form-label">Отчество</label>
                    <input type="text" class="form-control" v-model="stateUser.middleName" placeholder="Иванов" />
                </div>

                <div class="mb-3">
                    <label class="form-label">Номер телефона</label>
                    <input type="text" class="form-control" v-model="stateUser.phone" placeholder="+79991113344" />
                </div>
                <div class="mb-3">
                    <label class="form-label">E-Mail</label>
                    <input
                        type="text"
                        class="form-control"
                        v-model="stateUser.email"
                        placeholder="admin@localhost.com"
                    />
                </div>
                <div class="mb-3">
                    <label class="form-label">Дата рождения</label>
                    <input type="text" class="form-control" v-model="stateUser.dateOfBirth" placeholder="1985-05-25" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Департамент</label>
                    <select class="form-control" v-model="stateUser.departmentId">
                        <option disabled selected hidden>Выберите...</option>
                        <option v-for="department in departments" :key="department.id" :value="department.id">{{
                            department.name
                        }}</option>
                    </select>
                </div>
                <button type="button" class="btn btn-primary" @click="updateUser()">Обновить</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from '@/common/axios'
import { defineComponent, onMounted, ref } from 'vue'
import { paths } from '@/common/openapi'
import { useToast } from 'vue-toastification'
import { stateUser } from '@/common/store'

export default defineComponent({
    setup() {
        const toast = useToast()

        const departments = ref<any>([])

        async function loadDepartment() {
            const { data } = await axios.get<paths['/department']['get']['responses']['200']['application/json']>(
                '/department'
            )

            for (const department of data) {
                departments.value.push({
                    id: department.id,
                    name: department.name
                })
            }
        }

        async function updateUser() {
            await axios.patch('/user', stateUser)
            toast.success('Данные обновлены')
        }

        onMounted(() => loadDepartment())

        return { stateUser, departments, updateUser }
    }
})
</script>
