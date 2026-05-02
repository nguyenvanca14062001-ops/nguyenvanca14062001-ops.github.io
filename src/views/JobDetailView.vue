<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showGuide = ref(false)

const jobsData: Record<string, any> = {
  'app-chung-khoan': {
    title: "MỞ APP CHỨNG KHOÁN",
    reward: "200.000đ",
    color: "text-blue-500",
    steps: [
      { 
        id: 1, 
        title: "BẤM VÀO LINK TẢI APP", 
        content: "Chọn TẢI APP NGAY để tải APP chứng khoán về điện thoại.", 
        downloadLink: "https://open.kafi.vn/x/sign-up?refCode=D0020029",
        
      },
      { 
        id: 2, 
        title: "ĐĂNG KÝ VÀ NHẬP MÃ GIỚI THIỆU D0020029", 
        content: "BẮT BUỘC NHẬP MÃ GIỚI THIỆU D0020029 VÀ CHỤP LẠI ẢNH GỬI VÀO BẰNG CHỨNG.", 
        img: "/images/anh-kafi2.jpg",
        note: "NHẬP MÃ: D0020029 (BẮT BUỘC)"
      },
      { 
        id: 3, 
        title: "ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG VÀ ĐĂNG NHẬP", 
        content: "CHỤP LẠI ẢNH ĐĂNG NHẬP THÀNH CÔNG ĐỂ GỬI BẰNG CHỨNG.", 
        img: "/images/anh-kafi3.jpg" 
      },
      { 
        id: 4, 
        title: "LƯU LẠI ẢNH NHẬP MÃ GIỚI THIỆU VÀ ĐĂNG NHẬP",
        content: "GỬI 2 ẢNH ĐÓ VÀ CHỜ PHÊ DUYỆT HOA HỒNG.",
         
      }
    ]
  },
  'google-map': {
    title: "XÁC THỰC GOOGLE MAP",
    reward: "15.000đ",
    color: "text-emerald-500",
    steps: [
      { id: 1, title: "TÌM ĐỊA ĐIỂM VINCOM HÀ NỘI", content: "CHỌN 3 ĐỊA CHỈ NGẪU NHIÊN VINCOM HÀ NỘI .", img: "/images/anh-vincom1.jpg" },
      { id: 2, title: "ĐÁNH GIÁ 5 SAO", content: "Viết bình luận tốt và đăng kèm ảnh chụp địa điểm.", img: "/images/anh-vincom2.jpg" }, // THÊM DẤU PHẨY Ở ĐÂY
      { id: 3, title: "CHỤP LẠI ẢNH BẰNG CHỨNG ", content: "CHỤP LẠI 3 ẢNH ĐÁNH GIÁ 5 SAO LÀM ẢNH BẰNG CHỨNG.",} // SỬA LẠI ĐÚNG CÚ PHÁP
    ]
  },
  'vpbank': {
    title: "MỞ TÀI KHOẢN VPBANK",
    reward: "100.000đ",
    color: "text-emerald-600",
    steps: [
      { id: 1, title: "TẢI APP VPBANK NEO", content: "TẢI ỨNG DỤNG VÀ TIẾN HÀNH ĐĂNG KÝ TÀI KHOẢN .", img: "/images/anh-vpbank1.jpg" },
      { 
        id: 2, 
        title: "ĐĂNG KÝ eKYC VÀ NHẬP MÃ GIỚI THIỆU : AT420584 ", 
        content: "BẮT BUỘC NHẬP MÃ GIỚI THIỆU AT420584 VÀ CHỤP LẠI MÀN HÌNH .", 
        img: "/images/anh-vpbank2.jpg",
        note: "NHẬP MÃ: AT420584 (BẮT BUỘC)" 
      },
      { id: 3, title: "ĐĂNG NHẬP VÀ CHỤP ẢNH BẰNG CHỨNG ", content: "GỬI ẢNH BẰNG CHỨNG NHƯ HƯỚNG DẪN DƯỚI ĐÂY .", img: "/images/anh-vpbank3.jpg" },
      { id: 4, title: "LƯU LẠI ẢNH NHẬP MÃ GIỚI THIỆU VÀ ẢNH ĐĂNG NHẬP ", content: "TIẾN HÀNH GỬI 2 ẢNH BẰNG CHỨNG CHỜ XÉT DUYỆT ."}
    
    ]
  },
  'tpbank': {
    title: "MỞ TÀI KHOẢN TPBANK",
    reward: "70.000đ",
    color: "text-purple-600",
    steps: [
      { id: 1, title: "TẢI APP TPBANK", content: "Mở ứng dụng và bắt đầu đăng ký.", img: "/images/anh-tpbank1.jpg" },
      { 
        id: 2, 
        title: "ĐĂNG KÝ NHẬP MÃ GIỚI THIỆU AT09", 
        content: "BẮT BUỘC NHẬP MÃ GIỚI THIỆU AT09 CHỤP LẠI ẢNH BẰNG CHỨNG.", 
        img: "/images/anh-tpbank2.jpg",
        note: "NHẬP MÃ: AT09 (BẮT BUỘC)"
      },
      { 
        id: 3, 
        title: "ĐĂNG NHẬP VÀ CHỤP LẠI ẢNH BẰNG CHỨNG", 
        content: "CHỤP LẠI ẢNH ĐĂNG NHẬP NHƯ DƯỚI ĐÂY.", 
        img: "/images/anh-tpbank3.jpg" 
      },
      { id: 4, title: "LƯU LẠI ẢNH NHẬP MÃ GIỚI THIỆU VÀ ẢNH ĐĂNG NHẬP ", content: "TIẾN HÀNH GỬI 2 ẢNH BẰNG CHỨNG CHỜ XÉT DUYỆT ."}
    ]
  }
}

