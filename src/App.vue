<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, db } from '@/firebase' 
import { onAuthStateChanged, signOut } from "firebase/auth" 
import { doc, onSnapshot, collection, query, where, updateDoc } from "firebase/firestore"

// --- IMPORT CÁC COMPONENT GỐC ---
import Sidebar from '@/components/home/Sidebar.vue'
import JobSection from '@/components/home/JobSection.vue'
import HistorySection from '@/components/home/HistorySection.vue'
import InfoSection from '@/components/home/InfoSection.vue'

// --- KHỞI TẠO BIẾN TRẠNG THÁI HỆ THỐNG ---
const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(false)
const isMenuOpen = ref(true) 
const isDataLoading = ref(true)
const windowWidth = ref(0) 
const showWelcomePopup = ref(false)

// [QUAN TRỌNG] KIỂM TRA XEM CÓ PHẢI TRANG ADMIN KHÔNG
const isAdminRoute = computed(() => route.path.includes('admin'))

// --- THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG ---
const username = ref(localStorage.getItem('mmo_username') || 'Member')
const userBalance = ref(Number(localStorage.getItem('mmo_balance')) || 0)

const myReports = ref<any[]>([])
const myWithdrawals = ref<any[]>([])

// --- LOGIC THÔNG BÁO "NỔ HŨ" SIÊU TỐC ---
const randomNotice = ref<any>(null)
const names = ['TRUNG NGUYỄN', 'HOÀNG ANH', 'MINH TUẤN', 'THANH HẰNG', 'VĂN NAM', 'BÍCH PHƯỢNG', 'QUỐC BẢO', 'KHÁNH LINH', 'TRẦN TÂM', 'SƠN TÙNG', 'ANH VŨ', 'QUANG LÊ', 'MINH ĐỨC', 'HỮU PHÚC', 'TIẾN ĐẠT']
const banks = ['MB BANK', 'VPBANK', 'TPBANK', 'VIETCOMBANK', 'TECHCOMBANK', 'MOMO']
const jobList = [
  { name: 'Đánh giá Google Map', reward: '15.000' },
  { name: 'App Chứng Khoán', reward: '200.000' },
  { name: 'Ngân hàng VPBank', reward: '100.000' },
  { name: 'Ngân hàng TPBank', reward: '70.000' }
]

const triggerNotice = (type: 'job' | 'withdraw') => {
  const name = names[Math.floor(Math.random() * names.length)]
  if (type === 'withdraw') {
    const bank = banks[Math.floor(Math.random() * banks.length)]
    const withdrawAmounts = ['50.000', '100.000', '200.000', '500.000']
    randomNotice.value = { type: 'withdraw', name, title: 'Vừa rút thành công', amount: withdrawAmounts[Math.floor(Math.random() * withdrawAmounts.length)], sub: `Về Ngân hàng ${bank}` }
  } else {
    const job = jobList[Math.floor(Math.random() * jobList.length)]
    randomNotice.value = { type: 'job', name, title: 'Vừa hoàn thành', amount: job.reward, sub: `Công việc: ${job.name}` }
  }
  setTimeout(() => { randomNotice.value = null }, 1800)
}

const startToasting = () => {
  const jobLoop = () => {
    const nextJob = Math.random() * (3500 - 1500) + 1500 // 1.5s - 3.5s
    setTimeout(() => { if (!randomNotice.value) triggerNotice('job'); jobLoop() }, nextJob)
  }
  const withdrawLoop = () => {
    const nextWithdraw = Math.random() * (12000 - 6000) + 6000 // 6s - 12s
    setTimeout(() => { triggerNotice('withdraw'); withdrawLoop() }, nextWithdraw)
  }
  jobLoop(); withdrawLoop()
}

