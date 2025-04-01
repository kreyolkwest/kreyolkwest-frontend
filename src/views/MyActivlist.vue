<template>
  <div class="activlist-container">
    <div class="logo-wrapper">
  <router-link to="/" class="logo-link">
    <img src="/icons/Logo_KreyolKwest.png" alt="KreyolKwest" class="logo-img" />
  </router-link>
</div>
    <h2>Mes réservations</h2>

    <div v-if="reservations && reservations.length">
      <div
        v-for="res in sortedReservations"
        :key="res._id"
        class="card"
      >
        <div class="card-content reverse-row">
          <div class="text-content">
            <p><strong>Type :</strong> {{ res.restaurant ? 'Restaurant' : 'Activité' }}</p>
            <p><strong>Nom :</strong>
              <router-link
  :to="res.restaurant
    ? `/restaurants/${typeof res.restaurant === 'object' ? res.restaurant._id : res.restaurant}`
    : `/activites/${typeof res.activiteId === 'object' ? res.activiteId._id : res.activiteId}`"
  class="name-link"
>
  {{ res.nomActivite }}
</router-link>
        </p>
            <p><strong>Date :</strong> {{ formatDate(res.date) }}</p>
            <p><strong>Heure :</strong> {{ res.horaire }}</p>
            <p><strong>Nombre de personnes :</strong> {{ String(res.nbPersonnes) }}</p>
            <p><strong>Établissement :</strong> {{ res.etablissement?.nom || '-' }}</p>
            <p><strong>Statut :</strong> {{ res.statut }}</p>

            <button @click="cancelReservation(res._id)" class="cancel-btn">Annuler</button>
            <button @click="openEditPopup(res)" class="edit-btn">Reprogrammer</button>
          </div>

          <img
            v-if="res.restaurant?.images?.[0] || res.activiteId?.images?.[0]"
            :src="res.restaurant?.images?.[0] || res.activiteId?.images?.[0]"
            alt="illustration"
            class="reservation-image"
          />
        </div>
      </div>
    </div>

    <p v-else>Aucune réservation trouvée.</p>
    <p v-if="erreur" class="error">{{ erreur }}</p>

    <!-- ✅ Popup de reprogrammation -->
    <div class="popup-overlay" v-if="selectedReservation">
      <div class="popup">
        <h3>Reprogrammer la réservation</h3>
        <input type="date" v-model="newDate" />
        <input type="time" v-model="newHoraire" />
        <div class="popup-actions">
          <button @click="submitUpdate">Valider</button>
          <button class="cancel-btn" @click="closeEditPopup">Annuler</button>
        </div>
      </div>
    </div>
                  <!-- ✅ Footer Desktop -->
                  <footer class="bottom-banner desktop-only">
      <button class="contact-btn" @click="goTo('/contact')">Nous contacter</button>
      <div class="social-icons">
        <a href="https://www.instagram.com/kreyolkwest_martinique" target="_blank">
          <img src="/icons/instagram.png" alt="Instagram" />
        </a>
        <a href="https://whatsapp.com/channel/0029VaFflWGGzzKLLltJi21U" target="_blank">
          <img src="/icons/whatsapp.png" alt="WhatsApp" />
        </a>
      </div>
    </footer>

    <!-- ✅ Footer Mobile -->
    <footer class="bottom-nav mobile-only">
      <div class="nav-btn" @click="goTo('/')">
        <img src="/icons/home.png" alt="Accueil" />
        <span>Découvrir</span>
      </div>
      <div class="nav-btn" @click="goTo('/reservations')">
        <img src="/icons/calendar.png" alt="Activlist" />
        <span>My Activlist</span>
      </div>
      <div class="nav-btn" @click="goToCompte">
        <img src="/icons/user.png" alt="Compte" />
        <span>Mon compte</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/api'
import { isAuthenticated } from '../utils/auth.js'

const router = useRouter()
const reservations = ref([])
const erreur = ref('')
const selectedReservation = ref(null)
const newDate = ref('')
const newHoraire = ref('')
const goTo = (r) => router.push(r)
const goToCompte = () => {
  if (isAuthenticated()) {
    router.push('/compte')
  } else {
    router.push('/connexion')
  }
}


// 🔁 Vérification de l’utilisateur
const checkUserAndFetch = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/connexion')

    const userRes = await api.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (userRes.data.pro === 'oui') {
      return router.push('/pro')
    }

    const res = await api.get('/api/reservations/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    reservations.value = res.data
  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur lors du chargement des réservations.'
  }
}


const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const sortedReservations = computed(() => {
  return [...reservations.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const cancelReservation = async (id) => {
  if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
    try {
      const token = localStorage.getItem('token')
      await api.delete(`/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      reservations.value = reservations.value.filter(res => res._id !== id)
    } catch (err) {
      erreur.value = err.response?.data?.message || "Erreur lors de l’annulation."
    }
  }
}

const openEditPopup = (reservation) => {
  selectedReservation.value = reservation
  newDate.value = reservation.date
  newHoraire.value = reservation.horaire
}

const closeEditPopup = () => {
  selectedReservation.value = null
  newDate.value = ''
  newHoraire.value = ''
}

const submitUpdate = async () => {
  try {
    const token = localStorage.getItem('token')
    await api.put(`/api/reservations/${selectedReservation.value._id}`, {
      date: newDate.value,
      horaire: newHoraire.value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    await fetchReservations()
    closeEditPopup()
  } catch (err) {
    erreur.value = err.response?.data?.message || "Erreur lors de la reprogrammation."
  }
}
onMounted(checkUserAndFetch)
//onMounted(fetchReservations)
</script>

<style scoped>
.activlist-container {
  max-width: 700px;
  margin: 60px auto;
  padding: 0px;
  text-align: left;
}

/* 🔵 Logo */
.logo-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.logo-link {
  display: inline-block;
}

.logo-img {
  height: 120px;
  margin: 0 auto;
}

h2 {
  text-align: center;
}

.card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: #fdfdfd;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  flex-direction: row-reverse; /* 💡 Met l'image à droite */
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.text-content {
  flex: 1;
}

.reservation-image {
  width: 180px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  margin-top: 10px;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  margin-left: 10px;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.popup {
  background: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.popup input {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
}

.popup-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}

.error {
  color: red;
  text-align: center;
  margin-top: 20px;
}

  /* ✅ Footer Desktop */
  .bottom-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgb(179, 122, 0);
  border-top: 1px solid #ccc;
  padding: 10px 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;

}

.contact-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.contact-btn:hover {
  background-color: #0056b3;
}

.social-icons {
  display: flex;
  align-items: center;
}

.social-icons img {
  width: 30px;
  height: 30px;
  margin: 10px;
  cursor: pointer;
  gap: 10px;
}

/* ✅ Footer Mobile */
.bottom-nav {
  display: none;
}

@media screen and (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  nav.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
  margin-left: -15px;
}


  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    border-top: 1px solid #ccc;
    padding: 5px 0;
    justify-content: space-around;
    align-items: center;
    z-index: 1000;
  }

  .nav-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: #333;
    cursor: pointer;
  }

  .nav-btn img {
    width: 22px;
    height: 22px;
    margin-bottom: 4px;
  }

  .nav-btn span {
    font-size: 12px;
  }
}
</style>