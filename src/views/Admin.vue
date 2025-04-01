<template>
    <div class="admin-page">
      <!-- 🔵 Logo en haut -->
      <router-link to="/" class="logo-link">
        <img src="/icons/Logo_KreyolKwest.png" alt="KreyolKwest" class="logo-img" />
      </router-link>
  
      <h1>Admin - Espace de gestion</h1>
  
      <!-- 🟡 Onglets -->
      <div class="tabs">
        <button :class="{ active: ongletActif === 'reservations' }" @click="ongletActif = 'reservations'">📄 Réservations</button>
        <button :class="{ active: ongletActif === 'gestion' }" @click="ongletActif = 'gestion'">⚙️ Ajout & Gestion</button>
      </div>
  
      <!-- 🧩 Contenu de l’onglet actif -->
      <div class="tab-content">
        <AdminReservations v-if="ongletActif === 'reservations'" />
        <AdminGestion v-if="ongletActif === 'gestion'" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import AdminReservations from '../components/AdminReservations.vue'
  import AdminGestion from '../components/AdminGestion.vue'
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('token')
  const admin = localStorage.getItem('admin')
  if (!token || admin !== 'oui') {
    router.push('/connexion')
  }
})



  const ongletActif = ref('reservations')
  </script>
  
  <style scoped>
  .admin-page {
    max-width: 1000px;
    margin: 40px auto;
    padding: 20px;
  }
  
  .logo-link {
    display: block;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .logo-img {
    height: 100px;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .tabs button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background-color: #eee;
    font-weight: bold;
  }
  
  .tabs button.active {
    background-color: #007bff;
    color: white;
  }
  
  .tab-content {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 12px;
  }
  </style>