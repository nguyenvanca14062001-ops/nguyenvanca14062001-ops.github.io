<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, onSnapshot, collection, query, where } from "firebase/firestore"

import Sidebar from '@/components/home/Sidebar.vue'
import JobSection from '@/components/home/JobSection.vue'
import HistorySection from '@/components/home/HistorySection.vue'
import InfoSection from '@/components/home/InfoSection.vue'

const router = useRouter()
const isLoggedIn = ref(false)
const isMenuOpen = ref(false)
const showBankModal = ref(false)
const isDataLoading = ref(true)

const username = ref(localStorage.getItem('mmo_username') || 'Member')
const userBalance = ref(Number(localStorage.getItem('mmo_balance')) || 0)
const totalWithdrawn = ref(0) 

const myReports = ref<any[]>([])
const myWithdrawals = ref<any[]>([])

const combinedHistory = computed(() => {
  const combined = [
    ...myReports.value.map(item => ({ ...item, type: 'task' })),
    ...myWithdrawals.value.map(item => ({ ...item, type: 'withdraw' }))
  ]
  return combined.map(item => {
    let displayTime = 'VỪA XONG'
    let sortTime = Date.now()
    if (item.createdAt) {
      if (typeof item.createdAt === 'string') {
        displayTime = item.createdAt.split('T')[0]
        sortTime = new Date(item.createdAt).getTime()
      } else if (item.createdAt.toDate) {
        const d = item.createdAt.toDate()
        displayTime = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
        sortTime = d.getTime()
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
          totalWithdrawn.value = data.totalWithdrawn || 0 
          localStorage.setItem('mmo_username', username.value)
          localStorage.setItem('mmo_balance', String(userBalance.value))
        }
      })
      onSnapshot(query(collection(db, "reports"), where("uid", "==", user.uid)), (snapshot) => {
        myReports.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        isDataLoading.value = false
      })
      onSnapshot(query(collection(db, "withdrawals"), where("uid", "==", user.uid)), (snapshot) => {
        myWithdrawals.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      })
    } else {
      isLoggedIn.value = false; isDataLoading.value = false; username.value = 'Member'; userBalance.value = 0; 
      myReports.value = []; myWithdrawals.value = []; localStorage.clear();
    }
  })
})

const handleScrollToHistory = () => {
  isMenuOpen.value = false
  setTimeout(() => {
    const el = document.getElementById('history-section')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, 150)
}

const handleQuickJob = () => {
  const el = document.querySelector('main section:nth-child(2)'); 
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/**
 * HÀM SỬA LỖI CHÍNH: Nhận jobId trực tiếp để chuyển trang chính xác
 */
const handleReceiveJob = (jobId: string) => {
  if (!isLoggedIn.value) { router.push('/login'); return; }
  
  // Nếu là cụm Ngân hàng chung, hiện Modal để chọn
  if (jobId === 'APP NGÂN HÀNG' || jobId === 'app-ngan-hang') {
    showBankModal.value = true
  } else {
    // Chuyển hướng theo đúng ID (ví dụ: msb, vpbank, google-map)
    router.push(`/job/${jobId}`);
  }
}

const contactSupport = () => {
  window.open('https://facebook.com/trungtammmo.pro', '_blank')
}

const logout = async () => { 
  if(confirm('Bạn có chắc chắn muốn đăng xuất?')) { 
    await signOut(auth); localStorage.clear(); router.push('/login'); 
  } 
}
</script>

<template>
  <div class="min-h-screen bg-[#090e17] text-slate-300 font-sans flex flex-col overflow-x-hidden text-left uppercase italic font-black">
    
    <!-- MOBILE HEADER -->
    <header class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111726]/95 backdrop-blur-xl border-b border-slate-800/50 z-[100] flex items-center justify-between px-6">
      <button @click="isMenuOpen = !isMenuOpen" class="text-white text-2xl p-2 -ml-2 font-sans italic">☰</button>
      <div class="text-white font-black tracking-tighter uppercase text-sm">MMO <span class="text-blue-500">PRO</span></div>
      
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-[#1a233a] border border-slate-700/50 pl-3 pr-1 py-1 rounded-full shadow-inner">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
          </svg>
          <span class="text-white text-[11px] font-black tracking-tight leading-none font-sans">
            {{ isLoggedIn ? userBalance.toLocaleString() : '0' }} <span class="text-blue-500 text-[9px] font-bold">Đ</span>
          </span>
          <button @click="!isLoggedIn ? router.push('/login') : handleQuickJob()" class="w-6 h-6 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1">
      <Sidebar 
        :isLoggedIn="isLoggedIn" :isMenuOpen="isMenuOpen" :username="username" :userBalance="userBalance"
        @toggleMenu="isMenuOpen = !isMenuOpen" @logout="logout" @routerPush="(p) => router.push(p)"
        @requireAuth="(p) => router.push(p)" @scrollToHistory="handleScrollToHistory" @contactSupport="contactSupport"
      />

      <main class="flex-1 min-w-0 px-4 md:px-10 pb-10 pt-20 lg:pt-10 space-y-10">
        <JobSection 
          :username="username" :isLoggedIn="isLoggedIn" :userBalance="userBalance" :totalWithdrawn="totalWithdrawn"
          @receiveJob="handleReceiveJob" @contactSupport="contactSupport" @routerPush="(p) => router.push(p)"
        />
        <HistorySection :isLoggedIn="isLoggedIn" :isDataLoading="isDataLoading" :myReports="combinedHistory" />
        <InfoSection @contactSupport="contactSupport" />
      </main>
    </div>

    <!-- BANK MODAL: Sửa đường dẫn để khớp với kho dữ liệu -->
    <div v-if="showBankModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div @click="showBankModal = false" class="absolute inset-0 bg-black/85 backdrop-blur-md"></div>
      <div class="relative w-full max-w-md bg-[#111726] border border-slate-800 rounded-[35px] p-10 shadow-2xl animate-in zoom-in duration-300">
        <h3 class="text-xl text-white border-l-4 border-blue-600 pl-4 mb-8 font-black uppercase italic">Chọn Ngân Hàng</h3>
        <div class="space-y-4 font-bold uppercase italic font-black">
          <!-- SỬA TẠI ĐÂY: Xóa chữ "bank-" để khớp ID 'msb', 'vpbank', 'tpbank' -->
          <div v-for="bank in [{ id: 'msb', name: 'MSB' }, { id: 'vpbank', name: 'VPBank' }, { id: 'tpbank', name: 'TPBank' }]" 
            :key="bank.id" @click="() => { showBankModal = false; router.push(`/job/${bank.id}`) }"
            class="flex items-center justify-between p-6 bg-[#0d121f] border border-slate-800 rounded-2xl cursor-pointer hover:border-blue-500 transition-all group"
          >
            <span class="text-white">{{ bank.name }}</span>
            <span class="text-blue-500 font-black font-sans italic">➜</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>