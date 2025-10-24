<template>
    <!-- Loading State -->
    <div v-if="idPending" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-gray-600 text-lg">讀取中...</p>
        </div>
    </div>

    <!-- Booking Type Selection -->
    <div v-if="showBookingTypeSelection" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">📅</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">醫療預約</h1>
                <p class="text-gray-600 text-sm">請選擇預約類型</p>
            </div>
            <div class="space-y-4">
                <button
                    @click="selectBookingType('self')"
                    class="w-full bg-blue-500 text-white px-6 py-4 rounded-md hover:bg-blue-600 transition font-medium shadow-sm text-lg"
                >
                    👤 個人預約
                </button>
                <button
                    @click="selectBookingType('family')"
                    class="w-full bg-gray-300 text-gray-500 px-6 py-4 rounded-md cursor-not-allowed transition font-medium shadow-sm text-lg opacity-60"
                    title="此功能尚未開放"
                >
                    👨‍👩‍👧‍👦 家屬預約 (尚未開放)
                </button>
            </div>
        </div>
    </div>

    <!-- Family Member Selection -->
    <div v-if="showFamilySelection" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">選擇家屬</h1>
                <p class="text-gray-600 text-sm">請選擇要預約的家屬</p>
            </div>
            <form class="space-y-5" @submit.prevent="confirmFamilySelection">
                <div>
                    <label for="family" class="block font-bold text-gray-700 mb-2">
                        家屬姓名 <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="family"
                        v-model="selectedFamily"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        required
                    >
                        <option value="" disabled>請選擇家屬</option>
                        <option v-for="member in familyMembers" :key="member.id" :value="member">
                            {{ member.name }}
                        </option>
                    </select>
                </div>
                <div class="flex space-x-3">
                    <button
                        type="button"
                        @click="backToTypeSelection"
                        class="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition font-medium shadow-sm"
                    >
                        ← 返回
                    </button>
                    <button
                        type="submit"
                        class="flex-1 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
                    >
                        下一步 →
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Appointment Form -->
    <div v-if="showCheckUserIDisExist" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">📅</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">醫療預約</h1>
                <p class="text-gray-600 text-sm">請填寫預約資訊</p>
                <div class="mt-2 text-sm text-blue-600">
                    {{ bookingType === 'self' ? '👤 個人預約' : '👨‍👩‍👧‍👦 家屬預約' }}
                </div>
            </div>
            <form class="space-y-5" @submit.prevent="addOrderFunc()">
                <div>
                    <label for="name" class="block font-bold text-gray-700 mb-2">
                        姓名 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        v-model="input.personName"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        :class="{ 'bg-gray-100': bookingType === 'self' }"
                        placeholder="請輸入姓名"
                        required
                    />
                    <p v-if="showError && !input.personName" class="text-red-500 text-xs mt-1">請輸入姓名</p>
                </div>
                <div>
                    <label for="phone" class="block font-bold text-gray-700 mb-2">
                        聯絡電話 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="phone"
                        v-model="input.personPhone"
                        pattern="[0-9]+"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        :class="{ 'bg-gray-100': bookingType === 'self' }"
                        placeholder="請輸入電話號碼"
                        required
                    />
                    <p v-if="showError && !input.personPhone" class="text-red-500 text-xs mt-1">請輸入電話號碼</p>
                </div>
                <div>
                    <label for="department" class="block font-bold text-gray-700 mb-2">
                        科別 <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="department"
                        v-model="input.department"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        required
                    >
                        <option value="" disabled>請選擇科別</option>
                        <option v-for="department in department_data" :value="department" :key="department">{{ department }}</option>
                    </select>
                    <p v-if="showError && !input.department" class="text-red-500 text-xs mt-1">請選擇科別</p>
                </div>
                <div>
                    <label for="date" class="block font-bold text-gray-700 mb-2">
                        就診日 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        v-model="input.orderDate"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        required
                    />
                    <p v-if="showError && !input.orderDate" class="text-red-500 text-xs mt-1">請選擇就診日</p>
                </div>
                <div>
                    <label for="doctor" class="block font-bold text-gray-700 mb-2">約診醫生</label>
                    <input
                        type="text"
                        id="doctor"
                        v-model="input.doctor"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        placeholder="選填"
                    />
                </div>
                <div>
                    <label for="issue" class="block font-bold text-gray-700 mb-2">看診問題/備註事項</label>
                    <textarea
                        id="issue"
                        v-model="input.issue"
                        rows="3"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-none"
                        placeholder="請描述您的看診問題或備註"
                    ></textarea>
                </div>
                <div>
                    <label for="notes" class="block font-bold text-gray-700 mb-2">其他備註</label>
                    <textarea
                        id="notes"
                        v-model="input.notes"
                        rows="3"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-none"
                        placeholder="您方便約診的時間或其他資訊"
                    ></textarea>
                </div>
                <div class="flex space-x-3">
                    <button
                        type="button"
                        @click="backToTypeSelection"
                        class="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-400 transition font-medium shadow-sm"
                    >
                        ← 返回
                    </button>
                    <button
                        type="submit"
                        class="flex-1 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="isSending"
                    >
                        <span v-if="isSending">⏳ 送出中...</span>
                        <span v-else>✓ 確認預約</span>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- User Not Registered -->
    <div v-if="showCheckUserIDisNotExist" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-6xl mb-4">🔒</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">尚未設定裝置</h1>
                <p class="text-gray-600 text-sm">您需要先完成裝置設定才能使用預約功能</p>
            </div>
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-left">
                <p class="text-sm text-gray-700">⚠️ 請先綁定您的身分證號碼</p>
                <p class="text-sm text-gray-700 mt-1">完成設定後即可進行預約</p>
            </div>
            <button
                @click="$router.push('/')"
                class="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
            >
                前往設定
            </button>
        </div>
    </div>

    <!-- Success State -->
    <div v-if="finishOrder" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-6xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-green-600 mb-2">預約成功！</h2>
                <p class="text-gray-700">您的預約已送出</p>
            </div>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
                <p class="text-sm text-gray-700">✓ 我們已收到您的預約申請</p>
                <p class="text-sm text-gray-700 mt-2">診所將盡快與您聯繫確認預約時間</p>
                <div class="mt-3 pt-3 border-t border-green-200">
                    <p class="text-sm font-bold text-gray-800">預約資訊：</p>
                    <p class="text-sm text-gray-700">姓名：{{ input.personName }}</p>
                    <p class="text-sm text-gray-700">電話：{{ input.personPhone }}</p>
                    <p class="text-sm text-gray-700">科別：{{ input.department }}</p>
                    <p class="text-sm text-gray-700">就診日：{{ input.orderDate }}</p>
                </div>
            </div>
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
                <p class="text-sm text-gray-600">如有任何問題，請直接聯繫診所</p>
                <p class="text-xs text-gray-500 mt-2">（測試模式 - 未實際送出）</p>
            </div>
            <button
                @click="$emit('close-window')"
                class="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
            >
                關閉視窗
            </button>
        </div>
    </div>

