<script setup>
import { inject } from "vue";
import Survey from "../components/Survey.vue";

const userdataUID = inject("userdataUID");
const closeWindow = inject("closeWindow");
</script>

<template>
  <div class="text-xl">
    <Survey @close-window="closeWindow" :userid="userdataUID"/>
  </div>
</template>

<style scoped>
</style>
