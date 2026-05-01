<script setup lang="ts">
const emit = defineEmits(['contactSupport']);
const faqs = [
  { id: '01', q: 'KHI NÀO TÔI NHẬN ĐƯỢC TIỀN?', a: 'TIỀN THƯỞNG SẼ CỘNG VÀO VÍ TRONG VÒNG 1 GIỜ NGAY SAU KHI NỘP ẢNH BẰNG CHỨNG HỢP LỆ.' },
  { id: '02', q: 'RÚT TIỀN TỐI THIỂU LÀ BAO NHIÊU?', a: 'HẠN MỨC RÚT TỐI THIỂU TỪ 50.000Đ VỀ MỌI NGÂN HÀNG VIỆT NAM 24/7.' },
  { id: '03', q: 'LÀM NHIỀU VIỆC CÙNG LÚC ĐƯỢC KHÔNG?', a: 'HOÀN TOÀN ĐƯỢC! BẠN CÓ THỂ THỰC HIỆN TẤT CẢ NHIỆM VỤ HIỂN THỊ ĐỂ GIA TĂNG THU NHẬP.' },
  { id: '04', q: 'TẠI SAO BẰNG CHỨNG BỊ TỪ CHỐI?', a: 'VUI LÒNG ĐẢM BẢO ẢNH CHỤP MÀN HÌNH RÕ NÉT, KHÔNG CẮT GHÉP VÀ LÀM ĐÚNG YÊU CẦU.' }
];
</script>

<template>
  <!-- FAQ -->
  <section class="space-y-10 font-black italic uppercase">
    <div class="flex items-center gap-4">
      <div class="w-2.5 h-10 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
      <h3 class="text-3xl md:text-5xl text-white tracking-tighter uppercase italic leading-none font-black">GIẢI ĐÁP <span class="text-blue-500">THẮC MẮC</span></h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="f in faqs" :key="f.id" class="bg-[#111726]/40 p-10 rounded-[40px] border border-slate-800/50 hover:bg-[#111726]/60 transition-all group">
        <p class="text-blue-500 text-xs font-black italic uppercase tracking-widest mb-4">#{{ f.id }}. {{ f.q }}</p>
        <p class="text-slate-500 text-sm italic font-black uppercase leading-relaxed group-hover:text-slate-300 transition-colors opacity-70">{{ f.a }}</p>
      </div>
    </div>
  </section>

  <!-- FOOTER LIÊN HỆ & COPYRIGHT -->
  <footer class="mt-24 pt-20 border-t border-slate-800/50 pb-16 font-black italic uppercase">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
      <div class="space-y-8 text-left">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic">M</div>
          <p class="text-3xl text-white tracking-tighter leading-none font-black italic">MMO PRO SYSTEM</p>
        </div>
        <p class="text-slate-500 text-base italic opacity-80 font-black">Hệ thống MMO uy tín số 1 Việt Nam.</p>
      </div>
      <div class="space-y-8 text-left">
        <p class="text-white text-xl uppercase tracking-widest border-b-2 border-blue-600/30 pb-3 w-fit font-black italic">LIÊN HỆ</p>
        <button @click="emit('contactSupport', 'zalo')" class="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl text-sm transition-all shadow-lg active:scale-95 font-black uppercase italic">KẾT NỐI ADMIN</button>
      </div>
    </div>
    <div class="mt-20 text-center text-slate-700 text-[10px] tracking-[5px] font-black italic opacity-30">
      COPYRIGHT © 2026 MMO PRO SYSTEM. ALL RIGHTS RESERVED.
    </div>
  </footer>
</template>