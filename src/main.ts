import '@forevolve/bootstrap-dark/dist/css/bootstrap-dark.css'
import 'vue-toastification/dist/index.css'

import { BootstrapIconsPlugin } from 'bootstrap-icons-vue'
import { createApp } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.use(BootstrapIconsPlugin)
app.use(Toast, { position: POSITION.TOP_RIGHT, timeout: 6000 })

app.mount('#app')
