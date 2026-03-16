<script setup>
import liff from "@line/liff";
import { onMounted, ref, provide } from "vue";

const isLogin = ref(false);
const userdataUID = ref(null);

const closeWindow = () => {
  liff.closeWindow();
};

provide("userdataUID", userdataUID);
provide("isLogin", isLogin);
provide("closeWindow", closeWindow);

onMounted(async () => {
  console.log('[App] onMounted - 開始 LIFF 初始化');
  liff
    .init({
      liffId: "1657869644-jDxqpoMV",
    })
    .then(() => {
      console.log('[App] LIFF init 成功');
      console.log('[App] isLoggedIn:', liff.isLoggedIn());
      if (liff.isLoggedIn()) {
        isLogin.value = true;
        userdataUID.value = liff.getDecodedIDToken().sub;
        console.log('[App] userdataUID 已設定:', userdataUID.value);
      } else {
        console.log('[App] 使用者未登入 LINE');
      }
    })
    .catch((err) => {
      console.error('[App] LIFF init 失敗:', err.code, err.message);
    });
});
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
