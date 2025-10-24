<template>
    <div v-if="idPending" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-gray-600 text-lg">讀取中...</p>
        </div>
    </div>
    <div v-if="showCheckUserIDisExist" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">📅</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">醫療預約</h1>
                <p class="text-gray-600 text-sm">請填寫您的預約資訊</p>
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
                        required
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
                <button
                    type="submit"
                    class="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isSending"
                >
                    <span v-if="isSending">⏳ 送出中...</span>
                    <span v-else>✓ 確認預約</span>
                </button>
            </form>
        </div>
    </div>
    
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
            </div>
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
                <p class="text-sm text-gray-600">如有任何問題，請直接聯繫診所</p>
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
import { ref,onMounted, watch, shallowReactive } from 'vue';
import axios from 'axios';

const user = defineProps(['userid'])
const res = ref(null)

// const user = {
//     userid: 'U14b5e7710fe33928351643793294dc3c'
// }

console.log("userID",user.userid);
const personID = ref('');

const showCheckUserIDisExist = ref(false);
const showCheckUserIDisNotExist = ref(false);
const checkUserVIPisExist = ref(false);
const idPending = ref(true);
const checkUserIDisExist = ref(false);
const addPersonID= ref(false);
const finishAddPersonID= ref(false);
const finishAddVIPPersonID= ref(false);
const isSending = ref(false);
const finishOrder = ref(false);
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
const showError = ref(false);

const addOrderFunc = () => {
    showError.value = false;
    // 必填欄位檢查
    if (!input.value.personName || !input.value.personPhone || !input.value.department || !input.value.orderDate) {
        showError.value = true;
        return;
    }

    if (addOrderTimer) {
        clearTimeout(addOrderTimer);
    }

    addOrderTimer = setTimeout(() => {
        const params = new URLSearchParams();
        params.append('method', 'addOrder');
        params.append('userid', user.userid);
        params.append('personName', input.value.personName);
        params.append('issue', input.value.issue);
        params.append('doctor', input.value.doctor);
        params.append('personPhone', input.value.personPhone);
        params.append('department', input.value.department);
        params.append('orderDate', input.value.orderDate);
        params.append('notes', input.value.notes || '');
        isSending.value = true;

        axios({
            method: 'post',
            url: 'https://fju-line-app.herokuapp.com/infolinebot/add_order',
            data: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }) 
        .then(response => {
            isSending.value = false;
            res.value = response.data;
            idPending.value = false;
            showCheckUserIDisExist.value = false;
            finishOrder.value = true;
        })
        .catch(error => {
            let msg = "預約失敗，請稍後再試或聯絡診所";
            if ( error.response.data) {
                msg = error.response.data.message;
            }
            alert(msg);
            console.log(error);
        });
    }, 2000);
}

const checkUserIDisExistFunc = () => {
    const formData = new FormData();
    formData.append('method', 'checkUserIDisExist');
    formData.append('userid', user.userid);   
    //formData.append('userid', 'U14b5e7710fe33928351643793294dc3c');     
    console.log(formData.get('userid'))
    axios({
        method: 'post',
        url: 'https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec',
        data: formData,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
    .then(response => {
        console.log(response);
        if(response.data.result === "useridisexist"){
            personID.value = response.data.personid;
            res.value = response.data;
            showCheckUserIDisExist.value = true;
        }else{
            showCheckUserIDisExist.value = false;
            showCheckUserIDisNotExist.value = true;
            
            res.value = response.data;
        }

        idPending.value = false;
        // Handle the response here
    })
    .catch(error => {
        console.log(error);
        res.value = error.data;
        // Handle the error here
    });
}

const closePop=()=>{
    $emit('close-window');
}
// onMounted(() => {
//     checkUserIDisExistFunc();
// });
watch(user, (newValue, oldValue) => {
    console.log("user.userid",user.userid);
    checkUserIDisExistFunc();
});
</script>
