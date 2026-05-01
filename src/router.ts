import { createRouter, createWebHistory } from 'vue-router'

// @ts-ignore
import HomeView from './views/HomeView.vue'
// @ts-ignore
import LoginView from './views/LoginView.vue'
// @ts-ignore
import RegisterView from './views/RegisterView.vue'
// @ts-ignore
import SubmitReportView from './views/SubmitReportView.vue'
// @ts-ignore
import WithdrawView from './views/WithdrawView.vue'
// @ts-ignore
import JobDetailView from './views/JobDetailView.vue'
// @ts-ignore
import AdminView from './views/AdminView.vue'

const routes = [
  { 
    path: '/', 
    name: 'home',
    component: HomeView 
  },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/submit-report', name: 'submit-report', component: SubmitReportView },
  { path: '/withdraw', name: 'withdraw', component: WithdrawView },
  { path: '/job/:id', name: 'job-detail', component: JobDetailView },
  { path: '/admin', name: 'admin', component: AdminView }
]

const router = createRouter({
  // Mấu chốt nằm ở đây, nó sẽ lấy giá trị 'base' từ file vite.config.ts của mày
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router