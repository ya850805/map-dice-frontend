<template>
  <div class="pop_content">
    <i class="i-cancel"  @click="$emit('closeAlert')"></i>
    <div v-for="place in collectPlaces">
      <a :href="place.url" target="_blank">{{ place.name }}</a><br>
      網站：{{ place.website }}<br>
      地址：{{ place.address }}
      <button @click="removeCollect(place.id)">{{ $t('_removeCollect') }}</button>
      <hr>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import {BACKEND_URL} from "@/constant/MapDiceConstant";

defineProps(['collectPlaces'])
const emit = defineEmits(['removeCollect'])

function removeCollect(id) {
  axios.delete(`${BACKEND_URL}/users-collect/`, {
    data :{
      placeId: id
    }
  }).then(res => {
    emit('removeCollect', id)
    alert("Remove collection success")
  }).catch(err => {
    console.log(err)
    alert("Remove collection fail...")
  })
}
</script>

<style scoped>

</style>