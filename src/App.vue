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
  liff
    .init({
      liffId: "1657869644-jDxqpoMV",
    })
    .then(() => {
      if (liff.isLoggedIn()) {
        isLogin.value = true;
        userdataUID.value = liff.getDecodedIDToken().sub;
      }
    })
    .catch((err) => {
      console.log(err.code, err.message);
    });
});
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
