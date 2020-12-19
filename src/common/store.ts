import { computed, reactive } from 'vue'
import axios from './axios'

export const stateUser = reactive({ id: -1 })
export const stateIsUserAuthed = computed(() => stateUser && stateUser.id > -1)

export async function actionLoadUser() {
    const { data } = await axios.get('/user')
    Object.assign(stateUser, data) // mutation commit? не слышали :)
}
