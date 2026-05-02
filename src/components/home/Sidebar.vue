<script setup lang="ts">
/**
 * SIDEBAR COMPONENT - MMO PRO
 * Đã cập nhật: Thêm nút Hồ Sơ Cá Nhân (Profile)
 */

// 1. Nhận dữ liệu từ App.vue truyền xuống
defineProps<{ 
 isLoggedIn: boolean; 
 isMenuOpen: boolean; 
 username: string; 
 userBalance: number 
}>();

// 2. Khai báo các tín hiệu gửi về cho App.vue xử lý
const emit = defineEmits([
 'toggleMenu', 
 'logout', 
 'routerPush', 
 'requireAuth', 
 'scrollToHistory', 
 'contactSupport'
]);

// Hàm xử lý cuộn xuống lịch sử
const handleHistoryClick = () => {
 emit('scrollToHistory');
}

// Hàm điều hướng chung
const navigateTo = (path: string, authRequired = false) => {
 if (authRequired) {
   emit('requireAuth', path);
 } else {
   emit('routerPush', path);
 }
}
</script>

<template>
 <!-- Overlay mờ khi mở menu trên điện thoại -->
 <div v-if="isMenuOpen" @click="emit('toggleMenu')" class="fixed inset-0 bg-black/80 z-[110] lg:hidden backdrop-blur-sm"></div>

 <aside :class="[
   'fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-[#111726] border-r border-slate-800/50 flex flex-col transition-transform duration-300 z-[120] shadow-2xl lg:shadow-none overflow-y-auto selection:bg-blue-500/30 font-black italic text-left uppercase',
   isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
 ]">
   
   <!-- PHẦN 1: LOGO -->
   <div class="py-8 px-4 flex flex-col items-center justify-center border-b border-slate-800/50 shrink-0">
     <div @click="navigateTo('/')" class="text-center cursor-pointer hover:scale-105 transition-transform">
       <h1 class="text-white text-3xl font-black tracking-tighter drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
         MMO <span class="text-blue-500">PRO</span>
       </h1>
       <p class="text-[9px] text-slate-500 tracking-[4px] mt-1 font-bold">SYSTEM HUB</p>
     </div>
   </div>

   <!-- PHẦN 2: DANH SÁCH MENU ĐIỀU HƯỚNG -->
   <div class="flex-1 p-5 space-y-1 overflow-y-auto">
     <p class="text-slate-500 text-[10px] tracking-[3px] px-4 mb-3 mt-2 opacity-60">TRANG CHÍNH</p>

     <button @click="navigateTo('/')" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] bg-[#1a233a] border border-blue-500/30 text-blue-500 text-sm font-bold shadow-inner mb-1">
       <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect></svg>
       Trang Chủ
     </button>

     <!-- NÚT HỒ SƠ CÁ NHÂN MỚI -->
     <button @click="navigateTo('/profile', true)" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
       <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
       Hồ Sơ Cá Nhân
     </button>

     <button @click="navigateTo('/submit-report', true)" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
       <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><polyline points="9 15 11 17 15 13"></polyline></svg>
       Gửi Bằng Chứng
     </button>

     <button @click="handleHistoryClick" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
       <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline><polyline points="2 17 12 22 22 17"></polyline></svg>
       Lịch Sử Hoạt Động
     </button>

     <!-- MENU RÚT TIỀN -->
     <button @click="navigateTo('/withdraw', true)" class="w-full flex items-center gap-4 px-5 py-3.5 rounded-[16px] hover:bg-[#151b2b] text-slate-400 text-sm font-bold hover:text-white transition-all">
       <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
       Rút Tiền Về Ngân Hàng
     </button>

     <p class="text-slate-500 text-[10px] tracking-[3px] px-4 mb-4 mt-8 border-t border-slate-800/50 pt-6 opacity-60">CÔNG VIỆC</p>

     <!-- ĐÁNH GIÁ GOOGLE MAP ĐÃ LÊN ĐẦU -->
     <button @click="navigateTo('/job/google-map')" class="w-full flex items-center gap-4 px-4 py-2.5 rounded-[20px] hover:bg-[#151b2b] text-slate-300 text-sm font-bold transition-all group">
       <div class="w-10 h-10 rounded-[12px] bg-[#0d121f] border border-orange-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all shrink-0"><svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
       Đánh Giá Google Map
     </button>

     <!-- ĐĂNG KÝ APP CHỨNG KHOÁN -->
     <button @click="navigateTo('/job/app-chung-khoan')" class="w-full flex items-center gap-4 px-4 py-2.5 rounded-[20px] hover:bg-[#151b2b] text-slate-300 text-sm font-bold transition-all group">
       <div class="w-10 h-10 rounded-[12px] bg-[#0d121f] border border-blue-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all shrink-0"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
       Đăng Ký APP Chứng Khoán
     </button>

     <!-- ĐĂNG KÝ APP VPBANK -->
     <button @click="navigateTo('/job/vpbank')" class="w-full flex items-center gap-4 px-4 py-2.5 rounded-[20px] hover:bg-[#151b2b] text-slate-300 text-sm font-bold transition-all group">
       <div class="w-10 h-10 rounded-[12px] bg-[#0d121f] border border-emerald-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all shrink-0"><span class="text-emerald-500 font-black text-[10px]">VPB</span></div>
       Đăng Ký APP VPBank
     </button>

     <!-- ĐĂNG KÝ APP TPBANK -->
     <button @click="navigateTo('/job/tpbank')" class="w-full flex items-center gap-4 px-4 py-2.5 rounded-[20px] hover:bg-[#151b2b] text-slate-300 text-sm font-bold transition-all group">
       <div class="w-10 h-10 rounded-[12px] bg-[#0d121f] border border-purple-500/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all shrink-0"><span class="text-purple-500 font-black text-[10px]">TPB</span></div>
       Đăng Ký APP TPBank
     </button>
   </div>

   <!-- PHẦN 3: THÔNG TIN TÀI KHOẢN -->
   <div class="p-6 border-t border-slate-800/50 bg-[#0d121f]/50 shrink-0">
     <div v-if="isLoggedIn" class="space-y-4">
       <div class="flex flex-col px-1 cursor-pointer hover:opacity-80" @click="navigateTo('/profile', true)">
         <span class="text-slate-500 text-[8px] tracking-[2px] opacity-60">ID KHÁCH HÀNG:</span>
         <span class="text-white text-sm font-black truncate tracking-tighter">{{ username }}</span>
       </div>
       
       <div @click="navigateTo('/withdraw', true)" class="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex flex-col gap-1 shadow-inner relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
         <div class="absolute -right-2 -bottom-2 text-2xl opacity-5 group-hover:scale-110 transition-transform">💰</div>
         <span class="text-blue-400 text-[8px] tracking-[2px]">SỐ DƯ HIỆN TẠI:</span>
         <span class="text-emerald-400 text-2xl font-black italic tracking-tighter leading-none">
           {{ userBalance.toLocaleString() }}<span class="text-xs ml-1 not-italic">Đ</span>
         </span>
       </div>

       <button @click="emit('logout')" class="w-full py-2 text-slate-600 hover:text-red-400 text-[8px] font-black tracking-[2px] transition-colors border border-slate-800/50 rounded-xl">
         ĐĂNG XUẤT
       </button>
     </div>
     <div v-else class="text-center py-2 text-[9px] text-slate-600 opacity-40 tracking-widest">
       HỆ THỐNG MMO PRO
     </div>
   </div>
 </aside>
</template>

<style scoped>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
</style>