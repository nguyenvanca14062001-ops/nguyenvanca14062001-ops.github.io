<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { auth, db } from '@/firebase'
import { doc, onSnapshot, collection, query, where } from "firebase/firestore"
import { useRouter } from 'vue-router'

const router = useRouter()
const userUid = ref('')
const userData = ref<any>(null)
const reports = ref<any[]>([])
const isPageLoading = ref(true) // Thêm trạng thái loading cho chuyên nghiệp

// Thống kê
const stats = computed(() => {
  const total = reports.value.length
  const approved = reports.value.filter(r => r.status === 'approved').length
  const pending = reports.value.filter(r => r.status === 'pending').length
  const rejected = reports.value.filter(r => r.status === 'rejected').length
  const totalEarned = reports.value
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + (Number(r.reward) || 0), 0)

  return { total, approved, pending, rejected, totalEarned }
})

onMounted(() => {
  // Lắng nghe trạng thái đăng nhập để đảm bảo auth.currentUser không bị null
  auth.onAuthStateChanged((user) => {
    if (user) {
      userUid.value = user.uid
      
      // Lấy thông tin user
      onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists()) userData.value = snap.data()
      })
      
      // Lấy lịch sử để thống kê
      const q = query(collection(db, "reports"), where("uid", "==", user.uid))
      onSnapshot(q, (snap) => {
        reports.value = snap.docs.map(d => d.data())
        isPageLoading.value = false
      })
    } else {
      router.push('/login')
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-[#090e17] py-10 px-4 flex flex-col items-center font-black italic uppercase text-left">
    <div v-if="isPageLoading" class="text-blue-500 animate-pulse mt-20">ĐANG TẢI DỮ LIỆU...</div>
    
    <div v-else class="w-full max-w-2xl">
      <!-- Nút Quay lại -->
      <button @click="router.back()" class="text-slate-500 hover:text-white flex items-center gap-2 text-xs mb-8 transition-colors">
        <span class="font-sans not-italic">✕</span> TRỞ LẠI
      </button>

      <h1 class="text-4xl text-white mb-10 tracking-tighter">HỒ SƠ <span class="text-blue-500">CÁ NHÂN</span></h1>

      <!-- Card chính -->
      <div class="bg-[#111726] rounded-[40px] p-8 border border-slate-800/50 shadow-2xl space-y-10">
        
        <!-- Info cơ bản -->
        <div class="flex items-center gap-6 pb-10 border-b border-slate-800/50">
          <div class="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl shadow-lg">👤</div>
          <div>
            <h2 class="text-2xl text-white leading-none mb-2">{{ userData?.username || 'MEMBER' }}</h2>
            <p class="text-blue-500 text-[10px] tracking-[2px]">CẤP BẬC: <span class="text-white">THÀNH VIÊN VIP</span></p>
          </div>
        </div>

        <!-- Grid thống kê -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-[#0d121f] p-6 rounded-3xl border border-slate-800/30 shadow-inner">
            <p class="text-slate-500 text-[10px] mb-1">TỔNG THU NHẬP</p>
            <p class="text-emerald-400 text-2xl tracking-tighter">{{ stats.totalEarned.toLocaleString() }}Đ</p>
          </div>
          <div class="bg-[#0d121f] p-6 rounded-3xl border border-slate-800/30 shadow-inner">
            <p class="text-slate-500 text-[10px] mb-1">ĐƠN ĐÃ NỘP</p>
            <p class="text-white text-2xl tracking-tighter">{{ stats.total }}</p>
          </div>
        </div>

        <!-- Chi tiết trạng thái -->
        <div class="space-y-4">
          <div class="flex justify-between items-center bg-[#0d121f] p-5 rounded-2xl border-l-4 border-emerald-500 transition-transform hover:scale-[1.02]">
            <span class="text-slate-400 text-sm">ĐÃ ĐƯỢC DUYỆT</span>
            <span class="text-emerald-500 text-xl font-black italic">{{ stats.approved }}</span>
          </div>
          <div class="flex justify-between items-center bg-[#0d121f] p-5 rounded-2xl border-l-4 border-yellow-500 transition-transform hover:scale-[1.02]">
            <span class="text-slate-400 text-sm">ĐANG CHỜ XỬ LÝ</span>
            <span class="text-yellow-500 text-xl font-black italic">{{ stats.pending }}</span>
          </div>
          <div class="flex justify-between items-center bg-[#0d121f] p-5 rounded-2xl border-l-4 border-red-500 transition-transform hover:scale-[1.02]">
            <span class="text-slate-400 text-sm">ĐƠN BỊ TỪ CHỐI</span>
            <span class="text-red-500 text-xl font-black italic">{{ stats.rejected }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>