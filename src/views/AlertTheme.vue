<template>
  <div class="pop_content">
    <i class="i-cancel"  @click="$emit('closeAlert')"></i>
    <p>{{ alertMessage }}</p>
    <button class="mt-40"  @click="$emit('closeAlert')">{{ alertBtnMessage }}</button>
  </div>
  <div class="pop_overlay" @click="$emit('closeAlert')"></div>
</template>

<script setup>
defineProps(['alertMessage', 'alertBtnMessage'])
</script>

<style scoped>

</style>
