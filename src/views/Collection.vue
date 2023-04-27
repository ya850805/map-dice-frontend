<template>
  <div class="pop_content">
    <div v-for="place in collectPlaces">
      <a :href="place.url" target="_blank">{{ place.name }}</a><br>
      網站：{{ place.website }}<br>
      地址：{{ place.address }}
      <button>{{ $t('_removeCollect') }}</button>
      <hr>
    </div>
  </div>
</template>

<script setup>
defineProps(['collectPlaces'])
</script>

<style scoped>

</style>