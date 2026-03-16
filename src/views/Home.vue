<script setup>
import liff from "@line/liff";
import { onMounted, ref } from "vue";
import Survey from "../components/Survey.vue";

const userdataUID = ref(null);

onMounted(async () => {
  liff.init({ liffId: "1657869644-jDxqpoMV" })
    .then(() => {
      if (liff.isLoggedIn()) {
        userdataUID.value = liff.getDecodedIDToken().sub;
      }
    })
    .catch((err) => {
      console.error('[Home] LIFF init 失敗:', err.code, err.message);
    });
});

const closeWindow = () => { liff.closeWindow(); };
</script>

<template>
  <div class="text-xl">
    <Survey @close-window="closeWindow" :userid="userdataUID"/>
  </div>
</template>

<style scoped>
</style>
