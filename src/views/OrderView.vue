<script setup>
import { inject } from "vue";
import Order from "../components/Order.vue";

const userdataUID = inject("userdataUID");
const closeWindow = inject("closeWindow");
</script>

<template>
  <div class="text-xl">
    <Order @close-window="closeWindow" :userid="userdataUID"/>
  </div>
</template>

<style scoped>
</style>
