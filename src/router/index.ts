import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ForgotPassword from '../views/ForgotPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name : 'login',
      component: Login
    },
    {
      path: "/register",
      name : 'register',
      component: Register
    },
    {
      path: "/forgot-password/:uuid",
      name: 'forgotPassword',
      component: ForgotPassword
    }
  ]
})

export default router
