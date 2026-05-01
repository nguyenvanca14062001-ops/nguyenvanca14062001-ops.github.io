<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showGuide = ref(false)

// TỔNG KHO DỮ LIỆU: Mày có thể thêm bao nhiêu Job tùy thích vào đây
const jobsData: Record<string, any> = {
  'app-chung-khoan': {
    title: "MỞ APP CHỨNG KHOÁN",
    reward: "200.000đ",
    color: "text-blue-500",
    steps: [
      { id: 1, title: "TẢI APP & ĐĂNG KÝ", content: "Lên AppStore/CHPlay tải app chứng khoán theo hướng dẫn.", img: "https://placehold.co/400x250/0d121f/3b82f6?text=ANH+BUOC+1&font=montserrat" },
      { id: 2, title: "XÁC THỰC KYC", content: "Chụp ảnh CCCD và xác thực khuôn mặt để mở tài khoản.", img: "https://placehold.co/400x250/0d121f/10b981?text=ANH+BUOC+2&font=montserrat" },
      { id: 3, title: "CHỤP ẢNH HOÀN TẤT", content: "Chụp lại màn hình thông báo 'Đăng ký thành công'.", img: "https://placehold.co/400x250/0d121f/f59e0b?text=ANH+BUOC+3&font=montserrat" }
    ]
  },
  'google-map': {
    title: "XÁC THỰC GOOGLE MAP",
    reward: "15.000đ",
    color: "text-emerald-500",
    steps: [
      { id: 1, title: "TÌM ĐỊA ĐIỂM", content: "Tìm địa chỉ theo yêu cầu trên Google Map.", img: "https://placehold.co/400x250/0d121f/3b82f6?text=ANH+BUOC+1&font=montserrat" },
      { id: 2, title: "ĐÁNH GIÁ 5 SAO", content: "Viết bình luận tốt và đăng kèm ảnh chụp địa điểm.", img: "https://placehold.co/400x250/0d121f/10b981?text=ANH+BUOC+2&font=montserrat" }
    ]
  },
  'app-ngan-hang': {
    title: "MỞ APP NGÂN HÀNG",
    reward: "100.000đ",
    color: "text-orange-500",
    steps: [
      { id: 1, title: "TẢI APP NGÂN HÀNG", content: "Tải app chính thức từ Store về máy.", img: "https://placehold.co/400x250/0d121f/3b82f6?text=ANH+BUOC+1&font=montserrat" },
      { id: 2, title: "ĐỊNH DANH TÀI KHOẢN", content: "Làm theo các bước định danh của ngân hàng.", img: "https://placehold.co/400x250/0d121f/10b981?text=ANH+BUOC+2&font=montserrat" }
    ]
  }
}

// Mặc định ban đầu nếu không tìm thấy Job sẽ lấy Chứng khoán
const currentJob = ref(jobsData['app-chung-khoan'])

