<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

const router = useRouter()
const isLoggedIn = ref(false)
const userUid = ref('')
const isLoading = ref(false)

// BIẾN DANH SÁCH CÔNG VIỆC THÀNH DẠNG OBJECT ĐỂ CHỨA SỐ TIỀN THỰC
const jobOptions = [
  { id: 'ck', name: 'Đăng ký APP Chứng khoán (200k)', reward: 200000 },
  { id: 'gg', name: 'Đánh giá Google Map (15k)', reward: 15000 },
  { id: 'nh', name: 'Mở APP Ngân Hàng (100k)', reward: 100000 }
]

// Form data
const selectedJob = ref(jobOptions[0]) // Mặc định chọn job đầu tiên
const phoneNumber = ref('')
const images = ref<string[]>([]) 
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      userUid.value = user.uid
    } else {
      alert('⚠️ BẠN CẦN ĐĂNG NHẬP ĐỂ NỘP BẰNG CHỨNG!')
      router.push('/login')
    }
  })
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

// THUẬT TOÁN ÉP XUNG NÉN ẢNH
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 600
        const scaleSize = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scaleSize

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6)
        resolve(compressedBase64)
      }
    }
  })
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const files = Array.from(target.files)
  
  if (images.value.length + files.length > 5) {
    alert('⚠️ CHỈ ĐƯỢC UPLOAD TỐI ĐA 5 ẢNH CHO MỖI ĐƠN!')
    return
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert('⚠️ CHỈ CHẤP NHẬN FILE HÌNH ẢNH!')
      continue
    }
    const compressedImage = await compressImage(file)
    images.value.push(compressedImage)
  }
  
  target.value = ''
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const submitReport = async () => {
  if (!selectedJob.value || !phoneNumber.value || images.value.length === 0) {
    alert('⚠️ VUI LÒNG NHẬP ĐỦ SĐT VÀ TẢI LÊN ÍT NHẤT 1 ẢNH!')
    return
  }

  isLoading.value = true
  try {
    // ĐÃ SỬA CHỖ NÀY: Bơm thêm `reward` vào để db đọc được số tiền
    await addDoc(collection(db, "reports"), {
      uid: userUid.value,
      jobName: selectedJob.value.name,
      reward: selectedJob.value.reward, // QUAN TRỌNG: LƯU SỐ TIỀN VÀO ĐÂY
      phoneRef: phoneNumber.value,
      images: images.value,
      status: 'pending',
      createdAt: serverTimestamp()
    })

    alert('✅ NỘP BẰNG CHỨNG THÀNH CÔNG! ĐANG CHỜ ADMIN DUYỆT.')
    router.push('/')
  } catch (error: any) {
    alert('❌ LỖI HỆ THỐNG: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#090e17] py-10 px-4 md:px-0 flex flex-col items-center font-sans font-black italic uppercase selection:bg-blue-500/30">
    
    <div class="w-full max-w-xl relative">
      <button @click="router.back()" class="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] tracking-[3px] font-black italic uppercase transition-colors mb-8">
        <span class="text-base leading-none font-sans font-light not-italic tracking-normal">✕</span> TRỞ LẠI
      </button>

      <h1 class="text-4xl md:text-5xl text-white font-black italic uppercase tracking-tighter leading-none mb-10 shadow-black drop-shadow-lg">
        NỘP <span class="text-[#3b82f6]">BẰNG CHỨNG</span>
      </h1>

      <div class="space-y-6">
        
        <!-- CHỌN CÔNG VIỆC -->
        <div class="space-y-3 text-left">
          <label class="text-[#3b82f6] text-[11px] tracking-[2px] font-black italic uppercase ml-1">CÔNG VIỆC HOÀN THÀNH</label>
          <div class="relative">
            <!-- Đổi cách lấy value bằng Object -->
            <select v-model="selectedJob" class="w-full bg-[#0d121f] border border-slate-800 focus:border-[#2563eb] rounded-[20px] py-6 px-6 text-white outline-none transition-all font-black italic appearance-none cursor-pointer shadow-inner text-base md:text-lg">
              <option v-for="job in jobOptions" :key="job.id" :value="job">{{ job.name }}</option>
            </select>
            <span class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm font-sans font-bold not-italic">⌄</span>
          </div>
        </div>

        <!-- NHẬP SĐT -->
        <div class="space-y-3 text-left">
          <label class="text-[#3b82f6] text-[11px] tracking-[2px] font-black italic uppercase ml-1">SĐT ĐỐI SOÁT</label>
          <input 
            v-model="phoneNumber" 
            type="text" 
            placeholder="Số điện thoại nộp đơn..." 
            class="w-full bg-[#0d121f] border border-slate-800 focus:border-[#2563eb] rounded-[20px] py-6 px-6 text-white outline-none transition-all font-black italic placeholder:text-slate-600 placeholder:normal-case shadow-inner text-lg md:text-xl"
          />
        </div>

        <!-- UPLOAD HÌNH ẢNH -->
        <div class="space-y-3 text-left mt-4">
          <label class="text-[#3b82f6] text-[11px] tracking-[2px] font-black italic uppercase ml-1">HÌNH ẢNH XÁC THỰC</label>
          
          <div 
            @click="triggerFileInput"
            class="w-full border-[2px] border-dashed border-slate-700/60 hover:border-[#3b82f6]/50 bg-[#0d121f]/30 rounded-[30px] py-14 px-6 flex flex-col items-center justify-center cursor-pointer transition-all group shadow-inner"
          >
            <div class="text-5xl group-hover:scale-110 transition-transform mb-4 drop-shadow-md">📸</div>
            <p class="text-slate-500 text-[11px] md:text-[12px] tracking-[2px] font-black italic uppercase opacity-80 group-hover:text-white transition-colors">TẢI LÊN ẢNH CHỤP MÀN HÌNH</p>
            <p class="text-slate-600 text-[10px] font-black italic lowercase normal-case mt-2 opacity-50 tracking-wider">(Cho phép chọn nhiều ảnh)</p>
          </div>
          
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            multiple 
            accept="image/*" 
            class="hidden" 
          />

          <!-- Lưới hiển thị các ảnh -->
          <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div v-for="(img, index) in images" :key="index" class="relative group rounded-[20px] overflow-hidden border border-slate-800 shadow-lg bg-[#0d121f] aspect-[16/10]">
              <img :src="img" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <button @click.stop="removeImage(index)" class="absolute top-2 right-2 w-7 h-7 bg-[#ef4444] hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-sans not-italic hover:scale-110 transition-transform shadow-lg z-10">✕</button>
            </div>
          </div>
        </div>

        <!-- NÚT GỬI -->
        <button 
          @click="submitReport" 
          :disabled="isLoading" 
          class="w-full mt-10 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-6 rounded-[20px] text-2xl font-black italic uppercase shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-50 tracking-tighter"
        >
          {{ isLoading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN GỬI ĐƠN' }}
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>
.normal-case { text-transform: none; }
</style>