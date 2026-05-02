<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase' 
import { onAuthStateChanged, signOut } from "firebase/auth" 
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, increment } from "firebase/firestore"

const reports = ref<any[]>([])
const usersMap = ref<Record<string, any>>({}) // BẢN ĐỒ CHỨA INFO TÀI KHOẢN GỐC
const isLoading = ref(true)
const router = useRouter()

// --- LOGIC ZOOM ẢNH BẰNG CHỨNG ---
const selectedImage = ref<string | null>(null)
const openImage = (img: string) => { selectedImage.value = img }
const closeImage = () => { selectedImage.value = null }

// 1. LẤY DỮ LIỆU ĐƠN NỘP VÀ TÀI KHOẢN TỪ FIREBASE 
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // BƯỚC 1: LẤY TOÀN BỘ DATA TÀI KHOẢN ĐỂ ĐỐI CHIẾU
      onSnapshot(collection(db, "users"), (snapshot) => {
        const map: Record<string, any> = {}
        snapshot.docs.forEach(doc => {
          map[doc.id] = doc.data()
        })
        usersMap.value = map
      })

      // BƯỚC 2: LẤY BẰNG CHỨNG NỘP
      const q = query(collection(db, "reports"), orderBy("createdAt", "desc"))
      onSnapshot(q, (snapshot) => {
        reports.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        isLoading.value = false
      }, (error) => {
        console.error("LỖI LẤY DỮ LIỆU:", error)
      })
    } else {
      router.push('/login') 
    }
  })
})

// 2. HÀM DUYỆT ĐƠN
const approveReport = async (report: any) => {
  if (!confirm(`XÁC NHẬN DUYỆT ĐƠN VÀ CỘNG ${report.reward.toLocaleString()}Đ VÀO TÀI KHOẢN GỐC CỦA KHÁCH?`)) return
  
  try {
    await updateDoc(doc(db, "reports", report.id), { status: 'approved' })
    const userRef = doc(db, "users", report.uid) // UID gốc đéo fake được
    await updateDoc(userRef, { balance: increment(report.reward) })
    alert("ĐÃ DUYỆT VÀ CỘNG TIỀN THÀNH CÔNG!")
  } catch (error) {
    alert("LỖI KHI DUYỆT: " + error)
  }
}

// 3. HÀM HỦY ĐƠN
const rejectReport = async (id: string) => {
  const reason = prompt("NHẬP LÝ DO TỪ CHỐI (VÍ DỤ: ẢNH FAKE, SAI THÔNG TIN):")
  if (reason === null) return
  
  try {
    await updateDoc(doc(db, "reports", id), { 
      status: 'rejected',
      note: reason || "Thông tin không chính xác"
    })
  } catch(error) {
    alert("LỖI KHI HỦY: " + error)
  }
}

// 4. HÀM XÓA ĐƠN
const deleteReport = async (id: string) => {
  if (confirm("BẠN CÓ CHẮC CHẮN MUỐN XÓA VĨNH VIỄN ĐƠN NÀY?")) {
    try {
      await deleteDoc(doc(db, "reports", id))
    } catch(error) {
      alert("LỖI XÓA ĐƠN: " + error)
    }
  }
}

