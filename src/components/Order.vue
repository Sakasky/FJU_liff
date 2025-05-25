<template>
    <div v-if="idPending" class="flex items-center justify-center m-auto pt-10">
        讀取中
    </div>
    <div v-if="showCheckUserIDisExist" class="flex items-center justify-center flex-col p-10 text-center">
        <form class="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg w-full max-w-md" @submit.prevent="addOrderFunc()">
            <div class="mb-4 w-full text-left">
                <label for="name" class="block font-bold mb-1">姓名<span class="text-red-500">*</span></label>
                <input type="text" id="name" v-model="input.personName" class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" required />
                <p v-if="showError && !input.personName" class="text-red-500 text-xs mt-1">請輸入姓名</p>
            </div>
            <div class="mb-4 w-full text-left">
                <label for="phone" class="block font-bold mb-1">您的電話號碼<span class="text-red-500">*</span></label>
                <input class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" type="text" id="phone" v-model="input.personPhone" required pattern="[0-9]+" />
                <p v-if="showError && !input.personPhone" class="text-red-500 text-xs mt-1">請輸入電話號碼</p>
            </div>
            <div class="mb-4 w-full text-left">
                <label for="issue" class="block font-bold mb-1">看診問題/備註事項</label>
                <textarea class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" id="issue" v-model="input.issue"></textarea>
            </div>
            <div class="mb-4 w-full text-left">
                <label for="doctor" class="block font-bold mb-1">約診醫生</label>
                <input class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" type="text" id="doctor" v-model="input.doctor" />
            </div>
            <div class="mb-4 w-full text-left">
                <label for="department" class="block font-bold mb-1">科別<span class="text-red-500">*</span></label>
                <select class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" id="department" v-model="input.department" required>
                    <option value="" disabled>請選擇科別</option>
                    <option v-for="department in department_data" :value="department" :key="department">{{ department }}</option>
                </select>
                <p v-if="showError && !input.department" class="text-red-500 text-xs mt-1">請選擇科別</p>
            </div>
            <div class="mb-4 w-full text-left">
                <label for="date" class="block font-bold mb-1">就診日<span class="text-red-500">*</span></label>
                <input class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" type="date" id="date" v-model="input.orderDate" required />
                <p v-if="showError && !input.orderDate" class="text-red-500 text-xs mt-1">請選擇就診日</p>
            </div>
            <div class="mb-4 w-full text-left">
                <label for="notes" class="block font-bold mb-1">備註欄,或其他您方便約診的時間</label>
                <textarea class="border border-gray-300 rounded-md p-2 w-full focus:border-blue-500 focus:outline-none" id="notes" v-model="input.notes"></textarea>
            </div>
            <button type="submit" class="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" :disabled="isSending">
                <span v-if="isSending">送出中...</span>
                <span v-else>送出</span>
            </button>
        </form>
    </div>
    
    <div v-if="showCheckUserIDisNotExist" class="flex items-center justify-center flex-col p-10 text-center">
        <h1 class="text-2xl font-bold text-center">您尚未設定本裝置</h1>
        <button @click="$router.push('/')">前往設定</button>
    </div>

    <div v-if="finishOrder" class="flex items-center justify-center flex-col p-10 text-center">
        <p>已完成預約</p>
        <button @click="$emit('close-window')" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">確認</button>
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