</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const user = defineProps(['userid'])
const res = ref(null)

console.log("userID", user.userid);

// State Management
const idPending = ref(true);
const showBookingTypeSelection = ref(false);
const showFamilySelection = ref(false);
const showCheckUserIDisExist = ref(false);
const showCheckUserIDisNotExist = ref(false);
const finishOrder = ref(false);
const isSending = ref(false);
const showError = ref(false);

// Booking Type: 'self' or 'family'
const bookingType = ref(null);
const selectedFamily = ref('');
const personID = ref('');

// User and family data from API
const userData = ref({
    personid: '',
    personname: '',
    personphone: '',
    family_members: []
});

// Department Data
const department_data = [
    "ANES/麻醉疼痛科",
    "BS/乳房外科",
    "CM/胸腔內科",
    "CVS/心臟血管外科",
    "CRS/直腸外科",
    "CS/胸腔外科",
    "DERM/皮膚科",
    "CV/心臟內科",
    "Diet/營養諮詢",
    "ENT/耳鼻喉科",
    "FM/家庭醫學科",
    "GI/胃腸肝膽科",
    "GS/一般外科",
    "GU/泌尿外科",
    "OBGY/婦產科",
    "HEMA/血液腫瘤科",
    "NS/神經外科",
    "INF/感染科",
    "META/新陳代謝科",
    "NEPH/腎臟內科",
    "NEUR/神經內科",
    "OPH/眼科",
    "ORTH/骨科",
    "PED/小兒科",
    "PS/整形外科",
    "PSY/精神科",
    "REHA/復健科",
    "IMRH/風濕免疫科",
    "CADP/腹膜透析",
    "心理諮商",
    "PEDS/小兒外科"
];

