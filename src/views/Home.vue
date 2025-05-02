<template>
  <div class="home">
    <NavBar />
    <h1 class="welcome-title"> </h1>
  <!-- Section hero visible au chargement -->
<div class="hero-section">
  <img class="hero-bg" src="@/assets/hero-martinique.png" alt="Martinique">
  <div class="hero-content">
    <h1 class="hero-title">Découvrez la Martinique</h1>
    <div class="search-bar">
      <input type="text" placeholder="Rechercher des restaurants..." />
      <button>Rechercher</button>
    </div>
  </div>
</div>

    <!-- 🔥 Barre toujours visible -->
    <div class="sticky-categories">
      <CategoriesBar @categorie-selectionnee="filtrerCategorie" />
    </div>

    <div v-if="filteredContent.length" class="content-grid">
      <div
        v-for="(item, index) in filteredContent"
        :key="item._id + '-' + index"
        class="card"
        @click="handleCardClick(item)"
      >
        <img :src="item.images[0]" :alt="item.nom" v-if="item.images?.length" />
        <h3>{{ item.nom }}</h3>
      </div>
    </div>

    <p v-else class="empty-message">Bientôt disponible !</p>

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
import NavBar from '../components/NavBar.vue';
import CategoriesBar from '../components/CategoriesBar.vue'
import api from '../api/api'
import { isAuthenticated } from '../utils/auth.js'

const router = useRouter()
const route = useRoute()

const restaurants = ref([])
const activities = ref([])
const selectedCategory = ref(null)

const goTo = (r) => router.push(r)

const goToCompte = () => {
  if (isAuthenticated()) {
    router.push('/compte')
  } else {
    router.push('/connexion')
  }
}

const mixedContent = computed(() => {
  const result = []
  const max = Math.max(restaurants.value.length, activities.value.length)
  for (let i = 0; i < max; i++) {
    if (restaurants.value[i]) result.push(restaurants.value[i])
    if (activities.value[i]) result.push(activities.value[i])
  }
  return result
})

const filteredContent = computed(() => {
  if (!selectedCategory.value) return mixedContent.value
  if (selectedCategory.value === 'restaurant') return restaurants.value
  return activities.value.filter(a => a.typesActivite?.includes(selectedCategory.value))
})

const handleCardClick = (item) => {
  const isRestaurant = restaurants.value.find(r => r._id === item._id)
  const isActivity = activities.value.find(a => a._id === item._id)

  if (isRestaurant) {
    router.push(`/restaurants/${item._id}`)
  } else if (isActivity) {
    router.push(`/activites/${item._id}`)
  }
}

const filtrerCategorie = (categorie) => {
  selectedCategory.value = categorie
}

onMounted(async () => {
  try {
    const resResto = await api.get('/api/restaurants')
    const resAct = await api.get('/api/activities')
    restaurants.value = resResto.data
    activities.value = resAct.data
  } catch (err) {
    console.error('Erreur lors du chargement des données', err)
  }
})
</script>

<style scoped>
.home {
  text-align: center;
  padding: 10px;
  padding-bottom: 120px;
}


/* Fixe la navbar */
nav.navbar {
  position: fixed;
  top: 0;
  z-index: 1000;
  margin-left: -160px;
}

.sticky-categories {
  position: fixed;
  margin-top: 20px;
  z-index: 100;
  margin-left: -170px;
  background-color: rgb(255, 255, 255);
  padding-top: 0px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 180px;
  padding: 0 20px;
}

.card {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  background-color: #fdfdfd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: scale(1.02);
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  
}

.empty-message {
  margin-top: 60px;
  font-size: 1.4rem;
  color: #666;
}

/* ✅ Footer Desktop */
.bottom-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
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
.sticky-categories {
  position: fixed;
  margin-top: 20px;
  z-index: 100;
  margin-left: -10px;
  
  background-color: rgb(255, 255, 255);
  padding-top: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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

:root {
  --fond-creme: #fffaf3;
}

body {
  background-color: var(--fond-creme);
  color: #111;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #111;
    color: #f5f5f5;
  }

  .card {
    background-color: #222;
    color: #f5f5f5;
  }

  .bottom-banner, .bottom-nav {
    background: #000;
    color: white;
  }

  input, button {
    color: black !important;
  }
}

.hero-section {
  position: relative;
  height: 400px;
  width: 100%;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  top: 0;
  left: 0;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 100px;
}

.hero-title {
  font-size: 3rem;
  color: white;
  text-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

.search-bar {
  margin-top: 20px;
}

.search-bar input {
  padding: 10px;
  width: 300px;
  border-radius: 8px;
  border: none;
}

.search-bar button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  background: orange;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
</style>