<script setup lang="ts">
// Nhận các thông tin từ component cha
defineProps<{ 
  isLoggedIn: boolean; 
  isMenuOpen: boolean; 
  username: string; 
  userBalance: number 
}>();

// Khai báo các sự kiện gửi ngược lại cho component cha
const emit = defineEmits(['toggleMenu', 'logout', 'routerPush', 'requireAuth', 'scrollToHistory', 'contactSupport']);

const handleHistoryClick = () => {
  emit('scrollToHistory');
}

/**
 * HÀM SỬA LỖI: TypeScript không cho dùng window.open trực tiếp trong template.
 * Tao đã tách nó ra thành hàm riêng để Build không bị lỗi đỏ.
 */
const openZaloGroup = () => {
  window.open('https://zalo.me/g/xxxxxx', '_blank');
}
</script>

<template>
  <!-- Overlay cho Mobile -->
  <div v-if="isMenuOpen" @click="emit('toggleMenu')" class="fixed inset-0 bg-black/80 z-[110] lg:hidden backdrop-blur-sm"></div>

  <aside :class="[
    'fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-[#111726] border-r border-slate-800/50 flex flex-col transition-transform duration-300 z-[120] shadow-2xl lg:shadow-none overflow-y-auto selection:bg-blue-500/30',
    isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  ]">
    
    <!-- PHẦN 1: LOGO AREA -->
    <div class="py-8 px-4 flex flex-col items-center justify-center border-b border-slate-800/50 shrink-0">
      <div @click="emit('routerPush', '/')" class="text-center cursor-pointer hover:scale-105 transition-transform">
        <h1 class="text-white text-3xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(37,99,235,0.4)] uppercase">
          MMO <span class="text-blue-500">PRO</span>
        </h1>
        <p class="text-[9px] text-slate-500 tracking-[4px] mt-1 font-bold uppercase">SYSTEM HUB</p>
      </div>
    </div>

    <!-- PHẦN 2: KHU VỰC TÀI KHOẢN -->
    <div class="p-5 border-b border-slate-800/50 bg-[#0d121f]/30">
      <div v-if="isLoggedIn" class="flex items-center gap-4 bg-[#1a233a] p-4 rounded-[20px] border border-blue-500/20 shadow-inner group hover:border-blue-500/40 transition-all">
        <div class="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0 group-hover:scale-105 transition-transform">
          {{ username.charAt(0).toUpperCase() }}
        </div>
        <div class="text-left overflow-hidden">
          <p class="text-white text-[11px] font-bold truncate leading-tight uppercase">{{ username }}</p>
          <p class="text-emerald-400 font-black tracking-tight text-xl leading-tight mt-0.5">{{ userBalance.toLocaleString() }}Đ</p>
          <button @click="emit('logout')" class="text-slate-500 hover:text-red-400 text-[8px] font-bold tracking-[2px] transition-colors mt-1 border-t border-slate-800/50 pt-1 w-full text-left uppercase">ĐĂNG XUẤT</button>
        </div>
      </div>

      <div v-else>
        <button @click="emit('routerPush', '/login')" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[22px] text-[11px] font-black uppercase transition-all shadow-[0_10px_25_rgba(37,99,235,0.4)] active:scale-95 flex items-center justify-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
          ĐĂNG NHẬP / ĐĂNG KÝ
        </button>
      </div>
    </div>

    <!-- PHẦN 3: MENU ITEMS -->
    <div class="flex-1 p-5 space-y-1 overflow-y-auto">
      <p class="text-slate-500 text-[10px] font-black tracking-[3px] px-4 mb-3 mt-2 uppercase opacity-60">TRANG CHÍNH</p>

      <button @click="emit('routerPush', '/')" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] bg-[#1a233a] border border-blue-500/30 text-blue-500 text-sm font-bold transition-all shadow-inner">
        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
        Trang Chủ
      </button>

      <button @click="emit('requireAuth', '/submit-report')" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <polyline points="9 15 11 17 15 13"></polyline>
        </svg>
        Gửi Bằng Chứng
      </button>

      <button @click="handleHistoryClick" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 12 12 17 22 12"></polyline>
          <polyline points="2 17 12 22 22 17"></polyline>
        </svg>
        Lịch Sử Hoạt Động
      </button>

      <button @click="emit('requireAuth', '/withdraw')" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
        <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
          <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
          <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
        </svg>
        Rút Tiền Về Ví
      </button>

      <p class="text-slate-500 text-[10px] font-black tracking-[3px] px-4 mb-4 mt-8 border-t border-slate-800/50 pt-6 uppercase opacity-60">CÔNG VIỆC NỔI BẬT</p>

      <button @click="emit('routerPush', '/job/app-chung-khoan')" class="w-full flex items-center gap-4 px-4 py-2.5 rounded-[20px] hover:bg-[#151b2b] text-slate-300 text-sm font-bold transition-all group">
        <div class="w-10 h-10 rounded-[12px] bg-[#0d121f] border border-blue-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-blue-500 transition-all shrink-0">
           <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        </div>
        <span class="text-left group-hover:text-blue-400 transition-colors">Đăng ký App Chứng Khoán</span>
      </button>

      <button @click="emit('routerPush', '/job/app-ngan-hang')" class="w-full flex items-center gap-4 px-4 py-2.5 rounded-[20px] hover:bg-[#151b2b] text-slate-300 text-sm font-bold transition-all group">
        <div class="w-10 h-10 rounded-[12px] bg-[#0d121f] border border-emerald-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-emerald-500 transition-all shrink-0">
           <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect x="2" y="20" width="20" height="2"/><rect x="4" y="10" width="2" height="10"/><rect x="10" y="10" width="2" height="10"/><rect x="16" y="10" width="2" height="10"/><polygon points="12 2 2 10 22 10 12 2"/></svg>
        </div>
        <span class="text-left group-hover:text-emerald-400 transition-colors">Đăng ký App Ngân Hàng</span>
      </button>
    </div>

    <!-- PHẦN 4: LIÊN HỆ HỖ TRỢ -->
    <div class="p-6 border-t border-slate-800/50 shrink-0">
      <p class="text-slate-500 text-[9px] font-black tracking-[3px] mb-4 text-center opacity-60 uppercase">LIÊN HỆ HỖ TRỢ</p>
      <div class="space-y-3">
        <button @click="emit('contactSupport', 'facebook')" class="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-3.5 rounded-[18px] text-[10px] font-black tracking-[1px] transition-all shadow-[0_5px_15px_rgba(24,119,242,0.3)] active:scale-95 uppercase">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.908 1.464 5.503 3.746 7.243V22l3.355-1.84c.895.248 1.841.383 2.822.383 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2z"/></svg>
          CHAT SUPPORT
        </button>

        <!-- SỬA TẠI ĐÂY: Dùng @click="openZaloGroup" thay cho window.open trực tiếp -->
        <button @click="openZaloGroup" class="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-[#0068ff] py-3.5 rounded-[18px] text-[10px] font-black tracking-[1px] transition-all shadow-lg active:scale-95 uppercase">
          <div class="w-4 h-4 bg-[#0068ff] rounded-full flex items-center justify-center">
            <span class="text-white text-[8px] font-sans font-black">Z</span>
          </div>
          THAM GIA NHÓM ZALO
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
</style>