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

  <button @click="register()">Register</button>
  <button class="btn-sec" @click="login" v-if="loginUser == ''">login</button>
  <div v-if="loginUser != ''">
    Hi {{ loginUser }}
    <button class="btn-sec" @click="logout">logout</button>
  </div>

  <hr>

  <h1>Dice</h1>
  <div v-if="loginUser != ''">
    Place type:
    <select v-model="type">
      <option value="restaurant">restaurant</option>
    </select>
    <button @click="dice">Dice</button>
    <br>

    <hr>

    placeId : {{ placeId }} <br>
    name : {{ placeName }} <br>
    rating : {{ placeRating }} <br>
    userRatingsTotal : {{ placeUserRatingsTotal }} <br>
    vicinity : {{ placeVicinity }} <br>
    <button @click="getPlaceDetail">detail</button>

    <br>
    <span v-if="isDetailOpen">
          address : {{ detailAddress }} <br>
          google map url : {{ detailUrl }} <br>
          website : {{ detailWebsite }} <br>
          reviews : <br>
          <span v-for="review in detailReviews">
            authorName : {{ review.author_name }} <br>
            rating : {{ review.rating }} <br>
            time : {{ review.relative_time_description }} <br>
            text : {{ review.text }} <br>
            <hr>
          </span>
        </span>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
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

let isDetailOpen = ref(false)
let detailAddress = ref("")
let detailUrl = ref("")
let detailWebsite = ref("")
let detailReviews: any[] = ref([]).value

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

function getPlaceDetail() {
  const id = placeId.value
  if(id == '') {
    alert('please dice first.')
    return
  }

  isDetailOpen.value = true
  axios.get(`${BACKEND_URL}/place/${id}`)
      .then(res => {
        const data = res.data.data
        console.log(res)
        detailAddress.value = data.formatted_address
        detailUrl.value = data.url
        detailWebsite.value = data.website

        const reviews: any[] = data.reviews
        reviews.forEach(r => {
          detailReviews.push(
              {
                "author_name" : r.author_name,
                "rating" : r.rating,
                "relative_time_description" : r.relative_time_description,
                "text" : r.text
              }
          )
        })
      })
      .catch(err => {
        alert("get place detail occurs error")
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