onMounted(() => {
  const jobId = route.params.id as string
  if (jobId && jobsData[jobId]) {
    currentJob.value = jobsData[jobId]
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#090e17] text-slate-300 p-4 md:p-8 font-black italic uppercase text-left selection:bg-emerald-500/30">
    
    <!-- THANH ĐIỀU HƯỚNG -->
    <div class="flex justify-between items-center mb-8 max-w-4xl mx-auto border-b border-slate-800 pb-4">
      <button @click="router.back()" class="text-[10px] tracking-[3px] text-slate-500 hover:text-white transition-all flex items-center gap-1">
        <span class="text-base font-light not-italic font-sans">✕</span> QUAY LẠI
      </button>
      <span class="text-[10px] tracking-[4px] text-slate-600">HƯỚNG DẪN CHI TIẾT</span>
    </div>

    <div class="max-w-3xl mx-auto space-y-10">
      
      <!-- HEADER CHỨA TIÊU ĐỀ VÀ THƯỞNG -->
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none mb-5 drop-shadow-lg">
          {{ currentJob.title }}
        </h1>
        
        <div class="bg-[#052e1f] border border-[#005c3c] rounded-full px-6 py-2.5 w-max mx-auto flex items-center gap-2 shadow-[0_0_20px_rgba(0,223,137,0.1)]">
          <span class="text-[#f59e0b] text-xl leading-none">⚡</span>
          <span class="text-[#00df89] text-base md:text-lg font-black italic uppercase tracking-tighter mt-0.5">
            THƯỞNG: {{ currentJob.reward }}
          </span>
        </div>
      </div>

      <!-- CARD THÔNG BÁO VÀ HƯỚNG DẪN -->
      <div class="bg-[#111726] rounded-[45px] border border-slate-800/50 p-6 md:p-10 shadow-2xl relative">
        <div class="text-center space-y-5">
          <div class="bg-blue-900/30 w-fit mx-auto px-5 py-1.5 rounded-full border border-blue-800/40 text-[9px] text-blue-400 tracking-[2px]">
            1. THÔNG BÁO
          </div>
          <p class="text-slate-400 text-xs italic normal-case opacity-70 tracking-wide">
            Vui lòng đọc kỹ hướng dẫn trước khi thực hiện để được duyệt tiền nhanh nhất.
          </p>

          <!-- NÚT BẤM HIỆN/ẨN HƯỚNG DẪN -->
          <button @click="showGuide = !showGuide" 
            class="group relative w-full flex items-center gap-4 bg-[#0d121f] border-2 border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-3xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.05)] mt-4">
            <div class="text-4xl group-hover:scale-110 transition-transform">📖</div>
            <div class="text-left">
              <h3 class="text-lg text-white font-black italic leading-none mb-1 uppercase">HƯỚNG DẪN CHI TIẾT</h3>
              <p class="text-[#00df89] text-[8px] tracking-[1px] font-black uppercase opacity-80 italic">NHẤN ĐỂ XEM ẢNH MINH HỌA VÀ MẸO LÀM NHANH</p>
            </div>
          </button>
        </div>

        <!-- PHẦN HƯỚNG DẪN CHI TIẾT (XUẤT HIỆN KHI CLICK) -->
        <div v-if="showGuide" class="mt-8 pt-8 border-t border-slate-800/50 space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div v-for="step in currentJob.steps" :key="step.id" class="border-b border-slate-800/50 pb-8 last:border-0 last:pb-0">
            <h4 class="text-[#3b82f6] text-base md:text-lg italic font-black mb-2 uppercase">BƯỚC {{ step.id }}: {{ step.title }}</h4>
            <p class="text-slate-400 text-xs italic normal-case opacity-80 leading-relaxed mb-4">{{ step.content }}</p>
            
            <!-- KHUNG ẢNH MINH HỌA -->
            <div class="overflow-hidden rounded-2xl border border-slate-700/50 shadow-md w-full max-w-[240px] md:max-w-[280px] bg-[#0d121f]">
              <img :src="step.img" class="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 opacity-90 hover:opacity-100" />
            </div>
          </div>
        </div>
      </div>

      <!-- NÚT NỘP BẰNG CHỨNG -->
      <section class="bg-[#111726] rounded-[45px] border border-slate-800/50 p-8 md:p-10 text-center shadow-xl">
        <h2 class="text-lg text-slate-400 font-black italic mb-6 tracking-wide uppercase">BẠN ĐÃ LÀM XONG CÁC BƯỚC TRÊN?</h2>
        <button @click="router.push('/submit-report')" 
          class="w-full bg-[#00df89] hover:bg-[#00c578] text-[#090e17] py-5 rounded-2xl text-xl font-black italic uppercase shadow-[0_10px_30px_rgba(0,223,137,0.2)] transition-all active:scale-95 tracking-tighter">
          TÔI ĐÃ XONG - NỘP BẰNG CHỨNG
        </button>
      </section>

      <div class="text-center opacity-20 text-[8px] tracking-[5px] pb-10 uppercase italic font-black">MMO PRO SECURITY SYSTEM</div>
    </div>
  </div>
</template>

<style scoped>
.normal-case { text-transform: none; }
</style>