import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('../pages/Explore.vue'),
  },
  {
    path: '/destination/:id',
    name: 'destination-detail',
    component: () => import('../pages/DestinationDetail.vue'),
  },
  {
    path: '/trip-planner',
    name: 'trip-planner',
    component: () => import('../pages/TripPlanner.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/Register.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/Profile.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
