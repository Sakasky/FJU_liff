<template>
    <div v-if="idPending" class="flex items-center justify-center m-auto pt-10">
        讀取中
    </div>
    <div v-if="showCheckUserIDisExist" class="flex items-center justify-center flex-col p-10 text-center">
        <form class="flex flex-col items-center p-4" @submit.prevent="addOrderFunc()">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="input.personName" class="border border-gray-300 rounded-md p-2" required="required" pattern="[A-Za-z]+" />
            <label for="phone">您的電話號碼</label>
            <input class="border border-gray-300 rounded-md p-2" type="text" id="phone" v-model="input.personPhone" required="required" pattern="[0-9]+" />
            <label  for="issue">看診問題/備註事項</label>
            <textarea class="border border-gray-300 rounded-md p-2"  id="issue" v-model="input.issue"></textarea>
            <label for="doctor">約診醫生</label>
            <input class="border border-gray-300 rounded-md p-2"  type="text" id="doctor" v-model="input.doctor" />
            <label for="department">科別</label>
            <select class="border border-gray-300 rounded-md p-2"  id="department" v-model="input.department" required>
                <option v-for="department in department_data" :value="department" :key="department">{{ department }}</option>
            </select>
            <label for="date">就診日</label>
            <input class="border border-gray-300 rounded-md p-2"  type="date" id="date" v-model="input.orderDate"  required="required" />
            <label for="notes">備註欄,或其他您方便約診的時間</label>
            <textarea class="border border-gray-300 rounded-md p-2"  id="notes" v-model="input.notes"></textarea>
            <button type="submit" class="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded">送出</button>
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

//const user = defineProps(['userid'])
const res = ref(null)

const user = {
    userid: 'U14b5e7710fe33928351643793294dc3c'
}

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

const addOrderFunc = () => {
    // 清除之前的延时器
    if (addOrderTimer) {
        clearTimeout(addOrderTimer);
    }

    // 创建新的延时器
    addOrderTimer = setTimeout(() => {
        const formData = new FormData();
        formData.append('method', 'addOrder');
        formData.append('personName', input.value.personName);
        formData.append('issue', input.value.issue);
        formData.append('doctor', input.value.doctor);
        formData.append('department', input.value.department);
        formData.append('orderDate', input.value.orderDate);
        formData.append('notes', input.value.notes);

        axios({
            method: 'post',
            url: 'https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        }) 
        .then(response => {
            res.value = response.data;
            // Handle the response here
            console.log(response);
            idPending.value = false;
            showCheckUserIDisExist.value = false;
            finishOrder.value = true;
        })
        .catch(error => {
            // Handle the error here
            alert("預約失敗，請稍後再試或聯絡診所");
            console.log(error);
        });
    }, 1000); // 设置延时时间，单位为毫秒
}

const checkUserIDisExistFunc = () => {
    const formData = new FormData();
    formData.append('method', 'checkUserIDisExist');
    formData.append('userid', user.userid);   
    // formData.append('userid', 'U026dd072b34c71593f4fb6d1176d2c20');     

    axios({
        method: 'post',
        url: 'https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec',
        data: formData,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
    .then(response => {
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
onMounted(() => {
    checkUserIDisExistFunc();
});
// watch(user, (newValue, oldValue) => {
//     console.log("user.userid",user.userid);
//     checkUserIDisExistFunc();
// });
</script>