// 5. NÚT THOÁT
const handleAdminLogout = async () => {
  if(confirm('XÁC NHẬN THOÁT TÀI KHOẢN ADMIN?')) {
    await signOut(auth)
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#090e17] p-4 md:p-10 font-black italic uppercase text-left selection:bg-blue-500/30 relative">
    
    <!-- MODAL ZOOM ẢNH -->
    <Transition name="fade">
      <div v-if="selectedImage" @click="closeImage" class="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out">
        <button @click.stop="closeImage" class="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-slate-800 border border-slate-700 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors z-[6010] shadow-2xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <img :src="selectedImage" @click.stop class="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-[6005] cursor-default" />
      </div>
    </Transition>

    <div class="flex justify-between items-center mb-10">
      <h1 class="text-3xl md:text-5xl text-white tracking-tighter leading-none">
        HỆ THỐNG <span class="text-blue-500">ADMIN</span>
      </h1>
      <button @click="handleAdminLogout" class="bg-slate-800 text-white px-6 py-2 rounded-xl text-[10px] hover:bg-red-600 transition-colors">THOÁT</button>
    </div>

    <!-- BẢNG DANH SÁCH ĐƠN NỘP -->
    <div class="bg-[#111726] border border-slate-800 rounded-[30px] overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#0d121f] text-blue-500 text-[10px] tracking-[2px] border-b border-slate-800">
              <th class="p-6 min-w-[250px]">NGƯỜI NỘP / TÀI KHOẢN</th>
              <th class="p-6 min-w-[150px]">CÔNG VIỆC</th>
              <th class="p-6 text-center min-w-[150px]">BẰNG CHỨNG</th>
              <th class="p-6 text-center min-w-[120px]">TRẠNG THÁI</th>
              <th class="p-6 text-right min-w-[200px]">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-slate-800/50">
            <tr v-for="rp in reports" :key="rp.id" class="hover:bg-white/[0.02] transition-colors group">
              
              <!-- CỘT 1: CHỐNG FAKE BẰNG CHỨNG -->
              <td class="p-6">
                <!-- Data từ bảng Users (Acc thật) -->
                <div class="mb-2 pb-2 border-b border-slate-700/50">
                  <span class="text-[9px] text-emerald-400 tracking-widest block mb-0.5">TÀI KHOẢN GỐC:</span>
                  <div class="text-white text-sm md:text-base font-black truncate max-w-[200px]">
                    {{ usersMap[rp.uid]?.username || usersMap[rp.uid]?.fullName || 'CHƯA CẬP NHẬT' }}
                  </div>
                  <div class="text-slate-400 text-[10px] mt-0.5 font-sans not-italic tracking-normal">
                    SĐT ACC: {{ usersMap[rp.uid]?.phone || 'Không có' }}
                  </div>
                </div>
                <!-- Data từ form nó tự điền -->
                <div>
                  <span class="text-[9px] text-blue-400 tracking-widest block mb-0.5">NỘI DUNG ĐƠN NỘP:</span>
                  <div class="text-slate-300 text-xs font-black truncate max-w-[200px]">
                    {{ rp.fullName || 'N/A' }}
                  </div>
                  <div class="text-slate-500 text-[10px] mt-0.5 font-sans not-italic tracking-normal">
                    SĐT ĐƠN: {{ rp.phoneRef || 'Không có' }}
                  </div>
                </div>
              </td>

              <!-- CỘT 2 -->
              <td class="p-6">
                <div class="text-slate-300 text-[11px] leading-tight mb-1">{{ rp.jobName }}</div>
                <div class="text-emerald-400 text-sm font-black">+{{ rp.reward?.toLocaleString() }}Đ</div>
              </td>

              <!-- CỘT 3: HÌNH ẢNH -->
              <td class="p-6">
                <div class="flex justify-center gap-2">
                  <div v-for="(img, idx) in rp.images" :key="idx" class="relative cursor-pointer" @click="openImage(img)">
                    <div class="block w-12 h-12 rounded-lg border border-slate-700 overflow-hidden hover:scale-110 hover:border-blue-500 transition-all shadow-lg">
                      <img :src="img" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div v-if="!rp.images?.length" class="text-slate-700 text-[9px]">KHÔNG CÓ ẢNH</div>
                </div>
              </td>

              <!-- CỘT 4 -->
              <td class="p-6 text-center text-[10px]">
                <span v-if="rp.status === 'pending'" class="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20">ĐANG CHỜ</span>
                <span v-else-if="rp.status === 'approved'" class="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">ĐÃ DUYỆT</span>
                <span v-else class="bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20">BỊ HỦY</span>
                <div v-if="rp.note" class="text-[8px] text-red-400 mt-1 italic normal-case">{{ rp.note }}</div>
              </td>

              <!-- CỘT 5 -->
              <td class="p-6 text-right">
                <div class="flex flex-col md:flex-row justify-end gap-2">
                  <template v-if="rp.status === 'pending'">
                    <button @click="approveReport(rp)" class="bg-emerald-500 hover:bg-emerald-400 text-white text-[9px] px-4 py-2 rounded-lg transition-all active:scale-95">DUYỆT</button>
                    <button @click="rejectReport(rp.id)" class="bg-red-600 hover:bg-red-500 text-white text-[9px] px-4 py-2 rounded-lg transition-all active:scale-95">HỦY</button>
                  </template>
                  <button @click="deleteReport(rp.id)" class="bg-slate-800 text-slate-400 hover:text-white text-[9px] px-4 py-2 rounded-lg transition-all active:scale-95">XÓA</button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isLoading && reports.length === 0" class="p-20 text-center text-slate-700 tracking-widest text-xs">
        HIỆN CHƯA CÓ ĐƠN NÀO ĐƯỢC GỬI LÊN.
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>