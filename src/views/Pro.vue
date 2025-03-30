<template>
  <div class="pro-page">
    <!-- Auth Popup -->
    <div class="auth-popup" v-if="!connected">
      <div class="auth-box">
        <h3>Connexion Pro</h3>
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="password" placeholder="Mot de passe" type="password" />
        <button @click="login">Se connecter</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>

    <div v-else class="pro-content">
      <h2>Bienvenue, {{ user?.pseudo }}</h2>

      <div class="tabs">
        <button :class="{ active: currentTab === 'etablissements' }" @click="currentTab = 'etablissements'">
          Mes établissements
        </button>
        <button :class="{ active: currentTab === 'reservations' }" @click="currentTab = 'reservations'">
          Réservations
        </button>
      </div>

      <!-- Tab: Etablissements / Restaurants -->
      <div v-if="currentTab === 'etablissements'">
        <div class="item-card" v-for="item in etablissements" :key="item._id">
          <h3>{{ item.nom }}</h3>
          <p>{{ item.presentation }}</p>
          <button @click="editItem(item)">Modifier l’établissement</button>

          <!-- Restaurants liés -->
          <div
            class="restaurant-card"
            v-for="resto in restaurants.filter(r => r.etablissement === item._id)"
            :key="resto._id"
          >
            <h4>{{ resto.nom }}</h4>
            <p>{{ resto.presentation }}</p>
            <button @click="editRestaurant(resto)">Modifier le restaurant</button>
          </div>
        </div>
      </div>

      <!-- Tab: Reservations -->
      <div v-if="currentTab === 'reservations'">
        <div class="reservation-card" v-for="res in reservations" :key="res._id">
          <p><strong>Client :</strong> {{ res.userName }}</p>
          <p><strong>Activité :</strong> {{ res.nomActivite }}</p>
          <p><strong>Date :</strong> {{ res.date }}</p>
          <p><strong>Heure :</strong> {{ res.horaire }}</p>
          <p><strong>Statut :</strong> {{ res.statut }}</p>
          <div class="btns">
            <button @click="updateStatut(res._id, 'oui confirmé')">Confirmer</button>
            <button @click="updateStatut(res._id, 'refusé')">Refuser</button>
          </div>
        </div>
      </div>

      <!-- Popup Edit Etablissement -->
      <div v-if="editingItem" class="popup-overlay">
        <div class="popup">
          <h3>Modifier {{ editingItem.nom }}</h3>
          <input v-model="editingItem.horaireOuverture" placeholder="Horaires (ex: 10h - 18h)" />
          <div class="jours-selection">
            <label v-for="jour in joursDisponibles" :key="jour" class="jour-option">
              <input type="checkbox" :value="jour" v-model="editingItem.joursOuverture" />
              {{ jour }}
            </label>
          </div>
          <textarea v-model="editingItem.presentation" placeholder="Description de l'établissement" rows="5"></textarea>
          <div class="popup-actions">
            <button @click="saveChanges">Enregistrer</button>
            <button @click="editingItem = null">Annuler</button>
          </div>
        </div>
      </div>

      <!-- Popup Edit Restaurant -->
      <div v-if="editingRestaurant" class="popup-overlay">
        <div class="popup">
          <h3>Modifier {{ editingRestaurant.nom }}</h3>
          <input v-model="editingRestaurant.horaires" placeholder="Horaires" />
          <div class="jours-selection">
            <label v-for="jour in joursDisponibles" :key="jour" class="jour-option">
              <input type="checkbox" :value="jour" v-model="editingRestaurant.joursOuverture" />
              {{ jour }}
            </label>
          </div>
          <textarea v-model="editingRestaurant.presentation" placeholder="Description du restaurant" rows="5"></textarea>
          <div class="popup-actions">
            <button @click="saveRestaurantChanges">Enregistrer</button>
            <button @click="editingRestaurant = null">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/api'

const joursDisponibles = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const email = ref('')
const password = ref('')
const user = ref(null)
const error = ref('')
const connected = ref(false)
const currentTab = ref('etablissements')
const etablissements = ref([])
const reservations = ref([])
const restaurants = ref([])
const editingItem = ref(null)
const editingRestaurant = ref(null)

const login = async () => {
  try {
    const res = await api.post('/api/users/login', { identifiant: email.value, motDePasse: password.value })
    const token = res.data.token
    localStorage.setItem('token', token)
    const profile = await api.get('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
    if (profile.data.pro !== 'oui') {
      error.value = "Vous n'êtes pas autorisé."
      return
    }
    user.value = profile.data
    connected.value = true
    await fetchData()
  } catch (err) {
    error.value = 'Email ou mot de passe invalide.'
  }
}

const fetchData = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  const etabsRes = await api.get(`/api/etablissements/by-user/${user.value._id}`, { headers })
  etablissements.value = etabsRes.data
  const etabIds = etabsRes.data.map(e => e._id).filter(id => !!id)
  if (etabIds.length) {
    const resas = await api.get(`/api/reservations/by-etabs?ids=${etabIds.join(',')}`, { headers })
    reservations.value = resas.data
    const restos = await api.get(`/api/restaurants/by-etabs?ids=${etabIds.join(',')}`, { headers })
    restaurants.value = restos.data
  } else {
    reservations.value = []
    restaurants.value = []
  }
}

const editItem = (item) => {
  editingItem.value = {
    ...item,
    joursOuverture: Array.isArray(item.joursOuverture) ? [...item.joursOuverture] : []
  }
}

const editRestaurant = (resto) => {
  editingRestaurant.value = {
    ...resto,
    joursOuverture: Array.isArray(resto.joursOuverture) ? [...resto.joursOuverture] : []
  }
}

const saveChanges = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  await api.put(`/api/etablissements/${editingItem.value._id}`, editingItem.value, { headers })
  await fetchData()
  editingItem.value = null
}

const saveRestaurantChanges = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  await api.put(`/api/restaurants/${editingRestaurant.value._id}`, editingRestaurant.value, { headers })
  await fetchData()
  editingRestaurant.value = null
}

const updateStatut = async (id, statut) => {
  const token = localStorage.getItem('token')
  await api.put(`/api/reservations/${id}`, { statut }, { headers: { Authorization: `Bearer ${token}` } })
  await fetchData()
}
</script>

<style scoped>
.jours-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}
.jour-option {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.jour-option input[type="checkbox"] {
  cursor: pointer;
}
.pro-page {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}
.auth-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-box {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
}
.auth-box input {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}
.auth-box button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
}
.error {
  color: red;
  margin-top: 10px;
}
.tabs {
  display: flex;
  margin: 20px 0;
  gap: 10px;
}
.tabs button {
  padding: 10px;
  border: none;
  background: #eee;
  cursor: pointer;
}
.tabs .active {
  background: #007bff;
  color: white;
}
.item-card,
.restaurant-card,
.reservation-card {
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  margin: 10px 0;
}
.btns button {
  margin-right: 10px;
  padding: 6px 10px;
}
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
}
.popup input,
.popup textarea {
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}
.popup-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
@media screen and (max-width: 600px) {
  .tabs {
    flex-direction: column;
  }
  .auth-box {
    padding: 20px;
  }
  .popup {
    max-width: 90%;
  }
}
</style>