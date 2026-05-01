<script setup lang="ts">
// Đảm bảo nhận đủ Props từ file cha để hiển thị dữ liệu thực tế
defineProps<{ 
  username: string; 
  isLoggedIn: boolean; 
  userBalance: number;
  totalWithdrawn?: number // Prop nhận số tiền đã rút từ cha
}>();

const emit = defineEmits(['receiveJob', 'contactSupport', 'routerPush']);

// Cấu hình 4 ô thông số tài khoản (Đã thêm ô TỔNG ĐÃ RÚT)
const userStats = [
  { label: 'SỐ DƯ KHẢ DỤNG', key: 'balance', unit: 'Đ', color: 'text-blue-500', icon: '💰' },
  { label: 'TỔNG ĐÃ RÚT', key: 'withdrawn', unit: 'Đ', color: 'text-rose-500', icon: '💸' },
  { label: 'CẤP BẬC TÀI KHOẢN', key: 'rank', value: 'THÀNH VIÊN', unit: '', color: 'text-white', icon: '👑' },
  { label: 'THU NHẬP TUẦN NÀY', key: 'weekly', value: '0', unit: 'Đ', color: 'text-emerald-500', icon: '📈' }
];

// Danh sách công việc với đầy đủ Icon SVG và class Hover từ code gốc 156 dòng
const jobsData = [
  {
    id: '01', 
    n: 'APP CHỨNG KHOÁN', 
    p: '200.000đ', 
    d: 'Đăng ký tài khoản & KYC nhận ngay thưởng lớn.',
    iconColor: 'text-blue-500 border-blue-500/40',
    cardHover: 'hover:border-blue-500/50',
    titleHover: 'group-hover:text-blue-400',
    btnHover: 'group-hover:bg-blue-600',
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>`
  },
  {
    id: '02', 
    n: 'GOOGLE MAP', 
    p: '15.000đ', 
    d: 'Đánh giá địa điểm nhận thưởng hàng ngày.',
    iconColor: 'text-orange-500 border-orange-500/40',
    cardHover: 'hover:border-orange-500/50',
    titleHover: 'group-hover:text-orange-400',
    btnHover: 'group-hover:bg-orange-600',
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
  },
  {
    id: '03', 
    n: 'APP NGÂN HÀNG', 
    p: '100.000đ', 
    d: 'Mở tài khoản các ngân hàng Việt Nam...',
    iconColor: 'text-emerald-500 border-emerald-500/40',
    cardHover: 'hover:border-emerald-500/50',
    titleHover: 'group-hover:text-emerald-400',
    btnHover: 'group-hover:bg-emerald-600',
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="20" width="20" height="2"></rect><rect x="4" y="10" width="2" height="10"></rect><rect x="10" y="10" width="2" height="10"></rect><rect x="16" y="10" width="2" height="10"></rect><polygon points="12 2 2 10 22 10 12 2"></polygon></svg>`
  },
  {
    id: '04', 
    n: 'XEM TIKTOK', 
    p: '500đ', 
    d: 'Cày video & thả tim nhận quà không giới hạn.',
    iconColor: 'text-rose-500 border-rose-500/40',
    cardHover: 'hover:border-rose-500/50',
    titleHover: 'group-hover:text-rose-400',
    btnHover: 'group-hover:bg-rose-600',
    svg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0-1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`
  }
];
</script>

<template>
  <div class="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 font-black italic uppercase text-left">
    
    <!-- DASHBOARD AREA: BANNER & STATS GRID -->
    <div class="flex flex-col xl:flex-row gap-6">
      
      <!-- BANNER CHÀO MỪNG (BÊN TRÁI 60%) -->
      <section class="xl:w-[60%] relative bg-[#111726] rounded-[45px] md:rounded-[50px] border border-slate-800/50 p-8 md:p-14 overflow-hidden shadow-2xl flex items-center min-h-[350px]">
        <div class="absolute -right-20 -top-20 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        
        <div class="relative z-10 space-y-6 w-full">
          <div class="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-500 text-[10px] px-5 py-2.5 rounded-full border border-emerald-500/20 tracking-[2px] shadow-inner">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Hệ thống đang trực tuyến
          </div>

          <h1 class="text-3xl md:text-5xl text-white leading-[0.95] tracking-tighter">
            {{ isLoggedIn ? 'CHÀO MỪNG TRỞ LẠI,' : 'CHÀO MỪNG ĐẾN VỚI' }} <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-400 drop-shadow-[0_10px_30px_rgba(37,99,235,0.4)]">
              {{ username.toUpperCase() }}
            </span>
          </h1>

          <!-- NỘI DUNG MỚI: KHÔNG CỌC - KHÔNG PHÍ - RÚT NHANH -->
          <div class="space-y-2 border-l-2 border-blue-600/40 pl-5">
            <p class="text-slate-400 text-[11px] max-w-sm normal-case font-bold tracking-wide opacity-90 leading-relaxed italic">
              Nền tảng kiếm tiền Online <span class="text-emerald-400">không cần vốn - không thu phí - không cọc tiền</span>.
            </p>
            <p class="text-slate-500 text-[10px] max-w-sm normal-case font-medium tracking-wide opacity-70 leading-relaxed">
              Hệ thống hỗ trợ rút tiền <span class="text-blue-400">nhanh gọn 24/7</span> về ngân hàng. Làm nhiệm vụ nhận tiền tươi mỗi ngày cùng MMO PRO.
            </p>
          </div>

          <div class="pt-4">
            <button @click="emit('routerPush', '/login')" class="bg-blue-600 text-white px-10 py-5 rounded-[22px] text-[11px] tracking-[2px] shadow-xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-white/10 font-black italic uppercase">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              ĐĂNG NHẬP NGAY
            </button>
          </div>
        </div>
      </section>

      <!-- USER STATS GRID (BÊN PHẢI 40%) -->
      <div class="xl:w-[40%] grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="stat in userStats" :key="stat.label" class="bg-[#111726] border border-slate-800/60 rounded-[35px] p-6 flex flex-col justify-center relative overflow-hidden group hover:border-slate-600 transition-all shadow-xl min-h-[110px]">
          <div class="absolute -right-4 -bottom-4 text-7xl opacity-[0.02] group-hover:scale-125 transition-transform select-none">{{ stat.icon }}</div>
          <p class="text-slate-500 text-[10px] tracking-[3px] mb-3 opacity-80 uppercase leading-none">{{ stat.label }}</p>
          <p class="text-2xl md:text-3xl font-black italic tracking-tighter leading-none" :class="stat.color">
            <template v-if="stat.key === 'balance'">{{ userBalance.toLocaleString() }}</template>
            <template v-else-if="stat.key === 'withdrawn'">{{ (totalWithdrawn || 0).toLocaleString() }}</template>
            <template v-else-if="stat.key === 'rank'">{{ stat.value }}</template>
            <template v-else-if="stat.key === 'weekly'">{{ stat.value }}</template>
            <span class="text-sm ml-1">{{ stat.unit }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- CÔNG VIỆC NỔI BẬT -->
    <section class="space-y-10">
      <div class="flex items-center gap-4">
        <div class="w-2.5 h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
        <h3 class="text-3xl md:text-5xl text-white tracking-tighter leading-none uppercase italic">CÔNG VIỆC <span class="text-emerald-500">NỔI BẬT</span></h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(j, i) in jobsData" :key="i" @click="emit('receiveJob', j.n)" class="bg-[#111726] p-10 rounded-[50px] border border-slate-800 transition-all duration-500 group relative shadow-2xl overflow-hidden min-h-[420px] flex flex-col cursor-pointer hover:border-emerald-500/40 text-left">
          <div class="absolute -right-4 -top-4 text-9xl text-slate-800/10 group-hover:text-slate-700/20 transition-all font-black select-none pointer-events-none">{{ j.id }}</div>
          <div class="w-16 h-16 rounded-[22px] border bg-[#0d121f]/50 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-all" :class="j.iconColor" v-html="j.svg"></div>
          <h4 class="text-xl text-white mb-2 leading-none font-black italic uppercase" :class="j.titleHover">{{ j.n }}</h4>
          <p class="text-slate-500 text-[11px] opacity-70 mb-auto leading-relaxed normal-case italic">{{ j.d }}</p>
          <p class="text-emerald-400 font-black text-4xl mt-6 tracking-tighter leading-none italic uppercase">{{ j.p }}</p>
          <button class="w-full mt-8 py-5 bg-[#1a2333] rounded-2xl text-[10px] text-white tracking-[2px] shadow-lg border border-white/5 font-black uppercase italic transition-colors" :class="j.btnHover">NHẬN VIỆC NGAY</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-float { animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
</style>