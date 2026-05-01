<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment, 
  deleteDoc, 
  orderBy 
} from "firebase/firestore"

const reports = ref<any[]>([])
const selectedImage = ref('') // Dùng để lưu link ảnh khi bấm zoom

// 1. Lấy đơn nộp từ Firestore - Sắp xếp đơn mới nhất lên đầu
onMounted(() => {
  const q = query(collection(db, "reports"), orderBy("createdAt", "desc"))
  onSnapshot(q, (snapshot) => {
    reports.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

// 2. HÀM DUYỆT: Cộng tiền & Xóa mảng ảnh cho sạch
const approveReport = async (report: any) => {
  if (report.status === 'approved') return alert('Đơn này mày duyệt rồi!')
  
  const confirmDuyet = confirm(`Duyệt đơn cho ${report.phoneRef}? +${report.reward}đ`)
  if (!confirmDuyet) return

  try {
    // A. Cộng tiền vào ví khách
    const userRef = doc(db, "users", report.uid)
    await updateDoc(userRef, {
      balance: increment(report.reward)
    })

    // B. Cập nhật trạng thái và XÓA MẢNG ẢNH
    const reportRef = doc(db, "reports", report.id)
    await updateDoc(reportRef, {
      status: 'approved',
      images: [] // Đã sửa thành dọn dẹp mảng images thay vì biến image cũ
    })

    alert('Đã cộng tiền và dọn dẹp ảnh xong! ✅')
  } catch (error) {
    alert('Lỗi duyệt bài: ' + error)
  }
}

// 3. HÀM TỪ CHỐI
const rejectReport = async (reportId: string) => {
  const note = prompt('Lý do từ chối:', 'Ảnh mờ hoặc sai thông tin')
  if (note === null) return

  try {
    const reportRef = doc(db, "reports", reportId)
    await updateDoc(reportRef, {
      status: 'rejected',
      note: note
    })
  } catch (error) {
    alert('Lỗi: ' + error)
  }
}

// 4. XÓA ĐƠN
const deleteReport = async (reportId: string) => {
  if (confirm('Xóa vĩnh viễn đơn này?')) {
    await deleteDoc(doc(db, "reports", reportId))
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#090e17] p-4 md:p-10 font-black italic uppercase text-left relative selection:bg-blue-500/30">
    
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
      <h1 class="text-3xl md:text-4xl text-white tracking-tighter">HỆ THỐNG <span class="text-[#3b82f6]">ADMIN</span></h1>
      <button @click="$router.push('/')" class="bg-slate-800 hover:bg-white hover:text-black text-slate-400 px-6 py-2 rounded-full text-[10px] transition-all tracking-[2px]">THOÁT</button>
    </div>

    <!-- BẢNG DANH SÁCH -->
    <div class="bg-[#111726] rounded-[30px] border border-slate-800/50 overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="text-slate-500 text-[10px] tracking-[4px] bg-[#0d121f]">
            <tr>
              <th class="p-6">KHÁCH HÀNG</th>
              <th class="p-6">CÔNG VIỆC</th>
              <th class="p-6">BẰNG CHỨNG</th> <!-- Sửa tiêu đề cho ngầu -->
              <th class="p-6 text-center">TRẠNG THÁI</th>
              <th class="p-6 text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody class="text-white text-sm">
            <tr v-for="r in reports" :key="r.id" class="border-b border-slate-800/30 hover:bg-blue-600/5 transition-all">
              
              <!-- KHÁCH HÀNG -->
              <td class="p-6">
                <!-- Sửa biến phone cũ thành phoneRef theo đúng code trang nộp -->
                <p class="text-blue-400 font-black tracking-tight text-base">{{ r.phoneRef || 'N/A' }}</p>
                <p class="text-[9px] text-slate-600 lowercase italic normal-case tracking-wider mt-1">{{ r.uid?.slice(0, 10) }}...</p>
              </td>

              <!-- CÔNG VIỆC -->
              <td class="p-6">
                <p class="text-xs text-slate-300">{{ r.jobName }}</p>
                <p class="text-[12px] text-emerald-400 mt-1 tracking-tighter">+{{ r.reward?.toLocaleString() || 0 }}đ</p>
              </td>

              <!-- ẢNH BẰNG CHỨNG (HIỂN THỊ DẠNG MẢNG NHIỀU ẢNH) -->
              <td class="p-6">
                <div v-if="r.images && r.images.length > 0" class="flex flex-wrap gap-2">
                  <img 
                    v-for="(img, index) in r.images" 
                    :key="index"
                    :src="img" 
                    @click="selectedImage = img"
                    class="w-12 h-12 object-cover rounded-xl border border-slate-700 cursor-zoom-in hover:scale-110 hover:border-blue-500 transition-all shadow-md" 
                    title="Bấm để phóng to"
                  />
                  <!-- Hiển thị số lượng ảnh nếu nhiều -->
                  <div v-if="r.images.length > 0" class="w-full text-[8px] text-slate-500 mt-1 tracking-widest">{{ r.images.length }} ẢNH ĐÍNH KÈM</div>
                </div>
                <span v-else class="text-[9px] text-slate-700 italic px-3 py-1 border border-slate-800 rounded-lg">KHÔNG CÓ ẢNH</span>
              </td>

              <!-- TRẠNG THÁI -->
              <td class="p-6 text-center">
                <span v-if="r.status === 'pending'" class="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded-full text-[9px] tracking-[2px]">CHỜ DUYỆT</span>
                <span v-if="r.status === 'approved'" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-full text-[9px] tracking-[2px]">ĐÃ DUYỆT</span>
                <span v-if="r.status === 'rejected'" class="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-1.5 rounded-full text-[9px] tracking-[2px]">BỊ HỦY</span>
              </td>

              <!-- HÀNH ĐỘNG -->
              <td class="p-6 text-right space-x-2">
                <button @click="approveReport(r)" :disabled="r.status === 'approved'" class="bg-[#00df89] hover:bg-[#00c578] text-[#090e17] px-5 py-2.5 rounded-xl text-[10px] shadow-[0_5px_15px_rgba(0,223,137,0.2)] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed">DUYỆT</button>
                <button @click="rejectReport(r.id)" class="bg-[#ef4444] hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-[10px] transition-all active:scale-95">HỦY</button>
                <button @click="deleteReport(r.id)" class="bg-slate-800 hover:bg-white hover:text-black text-white px-5 py-2.5 rounded-xl text-[10px] transition-all active:scale-95">XÓA</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL ZOOM ẢNH TRÀN MÀN HÌNH -->
    <div 
      v-if="selectedImage" 
      @click="selectedImage = ''" 
      class="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-300"
    >
      <img 
        :src="selectedImage" 
        class="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.2)] border border-white/10 animate-in zoom-in-95 duration-300" 
      />
      <div class="absolute top-6 right-6 text-white text-3xl opacity-50 hover:opacity-100 transition-opacity">✕</div>
      <p class="absolute bottom-6 text-slate-500 text-[10px] tracking-[5px] bg-black/50 px-6 py-2 rounded-full backdrop-blur-md">BẤM BẤT KỲ ĐÂU ĐỂ ĐÓNG</p>
    </div>

  </div>
</template>

<style scoped>
.normal-case { text-transform: none; }
</style>