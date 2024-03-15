<template>
    <div v-if="idPending" class="flex items-center justify-center m-auto pt-10">
        讀取中
    </div>
    <div v-if="showCheckUserIDisExist" class="flex items-center justify-center flex-col p-10 text-center">
        <p>本裝置已經設定過</p>
        <p>⚠️只允許申請單筆帳號您目前設定之身分證號<span class="text-blue-500 ">{{ personID }}</span>為如需修改請洽本診所</p>
        <p>若需要預約請填寫<a class="text-blue-500 underline" href="https://liff.line.me/1657869644-Z9PmDXzq">預約單</a></p>
    </div>
    
    <div v-if="showCheckUserIDisNotExist" class="flex items-center justify-center flex-col p-10 text-center">
        <h1 class="text-2xl font-bold text-center">問卷調查</h1>
        <form class="flex flex-col items-center" @submit.prevent="checkVIPisExist()">
            <p>歡迎您申請本系統👇 </p>
            <p>您的裝置尚未設定過身分證驗證 </p>
            <p>請直接輸入身分證號進行驗證(請使用大寫字母)</p>
            <label for="name" class="block mt-4">請問您的身分證號：<span class="text-red-500 text-sm">＊</span></label>
            <input type="text" id="personid" v-model="personID" pattern="[A-Za-z][0-9]{9}" placeholder="身分證號" class="border border-gray-300 rounded-md px-2 py-1 mt-1" title="請輸入有效的姓名（範例：F123456789）" required />
            <button type="submit" class="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded">送出</button>
        </form>
    </div>

    <div v-if="checkUserVIPisExist" class="flex items-center justify-center flex-col p-10 text-center">
        <h1 class="text-2xl font-bold text-center">確認</h1>
        請問您是<span class="text-blue-500 ">{{ personName }}</span>嗎？
        <button @click="addPersonVIP()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">是</button>
        <button @click="addPersonID = true;checkUserVIPisExist = false" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">否</button>
    </div>

    <div v-if="addPersonID" class="flex items-center justify-center flex-col p-10 text-center">
        <h1 class="text-2xl font-bold text-center">基本資料與綁定裝置</h1>
        請輸入基本資料，並且綁定本裝置。
        <input type="text" id="name" v-model="personName" pattern="[A-Za-z]+" placeholder="姓名" class="border border-gray-300 rounded-md px-2 py-1 mt-1" title="請輸入姓名" required />
        <input type="text" id="phone" v-model="personPhone" pattern="[0-9]+" placeholder="聯絡電話" class="border border-gray-300 rounded-md px-2 py-1 mt-1" title="請輸入聯絡電話" required />

        <button @click="addPersonIDFunc()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">確認</button>
        <button @click="$emit('close-window')" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">取消</button>
    </div>

    <div v-if="finishAddPersonID" class="flex items-center justify-center flex-col p-10 text-center">
        <p>本裝置完成綁定</p>
        <p>若需要預約請填寫<a class="text-blue-500 underline" href="https://liff.line.me/1657869644-Z9PmDXzq">預約單</a></p>
        <button @click="$emit('close-window')" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">確認</button>
    </div>
    <div v-if="finishAddVIPPersonID" class="flex items-center justify-center flex-col p-10 text-center">
        <p>本裝置完成綁定</p>
        <p>若需要預約請填寫<a class="text-blue-500 underline" href="https://liff.line.me/1657869644-Z9PmDXzq">預約單</a></p>
        <button @click="$emit('close-window')" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">確認</button>
    </div>

    <!-- <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"> 
        <div class="bg-white p-4 rounded">
            <p class="text-xl font-bold mb-2">送出完成</p>
            <p>您的回應已成功送出！</p>
            <button @click="closePop" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">確定</button>
        </div>
    </div> -->
</template>

<script setup>
import { ref,onMounted, watch, shallowReactive } from 'vue';
import axios from 'axios';

const user = defineProps(['userid'])
const res = ref(null)

console.log("userID",user);
const personID = ref('');
const personName = ref('');
const personPhone = ref('');
const showCheckUserIDisExist = ref(false);
const showCheckUserIDisNotExist = ref(false);
const checkUserVIPisExist = ref(false);
const idPending = ref(true);
const checkUserIDisExist = ref(false);
const addPersonID= ref(false);
const finishAddPersonID= ref(false);
const finishAddVIPPersonID= ref(false);

const checkVIPisExist = () => {
    const formData = new FormData();
    formData.append('method', 'checkVIPisExist');
    formData.append('personid', personID.value);
    formData.append('userid', user.userid);

    idPending.value = true;
    showCheckUserIDisNotExist.value = false;
    axios({
        method: 'post',
        url: 'https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    }) 
    .then(response => {
        console.log("response",response);
        if(response.data.result === "personidisexist"){
            res.value = response.data;
            idPending.value = false;
            checkUserVIPisExist.value = true;
            personName.value = response.data.personname;
        }else{
            idPending.value = false;
            checkUserVIPisExist.value = false;
            addPersonID.value = true;
        }
        
    })
    .catch(error => {
        // Handle the error here
        console.log(error);
    });
}

const addPersonVIP = () => {
    const formData = new FormData();
    formData.append('method', 'addPersonVIP');
    formData.append('personid', personID.value);
    formData.append('userid', user.userid);

    idPending.value = true;
    checkUserVIPisExist.value = false;
    axios({
        method: 'post',
        url: 'https://script.google.com/macros/s/AKfycbxv0X4hKmjRsqICHL8WTa4nqpql6Rbq9w1njra_4jcFN-OcbZ4zxARyuyN9h2PCvvnB/exec',
        data: formData,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
    .then(response => {
        console.log(response.data);
        idPending.value = false;
        finishAddVIPPersonID.value = true;
        
    })
    .catch(error => {
        // Handle the error here
        console.log(error);
    });
    
}

const addPersonIDFunc = () => {

    if(!personName.value || !personPhone.value){
        alert("請輸入姓名與電話");
        return;
    }
    const formData = new FormData();
    formData.append('method', 'addPersonID');
    formData.append('personname', personName.value);
    formData.append('personphone', personPhone.value);
    formData.append('personid', personID.value);
    formData.append('userid', user.userid);

    idPending.value = true;
    addPersonID.value = false;
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
        finishAddPersonID.value = true;
        
    })
    .catch(error => {
        // Handle the error here
        console.log(error);
    });
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
            console.log("personID",personID);
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
