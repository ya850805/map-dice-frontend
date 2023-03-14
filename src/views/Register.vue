<template>
  <div class="flex-col w-100">
    <p>{{ $t('_email') }}</p>
    <input type="text" v-model="email"/>
  </div>
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
  </div>
  <div class="flex-col w-100">
    <p>{{ $t('_confirmPassword') }}</p>
    <div class="flex-row-sb pos-relative">
      <input class="w-100" v-if="showConfirmPassword" type="text" v-model="confirmPassword"/>
      <input class="w-100" v-else type="password" v-model="confirmPassword"/>
      <i class="i-password" @click="showConfirmPassword=!showConfirmPassword"></i>
    </div>
  </div>
  <div class="flex-col w-100 mt-40">
    <button @click="register()">{{ $t('_register') }}</button>
  </div>

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

let email = ref("")
let username = ref("")
let password = ref("")
let confirmPassword = ref("")
let showPassword = ref(false)
let showConfirmPassword = ref(false)

function register() {
  if (email.value == "") {
    alertMessage.value = ("mail is required")
    alertBtnMessage.value = ("confirm")
    isAlertShow.value = true
    return
  }

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

  if (confirmPassword.value == "") {
    alertMessage.value = ("password is required")
    alertBtnMessage.value = ("confirm")
    isAlertShow.value = true
    return
  }

  if (password.value != confirmPassword.value) {
    alertMessage.value = ("password and confirm password are not match")
    alertBtnMessage.value = ("confirm")
    isAlertShow.value = true
    return
  }

  const registerUser = {
    email: email.value,
    name: username.value,
    password: password.value
  }

  axios.post(`${BACKEND_URL}/users/create`, registerUser)
      .then(res => {
        if (res.data.code == 200 && res.data.data == 1) {
          alertMessage.value = ("successfully create user")
          alertBtnMessage.value = ("confirm")
          isAlertShow.value = true
          email.value = ""
          username.value = ""
          password.value = ""
        } else {
          alert(res.data.data)
        }
      })
}

</script>

<style scoped>

</style>
