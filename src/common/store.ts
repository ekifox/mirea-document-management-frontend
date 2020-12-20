import { computed, reactive } from 'vue'
import axios from './axios'
import { paths } from './openapi'

export const stateUser = reactive<paths['/user']['get']['responses']['200']['application/json']>({
    id: -1,
    login: '',
    passwordHash: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    email: '',
    departmentId: null,
    dateOfBirth: '',
    role: '',
    verified: false,
    createdAt: '',
    updatedAt: ''
})
export const stateIsUserAuthed = computed(() => stateUser && stateUser.id > -1)

export async function actionLoadUser() {
    const { data } = await axios.get('/user')
    Object.assign(stateUser, data) // mutation commit? не слышали :)
}
