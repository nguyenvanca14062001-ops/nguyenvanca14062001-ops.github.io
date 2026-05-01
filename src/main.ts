import { createApp } from 'vue'
// @ts-ignore
import App from './App.vue'
import './style.css'
import router from './router' // Thêm dòng này

const app = createApp(App)
app.use(router) // Thêm dòng này
app.mount('#app')