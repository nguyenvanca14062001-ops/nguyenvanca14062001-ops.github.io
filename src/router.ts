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
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/submit-report', component: SubmitReportView },
  { path: '/withdraw', component: WithdrawView },
  { path: '/job/:id', component: JobDetailView },
  { path: '/admin', component: AdminView } // KIỂM TRA DÒNG NÀY: Phải là AdminView
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router