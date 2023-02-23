<template>
  <header>
    <div class="wrapper">
      <h1>Register/Login</h1>
      username: <input type="text" v-model="username"/>
      password: <input type="password" v-model="password"/>
      <button @click="register()">register</button>
      <button @click="login()" :disabled="isLogin">login</button>
      <button @click="logout()" :disabled="!isLogin">logout</button>

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
    </div>
  </header>
</template>

<script setup lang="ts">
import {ref} from "vue";
import axios from "axios";
import {BACKEND_URL, GET_LOCATION_API_URL, RADIUS} from "@/constant/MapDiceConstant";

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
  axios.get(GET_LOCATION_API_URL)
      .then(res => {
        const latitude = res.data.lat
        const longitude = res.data.lon

        axios.get(`${BACKEND_URL}/dice?latitude=${latitude}&longitude=${longitude}&radius=${RADIUS}&type=${type.value}`,
            {
              auth: {
                username: username.value,
                password: password.value
              }
            }
        )
            .then(res => {
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
      })
      .catch(err => {
        alert('get user location occurs error...')
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
