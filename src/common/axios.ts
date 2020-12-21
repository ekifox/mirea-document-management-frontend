import Axios from 'axios'
import { useToast } from 'vue-toastification'

const client = Axios.create({
    baseURL: 'http://localhost:3000'
})

const toast = useToast()

client.interceptors.request.use(
    request => {
        request.withCredentials = true
        return request
    },
    error => {
        return Promise.reject(error)
    }
)

export default client

export function axiosStandartErrorHandler(error: any) {
    if (!error.response) {
        return toast.error('Something went wrong...')
    }

    if (!error.response.data) {
        console.error(error.response.data)
        return toast.error('Something went wrong...')
    }

    if (Array.isArray(error.response.data.message)) {
        for (const message of error.response.data.message) {
            toast.error(message)
        }
        return true
    }

    toast.error(error.response.data.message)
}
