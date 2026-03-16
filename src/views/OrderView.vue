<script setup>
import liff from "@line/liff";
import { onMounted, ref } from "vue";
import Order from "../components/Order.vue";

const userdataUID = ref(null);

onMounted(async () => {
  liff.init({ liffId: "1657869644-x3BZd5wE" })
    .then(() => {
      if (liff.isLoggedIn()) {
        userdataUID.value = liff.getDecodedIDToken().sub;
      }
    })
    .catch((err) => {
      console.error('[Order] LIFF init 失敗:', err.code, err.message);
    });
});

const closeWindow = () => { liff.closeWindow(); };
</script>

<template>
  <div class="text-xl">
    <Order @close-window="closeWindow" :userid="userdataUID"/>
  </div>
</template>

<style scoped>
</style>
