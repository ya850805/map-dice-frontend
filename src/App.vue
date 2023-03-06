<template>
  <div class="img-bg-top-L"></div>
  <div class="img-bg-top-R"></div>
  <div class="img-bg-bottom"></div>
  <div class="function-content">
    <div class="img-open"></div>
    <!--    <img src="./assets/images/img-open.png" alt="" height="222" width="222"/>-->
    {{ $t('_lang') }}
    <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select>

    <div v-if="loginUser != ''">
      <div class="flex-row-sb mt-40" v-if="loginUser != ''">
        <p>Hi ~ {{ loginUser }}</p>
        <i class="i-logout" @click="logout"></i>
      </div>
    </div>
    <div v-else>
      <RouterLink to="/register" active-class="red">{{ $t('_register') }}</RouterLink>
      <RouterLink to="/login" active-class="red">{{ $t('_login') }}</RouterLink>
      <RouterView @updateLoginUser="updateLoginUser" />
    </div>

    <hr>

    <div class="w-100" v-if="loginUser != ''">
      <h2 class="txt_white">Choose at random</h2>
      <div class="flex-col w-100">
        <p>{{ $t('_placeType') }}</p>
        <select v-model="type">
          <option value="restaurant">{{ $t('_restaurant') }}</option>
        </select>
      </div>

      <button class="mt-40" @click="dice">{{ $t('_dice') }}</button>
      <div class="card_content">
        <p class="fz-h3">{{ placeName }}</p>
        <!--        <p>placeId : {{ placeId }}</p>-->

        <div class="flex-row">
          <i class="i-rating"></i>
          <div class="flex-col">
            <p class="fz-h4">{{ $t('_rating') }}</p>
            <p class="fz-h5">{{ placeRating }}</p>
          </div>
        </div>

        <div class="flex-row">
          <i class="i-total"></i>
          <div class="flex-col">
            <p class="fz-h4">{{ $t('_userRatingsTotal') }}</p>
            <p class="fz-h5">{{ placeUserRatingsTotal }}</p>
          </div>
        </div>

        <!--        <div class="flex-row">-->
        <!--          <i class="i-vicinity"></i>-->
        <!--          <div class="flex-col">-->
        <!--            <p class="fz-h4">Vicinity</p>-->
        <!--            <p class="fz-h5">{{ placeVicinity }}</p>-->
        <!--          </div>-->
        <!--        </div>-->

        <button class="btn-sec" @click="getPlaceDetail">{{ $t('_detail') }}</button>
        <div v-if="isDetailOpen">
          <div class="flex-row">
            <i class="i-vicinity"></i>
            <div class="flex-col">
              <p class="fz-h4">{{ $t('_address') }}</p>
              <p class="fz-h5">{{ detailAddress }}</p>
            </div>
          </div>

          <div class="flex-row">
            <i class="i-phone"></i>
            <div class="flex-col">
              <p class="fz-h4">{{ $t('_phoneNumber') }}</p>
              <p class="fz-h5">{{ detailPhoneNumber }}</p>
            </div>
          </div>

          <div class="flex-row">
            <i class="i-map"></i>
            <div class="flex-col">
              <p class="fz-h4">{{ $t('_googleMapUrl') }}</p>
              <p class="fz-h5">{{ detailUrl }}</p>
            </div>
          </div>

          <div class="flex-row">
            <i class="i-website"></i>
            <div class="flex-col">
              <p class="fz-h4">{{ $t('_website') }}</p>
              <p class="fz-h5">{{ detailWebsite }}</p>
            </div>
          </div>

          <div class="flex-col">
                  <span v-for="review in detailReviews" class="review_content">
                    <div class="flex-row">
                      <i class="i-user"></i>
                      <p>{{ review.author_name }}</p>
                    </div>

                     <div class="flex-row-sb">
                       <span class="flex-row">
                         <i class="i-rating"></i>
                          <p>{{ review.rating }}</p>
                       </span>
                       <span class="flex-row">
                          <p>{{ review.relative_time_description }}</p>
                       </span>
                    </div>
                    <p class="fz-h5">{{ review.text }}</p>
                  </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";
import {BACKEND_URL, GET_LOCATION_API_URL, RADIUS} from "@/constant/MapDiceConstant";

let loginUser = ref("")

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
let detailPhoneNumber = ref("")

onMounted(() => {
  const jwt = window.localStorage.getItem("jwt")
  if (jwt != null) {
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

function updateLoginUser(username: string) {
  loginUser.value = username
}

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

        axios.get(`${BACKEND_URL}/dice?latitude=${latitude}&longitude=${longitude}&radius=${RADIUS}&type=${type.value}`)
            .then(res => {
              console.log(res)
              if (res.data.code == 200) {
                const data = res.data.data
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
  if (id == '') {
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
        detailPhoneNumber.value = data.formatted_phone_number

        const reviews: any[] = data.reviews
        reviews.forEach(r => {
          detailReviews.push(
              {
                "author_name": r.author_name,
                "rating": r.rating,
                "relative_time_description": r.relative_time_description,
                "text": r.text
              }
          )
        })
      })
      .catch(err => {
        alert("get place detail occurs error")
      })
}

function logout() {
  axios.defaults.headers.common['Authorization'] = ""
  window.localStorage.removeItem("jwt")
  loginUser.value = ''
}
</script>

<style scoped>
/*TODO*/
.red {
  color: red;
}
</style>
