<template>
  <div class="home">
    <NavBar />
    <h1 class="welcome-title"> </h1>
    <!-- 🔥 Barre toujours visible -->
    <div class="sticky-categories">
      <CategoriesBar @categorie-selectionnee="filtrerCategorie" />
    </div>
  <!-- Section hero visible au chargement -->
<div class="hero-section">
  <img class="hero-bg" :src="heroImage" alt="Martinique">
  <div class="hero-content">
    <h1 class="hero-title">Découvrez la Martinique</h1>
    <div class="search-bar">
      <input 
      type="text" 
      v-model="searchQuery"
      placeholder="Rechercher des restaurants, activités,..." 
      @input="handleSearch"
      />
      <button @click="handleSearch">Rechercher</button>
    
    </div>
  </div>
</div>

    

    <div v-if="filteredContent.length" class="content-grid">
      <div
        v-for="(item, index) in filteredContent"
        :key="item._id + '-' + index"
        class="card"
        @click="handleCardClick(item)"
      >
      <img 
    :src="item.images[0]" 
    :alt="item.nom" 
    @error="handleImageError($event, item)"
    v-if="item.images?.length" 
  />
  <h3>{{ item.nom }}</h3>
      </div>
    </div>

    <p v-else class="empty-message">Bientôt disponible !</p>



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
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue';
import CategoriesBar from '../components/CategoriesBar.vue'

import api from '../api/api'
import { isAuthenticated } from '../utils/auth.js'
import heroImage from '../assets/hero-martinique.png'

const router = useRouter()
const route = useRoute()

const restaurants = ref([])
const activities = ref([])
const selectedCategory = ref(null)
const searchQuery = ref('')

const goTo = (r) => router.push(r)

const goToCompte = () => {
  if (isAuthenticated()) {
    router.push('/compte')
  } else {
    router.push('/connexion')
  }
}

// ✅ Ajout d’un champ type pour faciliter la navigation
const mixedContent = computed(() => {
  const result = []
  const max = Math.max(restaurants.value.length, activities.value.length)
  for (let i = 0; i < max; i++) {
    if (restaurants.value[i]) result.push({ ...restaurants.value[i], type: 'restaurant' })
    if (activities.value[i]) result.push({ ...activities.value[i], type: 'activite' })
  }
  return result
})

const filteredContent = computed(() => {
  let results = []

  if (selectedCategory.value === 'restaurant') {
    results = restaurants.value.map(r => ({ ...r, type: 'restaurant' }))
  } else if (selectedCategory.value === null) {
    results = mixedContent.value
  } else {
    // 💡 Catégorie d’activité spécifique (ex: "terre", "mer", etc.)
    results = activities.value.filter(a =>
      a.typesActivite?.some(t =>
        t.toLowerCase().includes(selectedCategory.value.toLowerCase())
      )
    ).map(a => ({ ...a, type: 'activite' }))
  }

  //console.log("🧪 Après filtre catégorie, éléments restants :", results.length)

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    results = results.filter(item => {
      const searchableFields = [
        item.nom,
        item.description,
        item.adresse,
        ...(item.typesActivite || []),
        ...(item.specialites || [])
      ]
      return searchableFields.some(field =>
        field?.toLowerCase().includes(query)
      )
    })
  }

  return results
})

watchEffect(() => {
//  console.log("📌 Catégorie sélectionnée :", selectedCategory.value)
//  console.log("🧾 Données affichées dans les cards :", filteredContent.value)
//  console.log("📦 Restaurants chargés :", restaurants.value.length)
//  console.log("📦 Activities chargées :", activities.value.length)
//  console.log("🔍 Résultats filtrés :", filteredContent.value.length)
})

const handleSearch = () => {
  console.log('Recherche en cours:', searchQuery.value)
}

