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
  { path: '/admin', component: AdminView }
]

const router = createRouter({
  // CHỖ NÀY LÀ MẤU CHỐT: Phải có BASE_URL để nó hiểu đường dẫn GitHub của mày
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router