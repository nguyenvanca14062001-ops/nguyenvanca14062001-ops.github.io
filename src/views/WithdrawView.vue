<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore"

const router = useRouter()
const isLoggedIn = ref(false)
const isLoading = ref(false)
const userBalance = ref(0)
const userUid = ref('')

const amount = ref('')
const bankInfo = ref('')

// Fake data Lịch sử rút tiền giống hệt trong ảnh để buff uy tín
const ctvHistory = [
  { name: 'VŨ ***65', time: 'VỪA XONG', amount: '+500.000đ', status: 'THÀNH CÔNG' },
  { name: 'VŨ ***15', time: 'VỪA XONG', amount: '+200.000đ', status: 'THÀNH CÔNG' },
  { name: 'TRẦN ***99', time: '5 PHÚT TRƯỚC', amount: '+1.000.000đ', status: 'THÀNH CÔNG' },
  { name: 'LÊ ***22', time: '10 PHÚT TRƯỚC', amount: '+50.000đ', status: 'THÀNH CÔNG' }
]

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      userUid.value = user.uid
      
      // Lắng nghe số dư thực tế từ Firestore
      const userRef = doc(db, "users", user.uid)
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          userBalance.value = docSnap.data().balance || 0
        }
      })
    } else {
      alert('⚠️ BẠN CẦN ĐĂNG NHẬP ĐỂ RÚT TIỀN!')
      router.push('/login')
    }
  })
})

const submitWithdraw = async () => {
  const numAmount = Number(amount.value)
  
  if (!amount.value || !bankInfo.value) {
    alert('⚠️ VUI LÒNG ĐIỀN ĐẦY ĐỦ THÔNG TIN!')
    return
  }
  if (numAmount < 50000) {
    alert('⚠️ SỐ TIỀN RÚT TỐI THIỂU LÀ 50.000Đ!')
    return
  }
  if (numAmount > userBalance.value) {
    alert('⚠️ SỐ DƯ CỦA BẠN KHÔNG ĐỦ!')
    return
  }

  isLoading.value = true
  try {
    await addDoc(collection(db, "withdrawals"), {
      uid: userUid.value,
      amount: numAmount,
      bankInfo: bankInfo.value,
      status: 'pending',
      createdAt: serverTimestamp()
    })

    alert('✅ ĐÃ GỬI YÊU CẦU RÚT TIỀN THÀNH CÔNG! HỆ THỐNG SẼ XỬ LÝ SỚM NHẤT.')
    amount.value = ''
    bankInfo.value = ''
    router.push('/')
  } catch (error: any) {
    alert('❌ LỖI HỆ THỐNG: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#090e17] py-10 px-4 md:px-0 flex flex-col items-center font-sans font-black italic uppercase selection:bg-emerald-500/30">
    
    <div class="w-full max-w-2xl relative">
      <!-- Nút Quay lại -->
      <button @click="router.push('/')" class="text-slate-500 hover:text-white flex items-center gap-2 text-xs tracking-[3px] font-black italic uppercase transition-colors mb-8">
        <span class="text-lg leading-none font-sans font-light not-italic tracking-normal">✕</span> QUAY LẠI
      </button>

      <!-- CARD 1: FORM RÚT TIỀN -->
      <div class="bg-[#111726] rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-800/30">
        <div class="text-center mb-10">
          <h1 class="text-4xl text-white font-black italic uppercase tracking-tighter">RÚT TIỀN</h1>
          <p class="text-slate-400 text-xs mt-2 tracking-[2px]">
            SỐ DƯ KHẢ DỤNG: <span class="text-emerald-500 font-black">{{ userBalance.toLocaleString() }}Đ</span>
          </p>
        </div>

        <div class="space-y-6">
          <!-- Số tiền muốn rút -->
          <div class="space-y-2 text-left">
            <label class="text-[#3b82f6] text-[10px] tracking-[2px] font-black italic uppercase ml-1">SỐ TIỀN MUỐN RÚT</label>
            <input 
              v-model="amount" 
              type="number" 
              placeholder="Tối thiểu 50.000đ..." 
              class="w-full bg-[#0d121f] border border-slate-800 rounded-2xl p-5 text-white outline-none focus:border-blue-500 transition-all font-black italic placeholder:text-slate-600 placeholder:normal-case shadow-inner"
            />
          </div>

          <!-- Thông tin nhận tiền -->
          <div class="space-y-2 text-left">
            <label class="text-[#3b82f6] text-[10px] tracking-[2px] font-black italic uppercase ml-1">THÔNG TIN NHẬN TIỀN</label>
            <textarea 
              v-model="bankInfo" 
              placeholder="Tên ngân hàng - Số tài khoản - Chủ tài khoản..." 
              class="w-full bg-[#0d121f] border border-slate-800 rounded-2xl p-5 h-32 text-white outline-none focus:border-blue-500 transition-all font-black italic placeholder:text-slate-600 placeholder:normal-case shadow-inner resize-none"
            ></textarea>
          </div>

          <!-- Nút Xác Nhận -->
          <button 
            @click="submitWithdraw" 
            :disabled="isLoading" 
            class="w-full mt-4 bg-[#00df89] hover:bg-[#00c578] text-[#090e17] py-5 rounded-2xl text-xl font-black italic uppercase shadow-[0_10px_30px_rgba(0,223,137,0.2)] transition-all active:scale-95 disabled:opacity-50 tracking-tighter"
          >
            {{ isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN RÚT' }}
          </button>
        </div>
      </div>

      <!-- CARD 2: LỊCH SỬ RÚT TIỀN CỘNG TÁC VIÊN -->
      <div class="bg-[#111726] rounded-[40px] p-8 md:p-10 shadow-2xl border border-slate-800/30 mt-8">
        <div class="flex items-center gap-3 mb-8 text-left">
          <div class="w-1.5 h-6 bg-[#f59e0b] rounded-full"></div>
          <h3 class="text-white text-xl md:text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            LỊCH SỬ RÚT TIỀN CỘNG TÁC VIÊN <span class="text-emerald-500 text-3xl leading-none pb-2">•</span>
          </h3>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in ctvHistory" :key="index" class="bg-[#0d121f] p-5 rounded-[25px] border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-colors">
            
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 text-xl shadow-inner">
                👤
              </div>
              <div class="text-left leading-tight space-y-1">
                <p class="text-white font-black italic uppercase tracking-tight">{{ item.name }}</p>
                <p class="text-slate-500 text-[9px] tracking-[1px] font-black italic uppercase">{{ item.time }}</p>
              </div>
            </div>

            <div class="text-right leading-tight space-y-1">
              <p class="text-emerald-400 font-black italic tracking-tighter text-lg">{{ item.amount }}</p>
              <p class="text-emerald-500/70 text-[9px] tracking-[1px] font-black italic uppercase flex items-center justify-end gap-1">
                <span class="text-xs leading-none">•</span> {{ item.status }}
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Ẩn mũi tên lên xuống của input số để giao diện gọn như ảnh */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>