const handleCardClick = (item) => {
//  console.log("🔍 Clicked item:", item)

  const id = item._id || item.id
  const type = item.type || (item.typesActivite ? 'activite' : 'restaurant')

  if (!id) {
    console.warn("⚠️ Aucun ID défini pour cet item :", item)
    return
  }

  if (type === 'restaurant') {
    router.push(`/restaurants/${id}`)
  } else if (type === 'activite') {
    router.push(`/activites/${id}`)
  } else {
    console.warn("⚠️ Type non reconnu pour cet item :", item)
  }
}

const filtrerCategorie = (categorie) => {
  selectedCategory.value = categorie
}

onMounted(async () => {
  try {
    const resResto = await api.get('/api/restaurants')
    const resAct = await api.get('/api/activities')

  //  console.log("✅ Données brutes restaurants :", resResto.data)
  //  console.log("✅ Données brutes activités :", resAct.data)

    // ✅ Gestion sûre même si l'API retourne un objet avec une propriété contenant le tableau
    const restaurantsData = Array.isArray(resResto.data) ? resResto.data : resResto.data.restaurants || []
    const activitiesData = Array.isArray(resAct.data) ? resAct.data : resAct.data.activities || []

    // ✅ Logging pour chaque élément
   //.log("🍽 Restaurant :", r.nom, "ID:", r._id))
   // activitiesData.forEach(a => console.log("🎯 Activité :", a.nom, "ID:", a._id))

    // ✅ Injection dans les tableaux avec ajout du type
    restaurants.value = restaurantsData.map(r => ({ ...r, type: 'restaurant' }))
    activities.value = activitiesData.map(a => ({ ...a, type: 'activite' }))

   // console.log('📦 Restaurants chargés :', restaurants.value.length)
    //console.log('📦 Activités chargées :', activities.value.length)
  } catch (err) {
    console.error('❌ Erreur lors du chargement des données', err)
  }
})

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:5004/api/activities')
    const data = await res.json()
    //console.log('📡 Test direct fetch activities :', data)
  } catch (e) {
    console.error('❌ Test fetch échoué :', e)
  }
})



const handleImageError = (event, item) => {
  if (item.images && item.images.length > 1) {
    event.target.src = item.images[1]
  } else {
    event.target.src = '/placeholder-image.png'
  }
}
</script>

<style scoped>


/* Fond général */


/* Mode sombre */
@media (prefers-color-scheme: dark) {
  body {
    background-color: rgb(210, 145, 75);
    color: white;
  }

  .card {
    background-color: rgb(255, 181, 120);
    color: white;
  }

  .bottom-banner,
  .bottom-nav {
    background: #000;
    color: white;
  }

  input,
  button {
    color: black !important;
  }
}

/* SECTION GLOBALE */
.home {
  text-align: center;
  padding: 1rem;
  padding-bottom: 140px;
}

/* NAVBAR FIXE */
nav.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* CATÉGORIES FIXES */
.sticky-categories {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  z-index: 999;
  background: white;
  padding: 5px 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* GRID DES CARTES */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 120px;
  padding: 0 5%;
  margin-bottom: 120px;
}

/* CARTES INDIVIDUELLES */
.card {
  background: #fdfdfd;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.02);
}

.card img {
  width: 100%;
  height: clamp(180px, 25vw, 240px);
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

/* MESSAGE SI VIDE */
.empty-message {
  margin-top: 60px;
  font-size: 1.4rem;
  color: #666;
}

/* FOOTER DESKTOP */
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
  gap: 10px;
}

.social-icons img {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

/* FOOTER MOBILE */
.bottom-nav {
  display: none;
}

/* SECTION HERO */
.hero-section {
  position: relative;
  width: 100vw;  
  height: 300px;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #b1b1b1;
  
}

.hero-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  top: 0;
  left: 0;

}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 120px;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  color: white;
  text-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

.search-bar {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.search-bar input {
  padding: 10px;
  width: clamp(200px, 60vw, 300px);
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

.search-bar button {
  padding: 10px 20px;
  border: none;
  background: #007bff;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.search-bar button:hover {
  background: #0056b3;
}

/* RESPONSIVE MOBILE */
@media screen and (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .sticky-categories {
    top: 70px;
    padding: 10px;
  }

  .bottom-nav {
    display: flex;
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