const currentJob = ref(jobsData[route.params.id as string] || jobsData['app-chung-khoan'])

onMounted(() => {
  const jobId = route.params.id as string
  if (jobId && jobsData[jobId]) {
    currentJob.value = jobsData[jobId]
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#090e17] text-slate-300 p-4 md:p-8 font-black italic uppercase text-left">
    <!-- THANH ĐIỀU HƯỚNG -->
    <div class="flex justify-between items-center mb-8 max-w-4xl mx-auto border-b border-slate-800 pb-4">
      <button @click="router.back()" class="text-[10px] tracking-[3px] text-slate-500 hover:text-white transition-all flex items-center gap-1">
        <span class="text-base font-light not-italic font-sans">✕</span> QUAY LẠI
      </button>
      <span class="text-[10px] tracking-[4px] text-slate-600">HƯỚNG DẪN CHI TIẾT</span>
    </div>

    <div class="max-w-4xl mx-auto space-y-10">
      <!-- HEADER -->
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none mb-5 drop-shadow-lg">
          {{ currentJob.title }}
        </h1>
        <div class="bg-[#052e1f] border border-[#005c3c] rounded-full px-6 py-2.5 w-max mx-auto flex items-center gap-2">
          <span class="text-[#f59e0b] text-xl">⚡</span>
          <span class="text-[#00df89] text-base md:text-lg font-black italic uppercase tracking-tighter">
            THƯỞNG: {{ currentJob.reward }}
          </span>
        </div>
      </div>

      <!-- HƯỚNG DẪN -->
      <div class="bg-[#111726] rounded-[45px] border border-slate-800/50 p-6 md:p-10 shadow-2xl relative">
        <div class="text-center space-y-5">
          <button @click="showGuide = !showGuide" 
            class="group relative w-full flex items-center gap-4 bg-[#0d121f] border-2 border-emerald-500/30 hover:border-emerald-500/60 p-5 rounded-3xl transition-all mt-4">
            <div class="text-4xl group-hover:scale-110 transition-transform">📖</div>
            <div class="text-left">
              <h3 class="text-lg text-white font-black italic leading-none mb-1 uppercase">XEM HƯỚNG DẪN VÀ LÀM THEO 4 BƯỚC </h3>
              <p class="text-[#00df89] text-[8px] tracking-[1px] font-black uppercase italic">NHẤN ĐỂ MỞ TỪNG BƯỚC LÀM</p>
            </div>
          </button>
        </div>

       <div v-if="showGuide" 
class="mt-8 pt-8 border-t border-slate-800/50 space-y-6 animate-in fade-in zoom-in-95 duration-300">

  <div v-for="step in currentJob.steps" :key="step.id" class="relative pl-10">

    <!-- LINE DỌC -->
    <div class="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-700/50"></div>

    <!-- CIRCLE STEP -->
    <div class="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#00df89] text-[#090e17] flex items-center justify-center text-sm font-black">
      {{ step.id }}
    </div>

    <!-- CONTENT -->
    <div class="pb-6">
      <h4 class="text-[#3b82f6] text-base md:text-lg italic font-black mb-2 uppercase">
        {{ step.title }}
      </h4>

      <p class="text-slate-400 text-xs italic normal-case opacity-80 leading-relaxed mb-4">
        {{ step.content }}
      </p>

      <!-- BUTTON -->
      <div v-if="step.downloadLink" class="mb-6">
        <a :href="step.downloadLink" target="_blank"
          class="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase">
          TẢI APP NGAY
        </a>
      </div>

      <!-- IMAGE + NOTE -->
      <div class="flex flex-col md:flex-row gap-4">
        <div v-if="step.img" class="max-w-[260px] rounded-xl overflow-hidden border border-slate-700">
          <img :src="step.img" class="w-full h-auto"/>
        </div>

        <div v-if="step.note" class="bg-[#0d121f] border border-blue-500/30 p-5 rounded-xl">
          <p class="text-blue-400 text-[10px] mb-2">THÔNG TIN QUAN TRỌNG</p>
          <h5 class="text-white text-lg font-black">{{ step.note }}</h5>
        </div>
      </div>
    </div>

  </div>
</div>
</div>
      <section class="bg-[#111726] rounded-[45px] border border-slate-800/50 p-8 md:p-10 text-center shadow-xl">
        <h2 class="text-lg text-slate-400 font-black italic mb-6 tracking-wide uppercase">BẠN ĐÃ LÀM XONG?</h2>
        <button @click="router.push('/submit-report')" 
          class="w-full bg-[#00df89] hover:bg-[#00c578] text-[#090e17] py-5 rounded-2xl text-xl font-black italic uppercase shadow-[0_10px_30px_rgba(0,223,137,0.2)] transition-all active:scale-95">
          NỘP BẰNG CHỨNG NGAY
        </button>
      </section>
    </div>
  </div>
</template>