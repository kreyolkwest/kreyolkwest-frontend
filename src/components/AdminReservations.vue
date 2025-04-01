<template>
    <div class="reservations-admin">
      <h2>📄 Réservations</h2>
  
      <div class="stats">
        <p>Total : <strong>{{ reservations.length }}</strong> réservations</p>
      </div>
  
      <div class="filters">
        <label>Filtrer par type :</label>
        <select v-model="filtre.type">
          <option value="">Tous</option>
          <option value="etablissement">Etablissement</option>
          <option value="restaurant">Restaurant</option>
          <option value="activite">Activité</option>
        </select>
  
        <input
          v-if="filtre.type"
          v-model="filtre.id"
          type="text"
          placeholder="ID de l'élément"
        />
      </div>
  
      <div class="list">
        <div
          class="reservation-card"
          v-for="res in filteredReservations"
          :key="res._id"
        >
          <p><strong>Date :</strong> {{ res.date }}</p>
          <p><strong>Nombre de personnes :</strong> {{ res.nbPersonnes }}</p>
          <p><strong>Type :</strong> {{ res.type }}</p>
          <p><strong>ID élément :</strong> {{ res.elementId }}</p>
          <p><strong>Nom :</strong> {{ res.nom }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import api from '../api/api'
  
  const reservations = ref([])
  const filtre = ref({ type: '', id: '' })
  
  const filteredReservations = computed(() => {
    return reservations.value.filter((res) => {
      if (!filtre.value.type) return true
      return res.type === filtre.value.type && res.elementId === filtre.value.id
    })
  })
  
  onMounted(async () => {
    try {
      const res = await api.get('/api/reservations')
      reservations.value = res.data
    } catch (err) {
      console.error('Erreur lors du chargement des réservations', err)
    }
  })
  </script>
  
  <style scoped>
  .reservations-admin {
    padding: 20px;
  }
  
  .stats {
    margin-bottom: 20px;
  }
  
  .filters {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .list {
    display: grid;
    gap: 10px;
  }
  
  .reservation-card {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
  }
  </style>
  