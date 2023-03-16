<template>
  <div class="flex-col w-100">
    <p>{{ $t('_username') }}</p>
    <input type="text" v-model="username"/>
  </div>
  <div class="flex-col w-100">
    <p>{{ $t('_password') }}</p>
    <div class="flex-row-sb pos-relative">
      <input class="w-100" v-if="showPassword" type="text" v-model="password"/>
      <input class="w-100" v-else type="password" v-model="password"/>
      <i class="i-password" @click="showPassword=!showPassword"></i>
    </div>

    <div class="flex-row-e">
      <a @click="showEmail=true">{{ $t('_forgotPassword') }}</a>
    </div>
  </div>
  <div class="flex-col w-100 mt-40">
    <button @click="login">{{ $t('_login') }}</button>
  </div>

  <div class="pop_content" v-if="showEmail">
    <i class="i-cancel" @click="showEmail=false"></i>
    <div class="flex-col">
      <p>{{ $t('_email') }}</p>
      <input type="text" v-model="email"/>
    </div>
    <button class="mt-40" @click="sendForgotPasswordEmail">{{ $t('_sendEmail') }}</button>
  </div>
  <div class="pop_overlay" v-if="showEmail" @click="showEmail=false"></div>

  <AlertTheme v-if="isAlertShow" @closeAlert="isAlertShow = false" :alertMessage="alertMessage"
              :alert-btn-message="alertBtnMessage">
    <template></template>
  </AlertTheme>
</template>

<script setup>
import {ref} from "vue";
import axios from "axios";
import {BACKEND_URL} from "@/constant/MapDiceConstant";
import AlertTheme from "@/views/AlertTheme.vue";

//is alert show
let isAlertShow = ref(false)
let alertMessage = ref("")
let alertBtnMessage = ref("")

let username = ref("")
let password = ref("")
let showPassword = ref(false)
const emit = defineEmits(['updateLoginUser'])

let showEmail = ref(false)
let email = ref("")


function login() {
  if (username.value == "") {
    alertMessage.value = ("username is required")
    alertBtnMessage.value = ("confirm")
    isAlertShow.value = true
    return
  }

  if (password.value == "") {
    alertMessage.value = ("password is required")
    alertBtnMessage.value = ("confirm")
    isAlertShow.value = true
    return
  }

  axios.post(`${BACKEND_URL}/login?username=${username.value}&password=${password.value}`)
      .then(res => {
        if (res.data.code === 200) {
          const jwt = res.headers.authorization
          axios.defaults.headers.common['Authorization'] = jwt
          window.localStorage.setItem("jwt", jwt)

          axios.get(`${BACKEND_URL}/users/${jwt}`)
              .then(res => {
                emit('updateLoginUser', res.data.data)
              })
          alert(res.data.data)
          username.value = ""
          password.value = ""
        } else {
          alert(res.data.data)
          username.value = ""
          password.value = ""
        }
      })
}

function sendForgotPasswordEmail() {
  if (email.value.trim() == '') {
    alertMessage.value = ("email is required")
    alertBtnMessage.value = ("confirm")
    isAlertShow.value = true
    return
  }

  axios.post(`${BACKEND_URL}/users/forgotPwd/${email.value}`)
      .then(res => {
        if (res.data.code != 200) {
          alert(res.data.data)
        } else {
          alertMessage.value = ("reset password mail has sent, please check")
          alertBtnMessage.value = ("confirm")
          isAlertShow.value = true
        }
      })
      .catch(err => {
        console.log(err)
        alertMessage.value = ("send email occurs error")
        alertBtnMessage.value = ("confirm")
        isAlertShow.value = true
      })
}
</script>

<style scoped>

</style>
