import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import Store from '@/store'
import config from '../config.js'

import axios from 'axios'
import VueAxios from 'vue-axios'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { pt } from 'vuetify/locale'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    },
    locale: {
        locale: 'pt',
        messages: {pt}
    }
})

const apiUrl = import.meta.env.MODE === 'production' ? config.production : config.development;

const axiosInstance = axios.create({baseURL: `${apiUrl}/api`, withCredentials: true});
axiosInstance.defaults.withCredentials = true;

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(VueAxios, axiosInstance)

//global properties
app.config.globalProperties.$store = Store()
app.config.globalProperties.$baseUrl = apiUrl

app.mount('#app')
