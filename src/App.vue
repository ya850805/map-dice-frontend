<template>
  <div class="img-bg-top-L"></div>
  <div class="img-bg-top-R"></div>
  <div class="img-bg-bottom"></div>

  <img src="./assets/images/img-open.png" alt="" height="222" width="222"/>
  <div class="flex-col">
    <p>username:</p>
    <input type="text" v-model="username"/>
  </div>
  <div class="flex-col">
    <p>password</p>
    <input type="password" v-model="password"/>
  </div>

  <button @click="register()" >Register</button>
  <button class="btn-sec" @click="login()" :disabled="isLogin">Login</button>
  <button class="btn-sec" @click="logout()" :disabled="!isLogin">Logout</button>

  <hr>

  <h1>Dice</h1>
  Place type:
  <select v-model="type" :disabled="!isLogin">
    <option value="restaurant">restaurant</option>
  </select>
  <button @click="dice()" :disabled="!isLogin">Dice</button>
  <br>

  <hr>

  <div v-if="isLogin">
    name : {{ placeName }} <br>
    rating: {{ placeRating }} <br>
    userRatingsTotal : {{ placeUserRatingsTotal }} <br>
    vicinity : {{ placeVicinity }} <br>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import axios from "axios";
import {BACKEND_URL, RADIUS} from "@/constant/MapDiceConstant";
let username = ref("")
let password = ref("")
let isLogin = ref(false)
let type = ref("")
let placeName = ref("")
let placeRating = ref(0)
let placeUserRatingsTotal = ref(0)
let placeVicinity = ref("")
function dice() {
  if (type.value === "") {
    alert('Please choose one type.')
  } else {
    getLocationThenDice()
  }
}
function getLocationThenDice() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPositionAndDice);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function getPositionAndDice(position: { coords: { latitude: any; longitude: any; }; }) {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  console.log(`latitude=${latitude} longitude=${longitude}`);
  axios.get(`${BACKEND_URL}/dice?latitude=${latitude}&longitude=${longitude}&radius=${RADIUS}&type=${type.value}`,
      {
        auth: {
          username: username.value,
          password: password.value
        }
      }
  )
      .then(res => {
        console.log(res)
        if (res.data.code == 200) {
          const data = res.data.data
          placeName.value = data.name
          placeRating.value = data.rating
          placeUserRatingsTotal.value = data.userRatingsTotal
          placeVicinity.value = data.vicinity
        } else {
          alert(res.data.data)
        }
      })
      .catch(err => {
        if (err.response.status == 401) {
          alert("login required...")
        }
      })
}
function register() {
  if (username.value == "") {
    alert("username is required")
    return
  }
  if (password.value == "") {
    alert("password is required")
    return
  }
  const registerUser = {
    name: username.value,
    password: password.value
  }
  axios.post(`${BACKEND_URL}/users/create`, registerUser)
      .then(res => {
        if (res.data.code == 200 && res.data.data == 1) {
          alert("successfully create user")
          username.value = ""
          password.value = ""
        } else {
          alert(res.data.data)
        }
      })
}
function login() {
  if (username.value == "") {
    alert("username is required")
    return
  }
  if (password.value == "") {
    alert("password is required")
    return
  }
  if (!isLogin) {
    alert("please login first")
    return
  }
  axios.post(`${BACKEND_URL}/login?username=${username.value}&password=${password.value}`)
      .then(res => {
        alert(res.data.data)
        if (res.data.code === 200) {
          isLogin.value = true
        } else {
          username.value = ""
          password.value = ""
          isLogin.value = false
        }
      })
}
function logout() {
  isLogin.value = false
  username.value = ""
  password.value = ""
}
</script>

<style scoped>
</style>
