<template>
  <div class="flex-col w-100">
    <p>{{ $t('_resetPassword') }}</p>
    <div class="flex-row-sb pos-relative">
      <input class="w-100" v-if="showPassword" type="text" v-model="password"/>
      <input type="password" v-else class="w-100" v-model="password" />
      <i class="i-password" @click="showPassword=!showPassword"></i>
    </div>

  </div>
  <div class="flex-col w-100">
    <p>{{ $t('_confirmResetPassword') }}</p>
    <div class="flex-row-sb pos-relative">
      <input class="w-100" v-if="showConfirmPassword" type="text" v-model="confirmPassword"/>
      <input type="password" v-else class="w-100" v-model="confirmPassword" />
      <i class="i-password" @click="showConfirmPassword=!showConfirmPassword"></i>
    </div>
  </div>

  <div class="flex-col w-100 mt-40">
    <button @click="resetPassword()">{{ $t('_resetPassword') }}</button>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router/dist/vue-router";
import {ref} from "vue";

const route = useRoute()
const uuid = route.params.uuid

let password = ref("")
let confirmPassword = ref("")
let showPassword = ref(false)
let showConfirmPassword = ref(false)

function resetPassword() {
  console.log(uuid)
  console.log(password.value)
  console.log(confirmPassword.value)
  //TODO send request
}

</script>

<style scoped>

</style>