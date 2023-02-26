<template>
  <header>
    <div class="wrapper">
      <h1>Register/Login</h1>
      username: <input type="text" v-model="username"/>
      password: <input type="password" v-model="password"/>
      <button @click="register()">register</button>

      <button @click="login()" v-if="loginUser == ''">login</button><br>
      <div v-if="loginUser != ''">
        Hi {{loginUser}}
        <button @click="logout()">logout</button>
      </div>


      <hr>

      <h1>Dice</h1>
      <div v-if="loginUser != ''">
        Place type:
        <select v-model="type">
          <option value="restaurant">restaurant</option>
        </select>
        <button @click="dice()">Dice</button>
        <br>

        <hr>

        placeId : {{ placeId }} <br>
        name : {{ placeName }} <br>
        rating: {{ placeRating }} <br>
        userRatingsTotal : {{ placeUserRatingsTotal }} <br>
        vicinity : {{ placeVicinity }} <br>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";
import {BACKEND_URL, GET_LOCATION_API_URL, RADIUS} from "@/constant/MapDiceConstant";

let loginUser = ref("")
let username = ref("")
let password = ref("")

let type = ref("")
let placeId = ref("")
let placeName = ref("")
let placeRating = ref(0)
let placeUserRatingsTotal = ref(0)
let placeVicinity = ref("")

onMounted(() => {
  const jwt = window.localStorage.getItem("jwt")
  if(jwt != null) {
    axios.get(`${BACKEND_URL}/users/${jwt}`)
        .then(res => {
          loginUser.value = res.data.data
          axios.defaults.headers.common['Authorization'] = jwt
        })
        .catch(err => {
          //jwt expired.
          loginUser.value = ""
          window.localStorage.removeItem("jwt")
        })
  }
})

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

        console.log(latitude)
        console.log(longitude)

        axios.get(`${BACKEND_URL}/dice?latitude=${latitude}&longitude=${longitude}&radius=${RADIUS}&type=${type.value}`)
            .then(res => {
              if (res.data.code == 200) {
                const data = res.data.data
                console.log(data)
                placeId.value = data.place_id
                placeName.value = data.name
                placeRating.value = data.rating
                placeUserRatingsTotal.value = data.user_ratings_total
                placeVicinity.value = data.vicinity
              } else {
                alert(res.data.data)
              }
            })
            .catch(err => {
              if (err.response.status == 401) {
                alert("login required...")
                window.localStorage.removeItem("jwt")
                loginUser.value = ""
              }
            })
      })
      .catch(err => {
        console.log(err)
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

  axios.post(`${BACKEND_URL}/login?username=${username.value}&password=${password.value}`)
      .then(res => {
        if (res.data.code === 200) {
          const jwt = res.headers.authorization
          axios.defaults.headers.common['Authorization'] = jwt
          window.localStorage.setItem("jwt", jwt)

          axios.get(`${BACKEND_URL}/users/${jwt}`)
              .then(res => {
                loginUser.value = res.data.data
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

function logout() {
  axios.defaults.headers.common['Authorization'] = ""
  window.localStorage.removeItem("jwt")
  loginUser.value = ''
  username.value = ""
  password.value = ""
}

</script>

<style scoped>

</style>
