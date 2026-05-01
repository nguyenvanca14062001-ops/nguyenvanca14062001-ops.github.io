<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

const router = useRouter()
const fullName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

const handleRegister = async () => {
  if (!fullName.value || !email.value || !username.value || !password.value) {
    alert('⚠️ VUI LÒNG ĐIỀN ĐỦ THÔNG TIN!')
    return
  }

  loading.value = true
  try {
    // 1. TẠO USER BÊN AUTHENTICATION TRƯỚC
    // Khi lệnh này thành công, Firebase sẽ tự động đăng nhập cho User đó, 
    // giúp chúng ta có quyền (auth.uid) để ghi dữ liệu vào Firestore bên dưới.
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email.value.trim(), 
      password.value
    )
    
    const user = userCredential.user

    // 2. GHI DỮ LIỆU VÀO FIRESTORE
    // Lúc này request.auth đã tồn tại nên Rules sẽ cho phép ghi (write)
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      fullName: fullName.value,
      username: username.value.toLowerCase().trim(),
      email: email.value.toLowerCase().trim(),
      balance: 0,
      createdAt: new Date().toISOString()
    })

    alert('✅ ĐĂNG KÝ THÀNH CÔNG!')
    router.push('/') // Chuyển về trang chủ
  } catch (error: any) {
    // Xử lý các lỗi phổ biến từ Firebase
    let msg = error.message
    if (error.code === 'auth/email-already-in-use') msg = 'Email này đã được đăng ký!'
    if (error.code === 'auth/weak-password') msg = 'Mật khẩu phải từ 6 ký tự trở lên!'
    
    alert('❌ LỖI: ' + msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex font-sans overflow-hidden text-left font-black italic uppercase">
    <!-- BÊN TRÁI: LOGO & BANNER -->
    <div class="hidden lg:flex lg:w-1/2 bg-[#f8fafc] flex-col items-center justify-center p-12 relative overflow-hidden text-left">
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div class="absolute top-12 left-12 flex flex-col items-start">
        <div class="bg-blue-600 text-white font-black px-3 py-1 rounded-md italic text-[10px] mb-3 uppercase tracking-widest">HỆ THỐNG KIẾM TIỀN</div>
        <h1 class="text-5xl font-black text-slate-800 tracking-tighter uppercase italic leading-[0.9]">
          KIẾM TIỀN ONLINE <br/>
          <span class="text-blue-600 font-black">MMO PRO</span>
        </h1>
        <p class="text-slate-400 font-black text-[10px] tracking-[5px] mt-4 border-l-4 border-blue-600 pl-4 uppercase opacity-50">
          Nền tảng kiếm tiền uy tín số 1 Việt Nam
        </p>
      </div>
      <img src="https://cdni.iconscout.com/illustration/premium/thumb/business-partnership-illustration-download-in-svg-png-gif-file-formats--meeting-shaking-hands-collaboration-agreement-pack-office-work-illustrations-4712534.png" class="max-w-md relative z-10 animate-float drop-shadow-2xl">
    </div>

    <!-- BÊN PHẢI: FORM ĐĂNG KÝ -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto font-black">
      <div class="w-full max-w-md space-y-8 font-black italic uppercase">
        <div class="text-left font-black">
          <h2 class="text-3xl font-black text-slate-800 uppercase italic leading-none">TẠO TÀI KHOẢN MỚI</h2>
          <p class="text-slate-400 text-[10px] mt-3 font-black italic uppercase tracking-widest opacity-70">Bắt đầu hành trình của bạn chỉ trong vài giây.</p>
        </div>

        <div class="space-y-4 font-black italic uppercase">
          <div class="space-y-1 font-black">
            <label class="text-[11px] font-black text-slate-400 uppercase italic ml-1">Họ tên</label>
            <input v-model="fullName" type="text" placeholder="HỌ VÀ TÊN..." class="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-slate-700 outline-none focus:border-blue-500 font-black italic text-xs shadow-inner uppercase" />
          </div>

          <div class="space-y-1 font-black">
            <label class="text-[11px] font-black text-slate-400 uppercase italic ml-1">Địa chỉ Email</label>
            <input v-model="email" type="email" placeholder="NAME@EXAMPLE.COM..." class="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-slate-700 outline-none focus:border-blue-500 font-black italic text-xs shadow-inner uppercase" />
          </div>

          <div class="space-y-1 font-black">
            <label class="text-[11px] font-black text-slate-400 uppercase italic ml-1">Tên đăng nhập</label>
            <input v-model="username" type="text" placeholder="USERNAME..." class="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-slate-700 outline-none focus:border-blue-500 font-black italic text-xs shadow-inner uppercase" />
          </div>

          <div class="space-y-1 font-black">
            <label class="text-[11px] font-black text-slate-400 uppercase italic ml-1">Mật khẩu</label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 px-6 text-slate-700 outline-none focus:border-blue-500 font-black text-xs shadow-inner" />
              <button @click="showPassword = !showPassword" class="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-blue-600 font-black italic uppercase">HIỆN</button>
            </div>
          </div>

          <button @click="handleRegister" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-[20px] text-white font-black uppercase italic shadow-lg transition-all active:scale-95 disabled:opacity-50 text-base mt-4 font-black">
            {{ loading ? 'ĐANG TẠO TÀI KHOẢN...' : 'ĐĂNG KÝ TÀI KHOẢN' }} ➔
          </button>
        </div>

        <div class="text-center font-black">
          <p class="text-[10px] font-black text-slate-400 uppercase italic">
            Đã có tài khoản? 
            <span @click="router.push('/login')" class="text-blue-600 cursor-pointer hover:underline ml-2 font-black italic uppercase">ĐĂNG NHẬP NGAY</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
.animate-float { animation: float 6s ease-in-out infinite; }
/* Ẩn scrollbar */
::-webkit-scrollbar { width: 0px; }
</style>