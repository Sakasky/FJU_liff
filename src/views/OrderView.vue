<script setup>
import liff from "@line/liff";
import { onMounted, ref } from "vue";
import Order from "../components/Order.vue";


const isLogin = ref(false)
const userdataUID = ref(null);
const userdataEmail = ref(null);
onMounted(async () => {
  liff
  .init({
    liffId: "1657869644-x3BZd5wE", // 從LIFF頁面中拿到的ID
  })
  .then(() => { 
    if(liff.isLoggedIn()){
      //做你想要做的
      isLogin.value = liff.isLoggedIn();
      userdataUID.value = liff.getDecodedIDToken().sub;
      userdataEmail.value = liff.getDecodedIDToken().email;
    }
    
  })
  .catch((err) => {
    console.log(err.code, err.message);
  });
})
// console.log("userdataUID.value",userdataUID.value);

const closeWindow = () => {
  liff.closeWindow();
}
</script>

<template>
  <div class="text-xl">    
    <p class="text-center" v-if="isLogin">
      isLogin:    {{ isLogin }}
      userdata UID:    {{ userdataUID }}
      userdata mail:    {{ userdataEmail }}
    </p>
    

    <Order @close-window="closeWindow" :userid="userdataUID"/>

  </div>
</template>



<style scoped>

</style>