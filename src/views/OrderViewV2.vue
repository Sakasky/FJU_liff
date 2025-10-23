<script setup>
import liff from "@line/liff";
import { onMounted, ref } from "vue";
import OrderV2 from "../components/OrderV2.vue";
// import VConsole from 'vconsole';

// new VConsole();
const isLogin = ref(false)
const userdataUID = ref(null);
const userdataEmail = ref(null);
onMounted(async () => {
  liff
  .init({
    liffId: "1657869644-z0PLNaQD", // 使用相同的 LIFF ID (測試用)
  })
  .then(() => {
    if(liff.isLoggedIn()){
      isLogin.value = liff.isLoggedIn();
      userdataUID.value = liff.getDecodedIDToken().sub;
      userdataEmail.value = liff.getDecodedIDToken().email;
    }

  })
  .catch((err) => {
    console.log(err.code, err.message);
  });
})

const closeWindow = () => {
  liff.closeWindow();
}
</script>

<template>
  <div class="text-xl">

    <OrderV2 @close-window="closeWindow" :userid="userdataUID"/>

  </div>
</template>



<style scoped>

</style>
