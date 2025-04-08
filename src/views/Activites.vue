<template>
  <div class="activity-detail" v-if="activity">
    <NavBar />
    <img :src="activity.images[0]" :alt="activity.nom" v-if="activity.images?.length" />

 

    <h2>{{ activity.nom }}</h2>
    <p><strong>Présentation :</strong> {{ activity.presentation }}</p>
    <p><strong>Horaires d’ouverture :</strong> {{ activity.horaires }}</p>
    <p><strong>Téléphone :</strong> {{ activity.etablissement.telephone }}</p>
    <p><strong>Âge minimum :</strong> {{ activity.ageMinimum }} ans</p>
    <p><strong>Prix :</strong> {{ activity.prix }}</p>

    <button @click="showPopup = true">Réserver</button>

    <!-- ✅ Popup réservation -->
    <div class="popup-overlay" v-if="showPopup">
      <div class="popup">
        <h3>Réserver cette activité</h3>

        <input type="date" v-model="date" :min="today" />

        <select v-model="horaire">
          <option disabled value="">Choisissez une heure</option>
          <option v-for="h in availableHours" :key="h" :value="h">{{ h }}</option>
        </select>

        <input
          type="number"
          v-model="nbPersonnes"
          :max="activity.limitePersonnes"
          min="1"
          :placeholder="`Nombre de personnes (max ${activity.limitePersonnes})`"
        />

        <div class="popup-actions">
          <button @click="submitReservation">Valider</button>
          <button @click="showPopup = false">Annuler</button>
        </div>

        <p v-if="message" class="success">{{ message }}</p>
        <p v-if="erreur" class="error">{{ erreur }}</p>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/api'
import NavBar from '../components/NavBar.vue';

const route = useRoute()
const router = useRouter()

const activity = ref(null)
const showPopup = ref(false)
const date = ref('')
const horaire = ref('')
const nbPersonnes = ref(1)
const message = ref('')
const erreur = ref('')
const goTo = (r) => router.push(r)

const today = new Date().toISOString().split('T')[0]

// ✅ Générer les créneaux horaires à partir du string horaires (ex: "9h-18h")
const availableHours = computed(() => {
  const horaireStr = activity.value?.horaires || ''
  if (!horaireStr.includes('h') || !horaireStr.includes('-')) return []

  const [startStr, endStr] = horaireStr.replaceAll('h', '').split('-')
  const start = parseInt(startStr)
  const end = parseInt(endStr)

  if (isNaN(start) || isNaN(end)) return []

  const slots = []
  for (let i = start; i <= end; i++) {
    slots.push(`${String(i).padStart(2, '0')}:00`)
  }
  return slots
})

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await api.get(`/api/activities/${id}`)
    activity.value = res.data
  } catch (err) {
    console.error('Erreur chargement activité', err)
  }
})

const submitReservation = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return router.push('/connexion')

    const etabId = typeof activity.value.etablissement === 'object'
      ? activity.value.etablissement._id
      : activity.value.etablissement
      console.log('👉 Données envoyées :', {
  date: date.value,
  horaire: horaire.value,
  nbPersonnes: nbPersonnes.value,
  nomActivite: activity.value.nom,
  activiteId: activity.value._id,
  etablissement: typeof activity.value.etablissement === 'object'
    ? activity.value.etablissement._id
    : activity.value.etablissement,
  statut: 'non confirmé'
})
    const res = await api.post('/api/reservations', {
      date: date.value,
      horaire: horaire.value,
      nbPersonnes: nbPersonnes.value,
      nomActivite: activity.value.nom,
      activiteId: activity.value._id,
      etablissement: etabId,
      statut: 'non confirmé'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    message.value = 'Réservation envoyée ✅'
    erreur.value = ''
    showPopup.value = false
  } catch (err) {
    erreur.value = err.response?.data?.message || 'Erreur lors de la réservation.'
    message.value = ''
  }
}
</script>

<style scoped>

/* Fixe la navbar */
nav.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
  margin-left: -380px;
}


.activity-detail {
  max-width: 800px;
  margin: auto;
  padding: 80px 20px 20px; 
  text-align: left;
}

.activity-detail img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  
}


button {
  margin-top: 20px;
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.popup input,
.popup select {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 90%;
}

.popup-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.success {
  color: green;
}

.error {
  color: red;
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
.navbar {
  z-index: 999;
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