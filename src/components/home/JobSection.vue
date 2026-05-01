<script setup lang="ts">
// Nhận Props từ file cha để hiển thị dữ liệu thực tế
defineProps<{ 
  username: string; 
  isLoggedIn: boolean; 
  userBalance: number;
  totalWithdrawn?: number 
}>();

const emit = defineEmits(['receiveJob', 'contactSupport', 'routerPush']);

// 4 ô thông số tài khoản
const userStats = [
  { label: 'SỐ DƯ KHẢ DỤNG', key: 'balance', unit: 'Đ', color: 'text-blue-500', icon: '💰' },
  { label: 'TỔNG ĐÃ RÚT', key: 'withdrawn', unit: 'Đ', color: 'text-rose-500', icon: '💸' },
  { label: 'CẤP BẬC TÀI KHOẢN', key: 'rank', value: 'THÀNH VIÊN', unit: '', color: 'text-white', icon: '👑' },
  { label: 'THU NHẬP TUẦN NÀY', key: 'weekly', value: '0', unit: 'Đ', color: 'text-emerald-500', icon: '📈' }
];

// DANH SÁCH 6 CÔNG VIỆC - ĐÃ FIX LỖI CHÍNH TẢ VÀ ĐỒNG BỘ MÀU VÀNG
const jobsData = [
  { id: '01', n: 'APP CHỨNG KHOÁN', p: '150.000đ', d: 'Đăng ký & KYC nhận thưởng.', color: 'text-blue-400', svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline></svg>` },
  { id: '02', n: 'GOOGLE MAP', p: '15.000đ', d: 'Đánh giá nhận thưởng ngay.', color: 'text-orange-400', svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>` },
  { id: '03', n: 'NGÂN HÀNG MSB', p: '80.000đ', d: 'Mở tài khoản ngân hàng MSB.', color: 'text-emerald-400', svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="2" y="20" width="20" height="2"></rect><path d="M12 2L2 10h20L12 2z"></path></svg>` },
  { id: '04', n: 'GIỚI THIỆU BẠN BÈ ', p: '100.000đ', d: 'Giới thiệu nhận quà giới hạn.', color: 'text-rose-400', svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46"></path></svg>` },
  { id: '05', n: 'NGÂN HÀNG TPBANK', p: '90.000đ', d: 'Mở tài khoản TPBank.', color: 'text-purple-400', svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>` },
  { id: '06', n: 'NGÂN HÀNG VPBANK', p: '100.000đ', d: 'Mở tài khoản VPBank.', color: 'text-green-400', svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>` }
];
</script>

<template>
  <div class="space-y-4 animate-in fade-in duration-700 font-black uppercase text-left italic">
    
    <!-- BANNER CHÀO MỪNG -->
    <div class="flex flex-col lg:flex-row gap-2">
      <section class="lg:w-2/3 relative bg-[#111726]/80 rounded-[30px] border border-slate-800/50 p-5 md:p-12 overflow-hidden flex items-center min-h-[180px] md:min-h-[320px] shadow-2xl">
        <div class="absolute -right-20 -top-20 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]"></div>
        <div class="relative z-10 space-y-3 w-full">
          <div class="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 text-[7px] px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span class="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> TRỰC TUYẾN
          </div>
          <h1 class="text-2xl md:text-5xl text-white leading-[0.95] tracking-tighter">
            CHÀO MỪNG,<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{{ username.toUpperCase() }}</span>
          </h1>
          <p class="text-slate-400 text-[9px] normal-case font-bold leading-tight italic border-l-2 border-blue-600 pl-3 max-w-xs opacity-80">
            Nền tảng kiếm tiền Online không cần vốn. Rút tiền nhanh gọn 24/7.
          </p>
          <button v-if="!isLoggedIn" @click="emit('routerPush', '/login')" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[9px] shadow-lg shadow-blue-900/40 uppercase font-black">
            ĐĂNG NHẬP NGAY
          </button>
        </div>
      </section>

      <!-- 4 Ô THỐNG KÊ -->
      <div class="lg:w-1/3 grid grid-cols-2 gap-2">
        <div v-for="stat in userStats" :key="stat.label" class="bg-[#111726]/80 border border-slate-800/50 rounded-[22px] p-4 flex flex-col justify-between min-h-[100px] md:min-h-[150px] relative overflow-hidden group shadow-xl">
          <div class="absolute -right-1 -bottom-1 text-3xl opacity-[0.03] select-none">{{ stat.icon }}</div>
          <p class="text-slate-500 text-[7px] tracking-[1.5px] opacity-70 uppercase leading-none">{{ stat.label }}</p>
          <div class="mt-auto">
            <p class="text-base md:text-2xl font-black italic tracking-tighter leading-none" :class="stat.color">
              <template v-if="stat.key === 'balance'">{{ userBalance.toLocaleString() }}</template>
              <template v-else-if="stat.key === 'withdrawn'">{{ (totalWithdrawn || 0).toLocaleString() }}</template>
              <template v-else>{{ stat.value }}</template>
              <span class="text-[9px] ml-0.5">{{ stat.unit }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- DANH SÁCH CÔNG VIỆC -->
    <section class="space-y-2">
      <div class="flex items-center gap-2 px-1">
        <div class="w-1 h-4 bg-emerald-500 rounded-full"></div>
        <h3 class="text-sm md:text-3xl text-white tracking-tighter italic font-black uppercase">CÔNG VIỆC <span class="text-emerald-500">NỔI BẬT</span></h3>
      </div>
      
      <div class="bg-[#111726]/40 border border-slate-800/50 rounded-[25px] p-1.5 md:p-8 shadow-inner">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-4">
          <div v-for="j in jobsData" :key="j.id" @click="emit('receiveJob', j.n)" 
            class="relative bg-[#0d121f] pt-1.5 px-2.5 pb-2.5 md:pt-4 md:px-6 md:pb-6 rounded-[18px] border border-slate-800 transition-all duration-300 flex flex-col min-h-0 hover:border-blue-500/20 shadow-xl group">
            
            <!-- NHÃN HOT RỰC CHÁY -->
            <div class="absolute -top-1.5 -right-1.5 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] px-2 py-1 rounded-bl-xl rounded-tr-lg font-black italic animate-pulse shadow-lg shadow-red-900/60 scale-110">
              HOT 🔥
            </div>

            <div class="flex justify-between items-start mb-0">
              <div class="w-6 h-6 md:w-12 md:h-12 rounded-lg border border-slate-800 bg-[#111726] flex items-center justify-center shadow-md" :class="j.color" v-html="j.svg"></div>
              <span class="text-lg md:text-5xl text-slate-800/10 font-black leading-none select-none">{{ j.id }}</span>
            </div>
            
            <h4 class="text-[10px] md:text-base text-white leading-tight font-black italic uppercase line-clamp-1 mt-0.5">{{ j.n }}</h4>
            
            <!-- MÔ TẢ: MÀU VÀNG & TO HƠN -->
            <p class="text-yellow-400 text-[10px] md:text-[12px] opacity-90 leading-tight normal-case italic line-clamp-1 mt-0">{{ j.d }}</p>
            
            <p class="text-emerald-400 font-black text-[14px] md:text-2xl tracking-tighter leading-none mt-1">{{ j.p }}</p>
            
            <button class="w-full mt-1 py-1.5 md:py-3 bg-[#1a2333] hover:bg-blue-600/10 rounded-lg text-[8px] md:text-[10px] text-white border border-white/5 font-black uppercase transition-all shadow-md">
              NHẬN VIỆC
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>