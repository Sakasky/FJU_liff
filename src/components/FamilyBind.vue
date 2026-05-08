<template>
    <!-- Loading State -->
    <div v-if="idPending" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-gray-600 text-lg">讀取中...</p>
        </div>
    </div>

    <!-- Binding Form -->
    <div v-if="showForm" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">👨‍👩‍👧‍👦</div>
                <h1 class="text-3xl font-bold text-gray-800 mb-2">家屬綁定</h1>
                <p class="text-gray-600 text-sm">輸入要加入的病患身分證號碼與您的關係</p>
            </div>
            <form class="space-y-5" @submit.prevent="submitBind">
                <div>
                    <label for="targetPersonid" class="block font-bold text-gray-700 mb-2">
                        病患身分證字號 <span class="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="targetPersonid"
                        v-model="targetPersonid"
                        pattern="[A-Za-z][0-9]{9}"
                        maxlength="10"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition uppercase"
                        placeholder="例：A123456789"
                        required
                    />
                </div>
                <div>
                    <label for="relationship" class="block font-bold text-gray-700 mb-2">
                        您與病患的關係 <span class="text-red-500">*</span>
                    </label>
                    <select
                        id="relationship"
                        v-model="relationship"
                        class="w-full border border-gray-300 rounded-md px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                        required
                    >
                        <option value="" disabled>請選擇關係</option>
                        <option v-for="rel in relationshipOptions" :key="rel" :value="rel">{{ rel }}</option>
                    </select>
                </div>

                <div v-if="errorMsg" class="bg-red-50 border-l-4 border-red-500 p-3">
                    <p class="text-sm text-red-700">{{ errorMsg }}</p>
                </div>

                <button
                    type="submit"
                    class="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isSending"
                >
                    <span v-if="isSending">⏳ 送出中...</span>
                    <span v-else>✓ 確認綁定</span>
                </button>
            </form>
        </div>
    </div>

    <!-- Not Registered -->
    <div v-if="showNotRegistered" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-6xl mb-4">🔒</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">尚未完成身份綁定</h1>
                <p class="text-gray-600 text-sm">您需要先完成身份設定才能使用家屬綁定功能</p>
            </div>
            <button
                @click="$router.push('/')"
                class="w-full bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium shadow-sm"
            >
                前往設定
            </button>
        </div>
    </div>

    <!-- Success -->
    <div v-if="showSuccess" class="flex items-center justify-center p-6 min-h-screen">
        <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <div class="mb-6">
                <div class="text-6xl mb-4">✅</div>
                <h2 class="text-2xl font-bold text-green-600 mb-2">綁定成功！</h2>
                <p class="text-gray-600 text-sm">您已成功加入病患的家屬名單</p>
            </div>
            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6 text-left">
                <p class="text-sm text-gray-700">✓ 病患日後可在預約系統中看到您的資料</p>
                <p class="text-sm text-gray-700 mt-1">✓ 可代為預約門診</p>
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

const user = defineProps(['userid']);
defineEmits(['close-window']);

const idPending = ref(true);
const showForm = ref(false);
const showNotRegistered = ref(false);
const showSuccess = ref(false);
const isSending = ref(false);
const errorMsg = ref('');

const targetPersonid = ref('');
const relationship = ref('');

const relationshipOptions = ['配偶', '子女', '父母', '兄弟姐妹', '其他'];

const submitBind = () => {
    errorMsg.value = '';
    isSending.value = true;

    const params = new URLSearchParams();
    params.append('userid', user.userid);
    params.append('target_personid', targetPersonid.value.toUpperCase());
    params.append('relationship', relationship.value);

    axios({
        method: 'post',
        url: 'https://fju-line-app.herokuapp.com/infolinebot/bind_family_member',
        data: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000
    })
    .then(() => {
        isSending.value = false;
        showForm.value = false;
        showSuccess.value = true;
    })
    .catch(error => {
        isSending.value = false;
        if (error.code === 'ECONNABORTED') {
            errorMsg.value = '連線逾時，請檢查網路連線後再試';
        } else if (error.response?.status === 400 && error.response?.data?.message === '請先完成身份綁定') {
            showForm.value = false;
            showNotRegistered.value = true;
        } else if (error.response?.status === 500) {
            errorMsg.value = '系統錯誤，請稍後再試或聯絡診所';
        } else {
            errorMsg.value = error.response?.data?.message || '操作失敗，請稍後再試';
        }
    });
};

watch(() => user.userid, (uid) => {
    if (uid) {
        idPending.value = false;
        showForm.value = true;
    }
});
</script>