// --- LOGIC XỬ LÝ LỊCH SỬ TỔNG HỢP ---
const combinedHistory = computed(() => {
  const combined = [...myReports.value.map(item => ({ ...item, type: 'task' })), ...myWithdrawals.value.map(item => ({ ...item, type: 'withdraw' }))]
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
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', () => { windowWidth.value = window.innerWidth })
  startToasting()
  onAuthStateChanged(auth, async (user) => {
    if (user && !isAdminRoute.value) {
      isLoggedIn.value = true
      const giftKey = `gift_${user.uid}`
      const hasReceivedGift = localStorage.getItem(giftKey)
      onSnapshot(doc(db, "users", user.uid), async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          username.value = data.username || data.fullName || 'Member'
          userBalance.value = data.balance || 0
          if (data.balance === 0 && !hasReceivedGift) {
             try {
               await updateDoc(doc(db, "users", user.uid), { balance: 10000 })
               showWelcomePopup.value = true
               localStorage.setItem(giftKey, 'true')
             } catch (e) { console.error("Lỗi cộng tiền:", e) }
          }
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
    } else if (!isAdminRoute.value) {
      isLoggedIn.value = false; isDataLoading.value = false; username.value = 'Member'; userBalance.value = 0; myReports.value = []; myWithdrawals.value = []; localStorage.clear()
    }
  })
})

const handleNav = (path: string) => {
  const protectedRoutes = ['/submit', '/submit-report', '/withdraw', '/history']
  if (!isLoggedIn.value && (protectedRoutes.includes(path) || path.startsWith('/job/'))) {
    alert('⚠️ ĐĂNG NHẬP ĐỂ TIẾP TỤC!'); router.push('/login'); return
  }
  router.push(path === '/submit' ? '/submit-report' : path)
  if (windowWidth.value < 1024) isMenuOpen.value = false
}

const handleScrollToHistory = () => {
  if (route.path !== '/') {
    router.push('/')
    setTimeout(() => { document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' }) }, 500)
  } else {
    document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' })
  }
  if (windowWidth.value < 1024) isMenuOpen.value = false
}

const logout = async () => { if(confirm('Xác nhận đăng xuất?')) { await signOut(auth); localStorage.clear(); router.push('/login') } }
const contactSupport = (t: string) => { window.open(t === 'facebook' ? 'https://fb.com/mmo' : 'https://zalo.me/g/xxx', '_blank') }
</script>

<template>
  <div v-if="isAdminRoute" class="min-h-screen bg-[#090e17] text-slate-300 font-sans w-full">
    <router-view />
  </div>

  <div v-else class="min-h-screen bg-[#090e17] text-slate-300 font-sans flex overflow-hidden text-left uppercase font-black italic relative">
    
    <!-- POPUP TẶNG QUÀ -->
    <Transition name="fade">
      <div v-if="showWelcomePopup" class="fixed inset-0 z-[4000] flex items-center justify-center px-6">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="showWelcomePopup = false"></div>
        <div class="relative bg-[#111726] border border-blue-500/30 w-full max-w-md p-8 rounded-[40px] shadow-[0_0_50px_rgba(37,99,235,0.2)] text-center">
          <div class="relative z-10 space-y-6">
            <div class="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-3xl mx-auto flex items-center justify-center text-4xl animate-bounce">🎁</div>
            <h2 class="text-3xl text-white font-black italic uppercase tracking-tighter leading-none">Chào mừng <br/><span class="text-blue-500">Tân Thủ!</span></h2>
            <p class="text-slate-400 text-sm font-bold italic leading-relaxed uppercase">Hệ thống đã cộng 10,000Đ vào ví.</p>
            <button @click="showWelcomePopup = false" class="w-full py-5 bg-blue-600 text-white rounded-2xl font-black italic uppercase shadow-lg active:scale-95">Bắt đầu ngay</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- [NỔ HŨ SIÊU TỐC] -->
    <Transition name="slide-up">
      <div v-if="randomNotice" 
           :style="{ left: windowWidth > 1024 && isMenuOpen ? '320px' : '20px' }"
           class="fixed bottom-10 z-[5000] flex items-center gap-4 bg-[#111726]/95 backdrop-blur-xl border border-blue-500/40 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[280px] transition-all duration-300">
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg', randomNotice.type === 'withdraw' ? 'bg-gradient-to-tr from-emerald-500 to-teal-500' : 'bg-gradient-to-tr from-orange-500 to-red-500']">
          {{ randomNotice.type === 'withdraw' ? '💰' : '🔥' }}
        </div>
        <div class="flex flex-col text-left leading-tight">
          <span class="text-white text-[11px] font-black italic tracking-tighter uppercase">{{ randomNotice.name }}</span>
          <span :class="['text-[13px] font-black italic', randomNotice.type === 'withdraw' ? 'text-emerald-400' : 'text-orange-400']">{{ randomNotice.title }} {{ randomNotice.amount }}Đ</span>
          <span class="text-slate-500 text-[8px] font-bold uppercase mt-0.5 tracking-widest italic opacity-80">{{ randomNotice.sub }}</span>
        </div>
      </div>
    </Transition>

    <!-- FLOATING CONTACTS (VỚI HIỆU ỨNG CHỮ NHẢY TRẢ LẠI CHUẨN) -->
    <div class="fixed bottom-8 right-8 z-[999] flex flex-col gap-6 items-end">
      <!-- Fanpage -->
      <div class="flex items-center group cursor-pointer" @click="contactSupport('facebook')">
        <div class="mr-4 text-right overflow-hidden italic uppercase">
          <p class="text-[9px] text-indigo-400 font-black tracking-[2px] mb-1 opacity-80 animate-jump-delay">GIẢI ĐÁP THẮC MẮC</p>
          <p class="text-white text-sm font-black italic uppercase tracking-tighter">LIÊN HỆ FANPAGE</p>
        </div>
        <div class="w-16 h-16 bg-[#1877F2] rounded-full shadow-lg flex items-center justify-center text-white"><svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
      </div>
      <!-- Zalo -->
      <div class="flex items-center group cursor-pointer" @click="contactSupport('zalo')">
        <div class="mr-4 text-right overflow-hidden italic uppercase">
          <p class="text-[9px] text-blue-500 font-black tracking-[2px] mb-1 opacity-80 animate-jump-delay">CỘNG ĐỒNG MMO</p>
          <p class="text-white text-sm font-black italic uppercase tracking-tighter">THAM GIA NHÓM</p>
        </div>
        <div class="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" class="w-10 h-10 object-contain" /></div>
      </div>
    </div>

    <!-- MENU TOGGLE MOBILE -->
    <button @click.stop="isMenuOpen = !isMenuOpen" class="fixed top-5 left-5 z-[1100] p-3 bg-[#111726] border border-slate-800 rounded-2xl shadow-2xl transition-all"><svg v-if="!isMenuOpen" class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg><svg v-else class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg></button>

    <!-- SIDEBAR -->
    <div :class="['fixed lg:sticky top-0 left-0 h-screen z-[1000] transition-all duration-500 bg-[#111726] border-r border-slate-800', isMenuOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-0 lg:overflow-hidden']">
      <Sidebar v-if="isMenuOpen" :isLoggedIn="isLoggedIn" :isMenuOpen="isMenuOpen" :username="username" :userBalance="userBalance" @toggleMenu="isMenuOpen = !isMenuOpen" @logout="logout" @routerPush="handleNav" @requireAuth="handleNav" @scrollToHistory="handleScrollToHistory" @contactSupport="contactSupport" />
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col transition-all duration-500 min-w-0 bg-[#090e17] w-full">
      <header class="h-20 flex items-center justify-end px-6 md:px-10 sticky top-0 bg-[#090e17]/95 backdrop-blur-md z-[50] border-b border-slate-800/30">
        <div class="flex items-center gap-4 bg-[#111726] border border-slate-800 pl-5 pr-1.5 py-1.5 rounded-full shadow-inner">
          <div class="flex items-center gap-2">
            <span class="text-slate-500 text-[9px] font-black tracking-[1px] uppercase italic opacity-80">Số dư ví :</span>
            <span class="text-white text-[15px] md:text-xl font-black italic tracking-tighter leading-none">{{ isLoggedIn ? userBalance.toLocaleString() : '0' }} <span class="text-blue-500 text-[10px] ml-0.5">đ</span></span>
          </div>
          <button @click="handleNav('/withdraw')" class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg shadow-lg active:scale-90">+</button>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 custom-scrollbar relative text-left">
        <template v-if="route.path === '/'">
           <JobSection :username="username" :isLoggedIn="isLoggedIn" :userBalance="userBalance" @receiveJob="(id) => handleNav(`/job/${id}`)" @routerPush="handleNav" />
           <HistorySection id="history-section" :isLoggedIn="isLoggedIn" :isDataLoading="isDataLoading" :myReports="combinedHistory" />
           <InfoSection @contactSupport="contactSupport" />
           
           <!-- FOOTER -->
           <footer class="mt-20 border-t border-slate-800/50 bg-[#0d121f] pt-16 pb-8 relative z-[100] italic uppercase font-black rounded-3xl overflow-hidden">
             <div class="max-w-7xl mx-auto px-6 text-left">
               <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                 <div class="space-y-4">
                   <div class="flex items-center gap-3">
                     <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">M</div>
                     <h2 class="text-2xl text-white tracking-tighter leading-none uppercase">MMO PRO <br/><span class="text-blue-500 font-black">SYSTEM</span></h2>
                   </div>
                   <p class="text-slate-500 text-[11px] normal-case font-bold max-w-xs italic leading-relaxed">Hệ thống MMO uy tín số 1 Việt Nam. Thanh toán minh bạch, bảo mật tuyệt đối.</p>
                   <div class="flex gap-3 pt-2 opacity-60 filter grayscale hover:grayscale-0 transition-all">
                     <img src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=12345" class="h-6" alt="DMCA">
                     <div class="bg-emerald-500/10 text-emerald-500 text-[8px] px-2 py-1 rounded border border-emerald-500/20 font-sans font-black italic uppercase">SSL Secured</div>
                   </div>
                 </div>
                 
                 <div class="space-y-6">
                   <h3 class="text-white text-sm tracking-[2px] border-l-4 border-blue-600 pl-4 uppercase font-black italic">Đối tác thanh toán</h3>
                   <div class="grid grid-cols-4 gap-4 opacity-40 grayscale hover:opacity-100 transition-all duration-500">
                     <div v-for="bank in ['VCB', 'MB', 'TCB', 'VPB', 'TPB', 'ACB', 'VIB', 'MOMO']" :key="bank" class="h-8 bg-slate-800/50 rounded-lg flex items-center justify-center text-[10px] text-white border border-slate-700/50 font-sans font-bold uppercase">{{ bank }}</div>
                   </div>
                 </div>
                 
                 <div class="space-y-6">
                   <h3 class="text-white text-sm tracking-[2px] border-l-4 border-blue-600 pl-4 uppercase font-black italic">Hỗ trợ cộng đồng</h3>
                   <div class="flex flex-col gap-3 font-black italic uppercase">
                     <button @click="contactSupport('facebook')" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[11px] shadow-lg font-black italic uppercase">Kết nối Fanpage</button>
                     <button @click="contactSupport('zalo')" class="w-full py-3 bg-[#1a2333] border border-white/5 text-white rounded-xl text-[11px] font-black italic uppercase">Tham gia nhóm Zalo</button>
                   </div>
                 </div>
               </div>
               
               <div class="pt-8 border-t border-slate-800/30 text-[9px] font-black text-slate-600 tracking-[1px] uppercase italic text-center md:text-left font-black">
                 <p>COPYRIGHT © 2026 MMO PRO SYSTEM. ALL RIGHTS RESERVED.</p>
               </div>
             </div>
           </footer>
        </template>
        <router-view v-else />
        <div class="h-10"></div>
      </main>
    </div>
    <div v-if="isMenuOpen && windowWidth < 1024" @click="isMenuOpen = false" class="fixed inset-0 bg-black/80 z-[800] lg:hidden backdrop-blur-sm transition-opacity"></div>
  </div>
</template>

<style>
/* THANH CUỘN */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }

/* HIỆU ỨNG TRƯỢT NỔ HŨ */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.slide-up-enter-from { opacity: 0; transform: translateY(80px) scale(0.6); }
.slide-up-leave-to { opacity: 0; transform: translateX(-80px) scale(0.9); }

/* HIỆU ỨNG MỜ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* HIỆU ỨNG CHỮ NHẢY (TRẢ LẠI CHO MÀY ĐÂY) */
@keyframes jump-cycle { 
  0%, 40%, 100% { transform: translateY(0); opacity: 1; } 
  5%, 15%, 25% { transform: translateY(-10px); } 
  10%, 20%, 30% { transform: translateY(0); } 
  45% { opacity: 0; transform: scale(0.5); } 
  55% { opacity: 1; transform: scale(1.1); } 
}
.animate-jump-cycle { animation: jump-cycle 4s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.animate-jump-delay { animation: jump-cycle 4s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); animation-delay: 0.1s; }
</style>