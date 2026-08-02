<script setup>
import { LIFF_IDS, liffErrorText } from '../api';
import liff from "@line/liff";
import { onMounted, ref } from "vue";
import Survey from "../components/Survey.vue";

const userdataUID = ref(null);
const initError = ref('');

onMounted(async () => {
  liff.init({ liffId: LIFF_IDS.survey })
    .then(() => {
      if (liff.isLoggedIn()) {
        userdataUID.value = liff.getDecodedIDToken().sub;
      }
    })
    .catch((err) => {
      console.error('[Home] LIFF init 失敗:', err.code, err.message);
      initError.value = liffErrorText(err, LIFF_IDS.survey);
    });
});

const closeWindow = () => { liff.closeWindow(); };
</script>

<template>
  <div class="text-xl">
    <pre v-if="initError" class="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm p-4 m-4 whitespace-pre-wrap break-all">{{ initError }}</pre>
    <Survey @close-window="closeWindow" :userid="userdataUID"/>
  </div>
</template>

<style scoped>
</style>
