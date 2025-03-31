<template>
    <div class="reset-container">
      <!-- 🔵 Logo -->
      <router-link to="/" class="logo-link">
        <img src="/icons/Logo_KreyolKwest.png" alt="KreyolKwest" class="logo-img" />
      </router-link>
  
      <h2>Réinitialisation du mot de passe</h2>
  
      <form v-if="!success" @submit.prevent="submitPassword">
        <input
          v-model="motDePasse"
          type="password"
          placeholder="Nouveau mot de passe"
          required
        />
        <button type="submit">Définir le mot de passe</button>
        <p v-if="erreur" class="error">{{ erreur }}</p>
      </form>
  
      <p v-if="success" class="success">
        ✅ Mot de passe modifié avec succès ! Redirection en cours...
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import api from '../api/api'
  
  const route = useRoute()
  const router = useRouter()
  
  const motDePasse = ref('')
  const erreur = ref('')
  const success = ref(false)
  
  const submitPassword = async () => {
    erreur.value = ''
    try {
      await api.post(`/api/users/reset-password/${route.params.token}`, {
        motDePasse: motDePasse.value,
      })
      success.value = true
      setTimeout(() => router.push('/connexion'), 2000)
    } catch (err) {
      erreur.value = err.response?.data?.message || 'Erreur lors de la réinitialisation.'
    }
  }
  </script>
  
  <style scoped>
  .reset-container {
    max-width: 400px;
    margin: 80px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: center;
  }
  
  /* 🔵 Logo */
  .logo-link {
    display: block;
    margin-bottom: 20px;
  }
  .logo-img {
    height: 150px;
    margin: 0 auto;
  }
  
  input {
    display: block;
    margin: 15px auto;
    padding: 10px;
    width: 90%;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .success {
    color: green;
    font-weight: bold;
    margin-top: 20px;
  }
  </style>