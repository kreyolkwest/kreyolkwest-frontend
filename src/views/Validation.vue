<template>
    <div class="validation-page">
      <img src="/icons/Logo_KreyolKwest.png" alt="Logo KreyolKwest" class="logo" />
  
      <div class="card">
        <h2>Réservation reçue</h2>
        <p><strong>Type :</strong> {{ type }}</p>
        <p><strong>Nom :</strong> {{ nom }}</p>
        <p><strong>Date :</strong> {{ date }}</p>
        <p><strong>Heure :</strong> {{ horaire }}</p>
        <p><strong>Nombre de personnes :</strong> {{ nbPersonnes }}</p>
  
        <div class="btn-group">
          <button @click="confirmerReservation" class="btn-confirm">✅ Confirmer</button>
          <button @click="refuserReservation" class="btn-refuse">❌ Refuser</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '../api/api'
  
  const route = useRoute()
  const id = route.params.id
  
  const type = ref('')
  const nom = ref('')
  const date = ref('')
  const horaire = ref('')
  const nbPersonnes = ref(0)
  
  onMounted(async () => {
    const res = await api.get(`/reservations/${id}`)
    type.value = res.data.restaurant ? 'Restaurant' : 'Activité'
    nom.value = res.data.nomActivite
    date.value = res.data.date
    horaire.value = res.data.horaire
    nbPersonnes.value = res.data.nbPersonnes || 1
  })
  
  const confirmerReservation = async () => {
  await api.put(`/reservations/public/${id}/confirm`)
  alert("Réservation confirmée !")
}

const refuserReservation = async () => {
  await api.put(`/reservations/public/${id}/refuse`)
  alert("Réservation refusée.")
}
  </script>
  
  <style scoped>
  .validation-page {
    max-width: 600px;
    margin: 60px auto;
    padding: 20px;
    text-align: center;
    font-family: sans-serif;
  }
  .logo {
    width: 180px;
    margin-bottom: 20px;
  }
  .card {
    background: #f9f9f9;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .btn-group {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  .btn-confirm, .btn-refuse {
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
  .btn-confirm {
    background-color: #28a745;
    color: white;
  }
  .btn-refuse {
    background-color: #dc3545;
    color: white;
  }
  </style>