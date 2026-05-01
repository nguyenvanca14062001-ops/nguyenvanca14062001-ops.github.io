<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, db } from '@/firebase'
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, onSnapshot, collection, query, where } from "firebase/firestore"

// IMPORT CÁC COMPONENT GỐC
import Sidebar from '@/components/home/Sidebar.vue'
import JobSection from '@/components/home/JobSection.vue'
import HistorySection from '@/components/home/HistorySection.vue'
import InfoSection from '@/components/home/InfoSection.vue'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const isMenuOpen = ref(true) 
const isDataLoading = ref(true)
const showBankModal = ref(false)

const username = ref(localStorage.getItem('mmo_username') || 'Member')
const userBalance = ref(Number(localStorage.getItem('mmo_balance')) || 0)

// Dữ liệu từ Firebase cho dự án MMO PRO của mày
const myReports = ref<any[]>([])
const myWithdrawals = ref<any[]>([])

const combinedHistory = computed(() => {
  const combined = [
    ...myReports.value.map(item => ({ ...item, type: 'task' })),
    ...myWithdrawals.value.map(item => ({ ...item, type: 'withdraw' }))
  ]
  return combined.map(item => {
    let displayTime = 'VỪA XONG'; let sortTime = Date.now()
    if (item.createdAt) {
      if (typeof item.createdAt === 'string') {
        displayTime = item.createdAt.split('T')[0]; sortTime = new Date(item.createdAt).getTime()
      } else if (item.createdAt.toDate) {
        const d = item.createdAt.toDate(); displayTime = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`; sortTime = d.getTime()
      }
    }
    return { ...item, displayTime, sortTime }
  }).sort((a, b) => b.sortTime - a.sortTime)
})

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      onSnapshot(doc(db, "users", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          username.value = data.username || data.fullName || 'Member'
          userBalance.value = data.balance || 0
          localStorage.setItem('mmo_username', username.value); 
          localStorage.setItem('mmo_balance', String(userBalance.value))
        }
      })
      onSnapshot(query(collection(db, "reports"), where("uid", "==", user.uid)), (snapshot) => {
        myReports.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
        isDataLoading.value = false
      })
      onSnapshot(query(collection(db, "withdrawals"), where("uid", "==", user.uid)), (snapshot) => {
        myWithdrawals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    } else {
      isLoggedIn.value = false; isDataLoading.value = false; username.value = 'Member'; 
      userBalance.value = 0; myReports.value = []; myWithdrawals.value = []; localStorage.clear();
    }
  })
})

// HÀM ĐIỀU HƯỚNG VÀ CUỘN LỊCH SỬ (QUAN TRỌNG)
const handleScrollToHistory = () => {
  if (route.path !== '/') {
    // Nếu đang ở trang khác (như /submit-report), phải về trang chủ trước
    router.push('/')
    // Đợi 500ms để trang chủ load xong các component rồi mới tìm ID để cuộn
    setTimeout(() => {
      const el = document.getElementById('history-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 500)
  } else {
    // Nếu đang ở sẵn trang chủ, cuộn luôn
    const el = document.getElementById('history-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  // Đóng menu nếu là Mobile
  if (window.innerWidth < 1024) isMenuOpen.value = false
}

const handleNav = (path: string) => {
  const target = path === '/submit' ? '/submit-report' : path
  router.push(target)
  if (window.innerWidth < 1024) isMenuOpen.value = false
}

const logout = async () => { if(confirm('Xác nhận đăng xuất?')) { await signOut(auth); localStorage.clear(); router.push('/login'); } }
</script>

<template>
  <div class="min-h-screen bg-[#090e17] text-slate-300 font-sans flex overflow-hidden text-left uppercase font-black">
    
    <!-- NÚT 3 GẠCH -->
    <button 
      @click="isMenuOpen = !isMenuOpen" 
      class="fixed top-5 left-5 z-[110] p-3 bg-[#111726] border border-slate-800 rounded-2xl shadow-2xl active:scale-95 transition-all"
    >
      <svg v-if="!isMenuOpen" class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      <svg v-else class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
    </button>

    <!-- SIDEBAR -->
    <div :class="['fixed inset-y-0 left-0 z-[100] transition-all duration-500 ease-in-out bg-[#111726] border-r border-slate-800', isMenuOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full']">
      <Sidebar 
        v-if="isMenuOpen"
        :isLoggedIn="isLoggedIn" :isMenuOpen="isMenuOpen" :username="username" :userBalance="userBalance"
        @toggleMenu="isMenuOpen = !isMenuOpen" 
        @logout="logout" 
        @routerPush="handleNav"
        @requireAuth="handleNav"
        @scrollToHistory="handleScrollToHistory" 
        @contactSupport="() => window.open('https://facebook.com/trungtammmo.pro')"
      />
    </div>

    <!-- MAIN CONTENT -->
    <div :class="['flex-1 flex flex-col transition-all duration-500 min-w-0 bg-[#090e17]', isMenuOpen ? 'lg:ml-72' : 'ml-0']">
      <header class="h-20 flex items-center justify-end px-6 md:px-10 sticky top-0 bg-[#090e17]/95 backdrop-blur-md z-[50] border-b border-slate-800/30">
        <div class="flex items-center gap-3 bg-[#111726] border border-slate-800 pl-4 pr-1.5 py-1.5 rounded-full">
          <span class="text-white text-[11px] font-black italic">{{ isLoggedIn ? userBalance.toLocaleString() : '0' }} <span class="text-blue-500 text-[9px]">Đ</span></span>
          <button @click="handleNav('/withdraw')" class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">+</button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 custom-scrollbar relative">
        <template v-if="route.path === '/'">
           <JobSection 
             :username="username" :isLoggedIn="isLoggedIn" :userBalance="userBalance" 
             @receiveJob="(name) => handleNav(`/job/${name.toLowerCase().replace(/\s+/g, '-')}`)" 
             @routerPush="handleNav"
           />
           <!-- MÀY NHÌN ĐÂY: TAO ĐÃ THÊM ID="HISTORY-SECTION" VÀO ĐÂY -->
           <HistorySection 
             id="history-section" 
             :isLoggedIn="isLoggedIn" 
             :isDataLoading="isDataLoading" 
             :myReports="combinedHistory" 
           />
           <InfoSection @contactSupport="() => {}" />
        </template>
        <router-view v-else />
      </main>
    </div>

    <div v-if="isMenuOpen" @click="isMenuOpen = false" class="fixed inset-0 bg-black/80 z-[80] lg:hidden backdrop-blur-sm transition-opacity"></div>
  </div>
</template>