import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Connexion from '../views/Connexion.vue';
import Inscription from '../views/Inscription.vue';

const routes = [
  { path: '/home', component: Home },
  { path: '/restaurants', component: () => import('../views/Restaurants.vue') },
  { path: '/activites', component: () => import('../views/Activites.vue') },
  { path: '/contact', component: () => import('../views/Contact.vue') },
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: Inscription
  },
  {
    path: '/myactivlist',
    alias: '/reservations',
    name: 'MyActivlist',
    component: () => import('../views/MyActivlist.vue')
  },
  {
    path: '/activites/:id',
    name: 'ActiviteDetail',
    component: () => import('../views/Activites.vue')
  },
  {
    path: '/restaurants/:id',
    name: 'RestaurantDetail',
    component: () => import('../views/Restaurants.vue')
  },
  {
    path: '/compte',
    name: 'Compte',
    component: () => import('../views/Compte.vue')
  },
  { path: '/pro', 
    name: 'Pro', 
    component: () => import('../views/Pro.vue') },
    {
      path: '/validation/:id',
      name: 'Validation',
      component: () => import('../views/Validation.vue'),
    },
    {
      path: '/reset-password/:token',
      name: 'ResetPassword',
      component: () => import('../views/ResetPassword.vue')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../views/Admin.vue')
    }, 
    {
      path: '/',
      name: 'EnConstruction',
      component: () => import('../views/EnConstruction.vue')
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;