<script setup>
import liff from "@line/liff";
import { onMounted, ref } from "vue";
import FamilyBind from "../components/FamilyBind.vue";
import VConsole from 'vconsole';

new VConsole();

const userdataUID = ref(null);

onMounted(async () => {
  liff.init({ liffId: "1657869644-wuZuat4c" })
    .then(() => {
      if (liff.isLoggedIn()) {
        userdataUID.value = liff.getDecodedIDToken().sub;
      }
    })
    .catch((err) => {
      console.error('[FamilyBindView] LIFF init 失敗:', err.code, err.message);
    });
});

const closeWindow = () => { liff.closeWindow(); };
</script>

<template>
  <div class="text-xl">
    <FamilyBind @close-window="closeWindow" :userid="userdataUID" />
  </div>
</template>
