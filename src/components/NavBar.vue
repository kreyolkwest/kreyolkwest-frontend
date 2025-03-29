<template>
  <nav class="navbar">
    <!-- Logo + Recherche -->
    <div class="left-section">
      <div class="logo" @click="goTo('/')">
        <img src="/Logo_KreyolKwest.png" alt="KreyolKwest" />
      </div>

      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher une activité ou un restaurant..."
        />
        <button @click="search">
          <img src="/src/icons/search.png" alt="Rechercher" />
        </button>
      </div>
    </div>

    <!-- Boutons desktop uniquement -->
    <div class="nav-buttons desktop-only">
      <button @click="goTo('/reservations')">My Activlist</button>
      <button @click="goToCompte">Mon compte</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAuthenticated } from '../utils/auth.js'

const goToCompte = () => {
  if (isAuthenticated()) {
    router.push('/compte')
  } else {
    router.push('/connexion')
  }
}

const router = useRouter()
const searchQuery = ref('')

const goTo = (route: string) => {
  router.push(route)
}

const search = () => {
  if (searchQuery.value) {
    router.push(`/search?q=${searchQuery.value}`)
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px 30px;
  box-shadow: 1px 1px 0px #e6e6e6;
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-wrap: wrap;
  box-sizing: border-box;
  gap: 20px;
}

.left-section {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 20px;
  min-width: 300px;
}

.logo img {
  height: 45px;
  cursor: pointer;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  padding: 6px 10px;
  border-radius: 6px;
}

.search-bar input {
  flex: 1;
  padding: 8px;
  font-size: 15px;
  border: none;
  background: transparent;
  outline: none;
}

.search-bar button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}

.search-bar button img {
  width: 20px;
  height: 20px;
}

/* Boutons desktop uniquement */
.nav-buttons {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.nav-buttons button {
  padding: 10px 16px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.nav-buttons button:hover {
  background-color: #0056b3;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 10px 20px;
  }

  .left-section {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .search-bar {
    flex: 1;
    margin-top: 10px;
  }

  .search-bar input {
    width: 100%;
  }
}
</style>