// Form Input
const input = ref({
    method: 'addOrder',
    personName: '',
    personPhone: '',
    issue: '',
    doctor: '',
    department: '',
    orderDate: '',
    notes: ''
})

let addOrderTimer = null;

// Functions
const selectBookingType = (type) => {
    bookingType.value = type;
    showBookingTypeSelection.value = false;

    if (type === 'self') {
        // 個人預約：帶入本人資料
        input.value.personName = userData.value.personname;
        input.value.personPhone = userData.value.personphone;
        showCheckUserIDisExist.value = true;
    } else if (type === 'family') {
        // 家屬預約：顯示家屬選單
        showFamilySelection.value = true;
    }
};

const confirmFamilySelection = () => {
    if (selectedFamily.value) {
        input.value.personName = selectedFamily.value.name;
        input.value.personPhone = selectedFamily.value.phone;
        showFamilySelection.value = false;
        showCheckUserIDisExist.value = true;
    }
};

const backToTypeSelection = () => {
    // Reset states
    showCheckUserIDisExist.value = false;
    showFamilySelection.value = false;
    showBookingTypeSelection.value = true;
    bookingType.value = null;
    selectedFamily.value = '';
    input.value.personName = '';
    input.value.personPhone = '';
    input.value.department = '';
    input.value.orderDate = '';
    input.value.doctor = '';
    input.value.issue = '';
    input.value.notes = '';
    showError.value = false;
};

const addOrderFunc = () => {
    showError.value = false;

    // Validate required fields
    if (!input.value.personName || !input.value.personPhone || !input.value.department || !input.value.orderDate) {
        showError.value = true;
        return;
    }

    if (addOrderTimer) {
        clearTimeout(addOrderTimer);
    }

    // Mock API call with setTimeout (測試模式)
    addOrderTimer = setTimeout(() => {
        isSending.value = true;

        // Simulate API delay
        setTimeout(() => {
            isSending.value = false;
            showCheckUserIDisExist.value = false;
            finishOrder.value = true;
        }, 1500);
    }, 2000);
};

const checkUserIDisExistFunc = () => {
    const params = new URLSearchParams();
    params.append('userid', user.userid);

    axios({
        method: 'post',
        url: 'https://fju-line-app.herokuapp.com/infolinebot/order_get_user_registered',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(response => {
        console.log(response);
        const data = response.data;

        if(data.status === "success" && data.result === "success"){
            // 使用者已註冊且有基本資料
            userData.value = {
                personid: data.personid,
                personname: data.personname,
                personphone: data.personphone,
                family_members: data.family_members || []
            };
            personID.value = data.personid;
            res.value = data;
            showBookingTypeSelection.value = true;
            idPending.value = false;
        } else if(data.result === "useridnotexist"){
            // LINE ID 不存在，需要綁定
            showBookingTypeSelection.value = false;
            showCheckUserIDisNotExist.value = true;
            idPending.value = false;
            res.value = data;
        } else if(data.result === "personidnotexist"){
            // 基本資料不存在，需重新綁定
            idPending.value = false;
            alert(data.message || "請重新綁定或聯絡診所");
            showCheckUserIDisNotExist.value = true;
            res.value = data;
        } else if(data.status === "error"){
            // 錯誤回應
            idPending.value = false;
            alert("系統錯誤: " + (data.message || "請稍後再試"));
            res.value = data;
        }
    })
    .catch(error => {
        console.log(error);
        idPending.value = false;
        alert("連線錯誤，請檢查網路連線或稍後再試");
        res.value = error.response?.data || error;
    });
};

// Watch for userid changes
watch(user, (newValue, oldValue) => {
    console.log("user.userid", user.userid);
    checkUserIDisExistFunc();
});
</script>
