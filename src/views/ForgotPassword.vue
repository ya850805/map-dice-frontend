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
import {useRoute, useRouter} from "vue-router/dist/vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
import {BACKEND_URL} from "@/constant/MapDiceConstant";

const route = useRoute()
const router = useRouter()
let uuid

let password = ref("")
let confirmPassword = ref("")
let showPassword = ref(false)
let showConfirmPassword = ref(false)

onMounted(() => {
  uuid = route.params.uuid
  if(!validUUID(uuid)) {
    alert('uuid is invalid')
    router.push("/")
  }
})

function resetPassword() {

  if(password.value != confirmPassword.value) {
    alert('confirm password not match')
    return
  }

  const updatePwdRequest = {
    uuid: uuid.value,
    password: password.value
  }

  axios.put(`${BACKEND_URL}/users/updatePwd`, updatePwdRequest)
      .then(res => {
        if(res.data.code == 200) {
          alert('update password success!')
          router.push('/login')
        } else {
          alert("update password error..." + res.data.data)
          password.value = ''
          confirmPassword.value = ''
        }
      }).catch(err => {
        console.log(err)
        alert("update password error...")
        password.value = ''
        confirmPassword.value = ''
  })
}

function validUUID(str) {
  const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi

  return regexExp.test(str)
}
</script>

<style scoped>

</style>