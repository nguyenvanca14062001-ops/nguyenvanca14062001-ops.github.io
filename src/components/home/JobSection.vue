<script setup lang="ts">
// Nhận dữ liệu từ App.vue
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
  { label: 'TỔNG ĐÃ RÚT', key: 'withdrawn', unit: 'Đ', color: 'text-rose-400/90', icon: '💸' },
  { label: 'CẤP BẬC TÀI KHOẢN', key: 'rank', value: 'THÀNH VIÊN', unit: '', color: 'text-white/90', icon: '👑' },
  { label: 'THU NHẬP TUẦN NÀY', key: 'weekly', value: '0', unit: 'Đ', color: 'text-emerald-400/90', icon: '📈' }
];

/**
 * TỔNG KHO CÔNG VIỆC TẠI TRANG CHỦ
 */
const jobsData = [
  { 
    id: 'google-map', 
    n: 'ĐÁNH GIÁ GOOGLE MAP', 
    p: '15.000đ', 
    d: 'Đánh giá nhận thưởng ngay.', 
    color: 'text-orange-400', 
    type: 'svg',
    iconContent: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>' 
  },
  { 
    id: 'app-chung-khoan', 
    n: 'ĐĂNG KÝ APP CHỨNG KHOÁN', 
    p: '200.000đ', 
    d: 'Đăng ký & KYC nhận thưởng.', 
    color: 'text-blue-400', 
    type: 'svg',
    iconContent: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline></svg>' 
  },
  { 
    id: 'vpbank', 
    n: 'ĐĂNG KÝ NGÂN HÀNG VPBANK', 
    p: '100.000đ', 
    d: 'Mở tài khoản VPBank.', 
    type: 'text', 
    shortName: 'VPB', 
    colorClass: 'text-emerald-500', 
    borderClass: 'border-emerald-500/40' 
  },
  { 
    id: 'tpbank', 
    n: 'ĐĂNG KÝ NGÂN HÀNG TPBANK', 
    p: '70.000đ', 
    d: 'Mở tài khoản TPBank.', 
    type: 'text', 
    shortName: 'TPB', 
    colorClass: 'text-purple-500', 
    borderClass: 'border-purple-500/40' 
  }
];
</script>

