import { computed, reactive } from 'vue'
import axios from './axios'
import { paths } from './openapi'

export const stateUser = reactive({}) as paths['/user']['get']['responses']['200']['application/json']
export const stateIsUserAuthed = computed(() => stateUser && stateUser.id)

export async function actionLoadUser() {
    try {
        const { data } = await axios.get('/user')
        Object.assign(stateUser, data) // mutation commit? не слышали :)
    } catch (e) {}
}
