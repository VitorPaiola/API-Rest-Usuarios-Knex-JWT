import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import axios from 'axios'
import Edit from '../views/Edit.vue'

function AdminAuth(to, from, next) {

  if (localStorage.getItem('token') != undefined) { // Ou seja, o token existe

    var req = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
      }
    }

    axios.post("http://localhost:8686/validate", {}, req).then(res => {
      console.log(res)
      next()
    }).catch(err => {
      console.log(err.response)
      next("/login")
    })
  } else {
    next("/login")
  }

}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/admin/users',
    name: 'users',
    component: Users,
    beforeEnter: AdminAuth
  },
  {
    path: '/admin/users/edit/:id',
    name: 'edit',
    component: Edit,
    beforeEnter: AdminAuth
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