<template>
  <div class="space-y-4 animate-in fade-in duration-700 font-black uppercase text-left italic">
    
    <!-- BANNER CHÀO MỪNG -->
    <div class="flex flex-col lg:flex-row gap-2">
      <section class="lg:w-2/3 relative bg-[#111726]/80 rounded-[30px] border border-slate-800/50 p-6 md:p-10 overflow-hidden flex items-start pt-8 md:pt-10 min-h-[200px] md:min-h-[400px] shadow-2xl">
        <div class="absolute -right-20 -top-20 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]"></div>
        
        <div class="relative z-10 space-y-6 w-full">
          <div class="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 text-[8px] px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> HỆ THỐNG TRỰC TUYẾN
          </div>

          <h1 class="text-2xl md:text-4xl text-white leading-tight tracking-tighter uppercase font-black italic -mt-2">
            CHÀO MỪNG,<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 text-3xl md:text-5xl">
              {{ username.toUpperCase() }}
            </span>
          </h1>

          <div class="space-y-4 border-l-4 border-blue-600 pl-5 max-w-2xl">
            <p class="text-slate-200 text-[12px] md:text-[15px] normal-case font-bold leading-relaxed italic opacity-95">
              Nền tảng kiếm tiền Online minh bạch. Rút tiền nhanh gọn 24/7.
            </p>
            <p class="text-rose-400 text-[11px] md:text-[13px] normal-case font-black leading-snug tracking-wide">
              ⚠️ CẢNH BÁO: Nghiêm cấm mọi hành vi gian lận hoặc gửi bằng chứng giả. Hệ thống sẽ khóa tài khoản vĩnh viễn nếu phát hiện vi phạm.
            </p>
            <p class="text-blue-400 text-[11px] md:text-[13px] normal-case font-bold leading-snug">
              💡 MẸO: Liên hệ trực tiếp qua <span class="underline cursor-pointer hover:text-white transition-colors" @click="emit('contactSupport', 'facebook')">Fanpage Support</span> để được ưu tiên duyệt đơn nhanh hơn trong vòng 15-30 phút.
            </p>
          </div>

          <div v-if="!isLoggedIn" class="pt-4">
            <button @click="emit('routerPush', '/login')" class="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl text-[11px] shadow-xl shadow-blue-900/40 uppercase font-black transition-all active:scale-95">
              BẮT ĐẦU KIẾM TIỀN NGAY
            </button>
          </div>
        </div>
      </section>

      <!-- 4 Ô THỐNG KÊ -->
      <div class="lg:w-1/3 grid grid-cols-2 gap-2">
        <div v-for="stat in userStats" :key="stat.label" 
          class="bg-[#111726]/80 border border-slate-800/50 rounded-[22px] p-4 flex flex-col justify-start min-h-[100px] md:min-h-[150px] relative overflow-hidden group shadow-xl">
          
          <p class="text-slate-500 text-[7px] tracking-[1.5px] opacity-70 uppercase leading-none mb-3">{{ stat.label }}</p>
          
          <div class="relative z-10">
            <p class="font-black italic tracking-tighter leading-none flex items-baseline" :class="stat.color">
              <template v-if="stat.key === 'rank'">
                <span class="text-lg md:text-xl uppercase">{{ stat.value }}</span>
              </template>
              <template v-else>
                <span class="text-2xl md:text-4xl">
                  <template v-if="stat.key === 'balance'">{{ userBalance.toLocaleString() }}</template>
                  <template v-else-if="stat.key === 'withdrawn'">{{ (totalWithdrawn || 0).toLocaleString() }}</template>
                  <template v-else>{{ stat.value }}</template>
                </span>
                <span class="text-[10px] ml-1 uppercase not-italic font-sans opacity-80">đ</span>
              </template>
            </p>
          </div>

          <div class="absolute -right-1 -bottom-1 text-3xl opacity-[0.03] select-none">{{ stat.icon }}</div>
        </div>
      </div>
    </div>

    <!-- DANH SÁCH CÔNG VIỆC NỔI BẬT -->
    <section class="space-y-2">
      <div class="flex items-center gap-2 px-1">
        <div class="w-1 h-4 bg-emerald-500 rounded-full"></div>
        <h3 class="text-sm md:text-3xl text-white tracking-tighter italic font-black uppercase">CÔNG VIỆC <span class="text-emerald-500">NỔI BẬT</span></h3>
      </div>
      
      <div class="bg-[#111726]/40 border border-slate-800/50 rounded-[25px] p-1.5 md:p-8 shadow-inner">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-4">
          <div v-for="(j, index) in jobsData" :key="j.id" @click="emit('receiveJob', j.id)" 
            class="relative pt-4 px-4 pb-4 md:pt-6 md:px-7 md:pb-7 rounded-[22px] border transition-all duration-300 flex flex-col min-h-0 group cursor-pointer active:scale-95 shadow-xl"
            :class="[
              j.id === 'google-map' 
              ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/30' 
              : 'bg-[#0d121f] border-slate-800 hover:border-blue-500/40'
            ]"
          >
            
            <div class="absolute -top-1.5 -right-1.5 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] px-2 py-1 rounded-bl-xl rounded-tr-lg font-black italic animate-pulse shadow-lg shadow-red-900/60">
              HOT 🔥
            </div>

            <div class="flex justify-between items-start mb-3">
              <!-- ICON GOOGLE MAP CŨNG ĐƯỢC LÀM NỔI BẬT -->
              <div v-if="j.type === 'svg'" 
                   class="w-10 h-10 md:w-14 md:h-14 rounded-[15px] border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform" 
                   :class="[j.id === 'google-map' ? 'bg-blue-500/20 border-blue-400 shadow-blue-500/50' : 'bg-[#111726] border-slate-800', j.color]" 
                   v-html="j.iconContent">
              </div>

              <div v-else-if="j.type === 'text'" 
                   :class="['w-10 h-10 md:w-14 md:h-14 rounded-[15px] bg-[#111726] flex items-center justify-center shadow-lg border group-hover:scale-110 transition-transform', j.borderClass]">
                <span :class="['font-black text-[10px] md:text-sm italic uppercase', j.colorClass]">
                  {{ j.shortName }}
                </span>
              </div>

              <!-- SỐ THỨ TỰ CHO GOOGLE MAP -->
              <span class="text-2xl md:text-5xl font-black leading-none select-none transition-colors"
                :class="j.id === 'google-map' ? 'text-blue-500/20' : 'text-slate-800/10'"
              >
                {{ (index + 1).toString().padStart(2, '0') }}
              </span>
            </div>
            
            <h4 class="text-[10px] md:text-base text-white leading-tight font-black italic uppercase line-clamp-1 mt-1">{{ j.n }}</h4>
            <p class="text-yellow-400 text-[10px] md:text-[12px] opacity-80 leading-tight normal-case italic line-clamp-1 mt-1">{{ j.d }}</p>
            <p class="text-emerald-400 font-black text-[16px] md:text-2xl tracking-tighter leading-none mt-2">{{ j.p }}</p>
            
            <!-- NÚT RIÊNG CHO GOOGLE MAP -->
            <button 
              class="w-full mt-4 py-2 md:py-3.5 rounded-xl text-[8px] md:text-[10px] border font-black uppercase transition-all shadow-md"
              :class="[
                j.id === 'google-map' 
                ? 'bg-blue-600 text-white border-white/20 shadow-blue-900/40' 
                : 'bg-[#1a2333] group-hover:bg-blue-600 text-white border-white/5 group-hover:shadow-blue-900/40'
              ]"
            >
              NHẬN VIỆC
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.normal-case { text-transform: none; }
</style>