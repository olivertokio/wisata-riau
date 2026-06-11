import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

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
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/auth/Register.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/Profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../pages/Favorites.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../pages/admin/Dashboard.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Dashboard' },
  },
  {
    path: '/admin/destinations',
    name: 'admin-destinations',
    component: () => import('../pages/admin/Destinations.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Destinations' },
  },
  {
    path: '/admin/categories',
    name: 'admin-categories',
    component: () => import('../pages/admin/Categories.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Categories' },
  },
  {
    path: '/admin/reviews',
    name: 'admin-reviews',
    component: () => import('../pages/admin/Reviews.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Reviews' },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../pages/admin/Users.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Users' },
  },
  {
    path: '/admin/trip-plans',
    name: 'admin-trip-plans',
    component: () => import('../pages/admin/TripPlans.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Trip Planner' },
  },
  {
    path: '/admin/gallery',
    name: 'admin-gallery',
    component: () => import('../pages/admin/Gallery.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Gallery' },
  },
  {
    path: '/admin/chat',
    name: 'admin-chat',
    component: () => import('../pages/admin/Chat.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Customer Service Chat' },
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('../pages/admin/Settings.vue'),
    meta: { layout: 'admin', requiresAdmin: true, title: 'Settings' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()
  await userStore.initialize()

  if (to.meta.guestOnly && userStore.isAuthenticated) {
    return userStore.isAdmin ? { name: 'admin-dashboard' } : { name: 'profile' }
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.requiresAdmin) {
    return userStore.isAdmin ? true : { name: 'home' }
  }

  return true
})

export default router
