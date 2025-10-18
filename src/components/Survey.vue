<template>
    <div v-if="idPending" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-gray-600 text-lg">讀取中...</p>
        </div>
    </div>
    <div v-if="showCheckUserIDisExist" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-5xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">裝置已設定</h2>
            </div>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                <p class="text-sm text-gray-700 mb-2">⚠️ 只允許申請單筆帳號</p>
                <p class="text-sm text-gray-700">您目前設定的身分證號為：</p>
                <p class="text-xl font-bold text-blue-600 mt-2">{{ personID }}</p>
            </div>
            <p class="text-gray-600 text-sm mb-6">如需修改請洽本診所</p>
            <div class="border-t pt-6">
                <p class="text-gray-700 mb-3">若需要預約請填寫</p>
                <a class="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium" href="https://liff.line.me/1657869644-Z9PmDXzq">前往預約</a>
            </div>
        </div>
    </div>
    
    <div v-if="showCheckUserIDisNotExist" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">📋</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">身分驗證</h1>
                <p class="text-gray-600">歡迎您申請本系統</p>
            </div>
            <form class="space-y-4" @submit.prevent="checkVIPisExist()">
                <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                    <p class="text-sm text-gray-700">您的裝置尚未設定過身分證驗證</p>
                    <p class="text-sm text-gray-700 mt-1">請直接輸入身分證號進行驗證</p>
                </div>
                <div>
                    <label for="personid" class="block font-bold text-gray-700 mb-2">
                        身分證號 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="personid"
                        v-model="personID"
                        pattern="[A-Za-z][0-9]{9}"
                        placeholder="例如：A123456789"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        title="請輸入有效的身分證號（範例：A123456789）"
                        required
                    />
                    <p class="text-xs text-gray-500 mt-1">請使用大寫英文字母</p>
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm">
                    送出驗證
                </button>
            </form>
        </div>
    </div>

    <div v-if="checkUserVIPisExist" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-5xl mb-4">👤</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-4">身分確認</h1>
                <div class="bg-blue-50 rounded-lg p-6 mb-6">
                    <p class="text-gray-700 mb-2">請問您是</p>
                    <p class="text-3xl font-bold text-blue-600">{{ personName }}</p>
                    <p class="text-gray-700 mt-2">嗎？</p>
                </div>
            </div>
            <div class="flex gap-3">
                <button
                    @click="addPersonVIP()"
                    class="flex-1 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
                >
                    ✓ 是的
                </button>
                <button
                    @click="addPersonID = true;checkUserVIPisExist = false"
                    class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition font-medium shadow-sm"
                >
                    ✗ 不是
                </button>
            </div>
        </div>
    </div>

    <div v-if="addPersonID" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">📝</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">基本資料填寫</h1>
                <p class="text-gray-600 text-sm">請輸入基本資料並綁定本裝置</p>
            </div>
            <form class="space-y-5">
                <div>
                    <label for="name" class="block font-bold text-gray-700 mb-2">
                        姓名 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        v-model="personName"
                        pattern="[A-Za-z\u4e00-\u9fa5]+"
                        placeholder="請輸入姓名"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        title="請輸入姓名"
                        required
                    />
                </div>
                <div>
                    <label for="phone" class="block font-bold text-gray-700 mb-2">
                        聯絡電話 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="phone"
                        v-model="personPhone"
                        pattern="[0-9]+"
                        placeholder="請輸入聯絡電話"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        title="請輸入聯絡電話"
                        required
                    />
                </div>
                <div class="flex gap-3 pt-4">
                    <button
                        type="button"
                        @click="addPersonIDFunc()"
                        class="flex-1 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
                    >
                        確認送出
                    </button>
                    <button
                        type="button"
                        @click="$emit('close-window')"
                        class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition font-medium shadow-sm"
                    >
                        取消
                    </button>
                </div>
            </form>
        </div>
    </div>

    <div v-if="finishAddPersonID" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-6xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-green-600 mb-2">綁定成功！</h2>
                <p class="text-gray-700">本裝置已完成綁定</p>
            </div>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p class="text-sm text-gray-700">您現在可以使用本系統的所有功能</p>
            </div>
            <div class="border-t pt-6 space-y-4">
                <p class="text-gray-700">若需要預約請點擊下方按鈕</p>
                <a
                    class="block w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
                    href="https://liff.line.me/1657869644-Z9PmDXzq"
                >
                    前往預約
                </a>
                <button
                    @click="$emit('close-window')"
                    class="w-full bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition font-medium"
                >
                    關閉
                </button>
            </div>
        </div>
    </div>
    <div v-if="finishAddVIPPersonID" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-6xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-green-600 mb-2">綁定成功！</h2>
                <p class="text-gray-700">本裝置已完成綁定</p>
            </div>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p class="text-sm text-gray-700">您現在可以使用本系統的所有功能</p>
            </div>
            <div class="border-t pt-6 space-y-4">
                <p class="text-gray-700">若需要預約請點擊下方按鈕</p>
                <a
                    class="block w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
                    href="https://liff.line.me/1657869644-Z9PmDXzq"
                >
                    前往預約
                </a>
                <button
                    @click="$emit('close-window')"
                    class="w-full bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition font-medium"
                >
                    關閉
                </button>
            </div>
        </div>
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
    formData.append('personid', personID.value);
    formData.append('userid', user.userid);

    idPending.value = true;
    showCheckUserIDisNotExist.value = false;
    axios({
        method: 'post',
        url: 'https://fju-line-app.herokuapp.com/infolinebot/check_vip',
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
        url: 'https://fju-line-app.herokuapp.com/infolinebot/add_person_vip',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
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
        url: 'https://fju-line-app.herokuapp.com/infolinebot/add_person_info',
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
    formData.append('userid', user.userid);
    // formData.append('userid', 'U026dd072b34c71593f4fb6d1176d2c20');

    axios({
        method: 'post',
        url: 'https://fju-line-app.herokuapp.com/infolinebot/check_user_registered',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
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
