<template>
    <div class="auth-container">
          <!-- 🔵 Logo cliquable -->
    <router-link to="/" class="logo-link">
      <img src="/icons/Logo_KreyolKwest.png" alt="KreyolKwest" class="logo-img" />
    </router-link>
      <h2>Connexion</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="identifiant" type="text" placeholder="Identifiant" required />
        <input v-model="motDePasse" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
  
      <p class="switch">Pas encore de compte ?
        <router-link to="/inscription">Créer un compte</router-link>
      </p>
  
      <p v-if="erreur" class="error">{{ erreur }}</p>
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
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '../api/api'
  
  const router = useRouter()
  const identifiant = ref('')
  const motDePasse = ref('')
  const erreur = ref('')
  const goTo = (r) => router.push(r)
  
  const handleLogin = async () => {
    try {
      const res = await api.post('/api/users/login', { identifiant: identifiant.value, motDePasse: motDePasse.value })
      localStorage.setItem('token', res.data.token)
      router.push('/compte')
    } catch (err) {
      erreur.value = err.response?.data?.message || 'Erreur lors de la connexion.'
    }
  }
  </script>
  
  <style scoped>
  .auth-container {
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
  margin-bottom: 0px;
}
.logo-img {
  height: 200px;
  margin: 0 auto;
  text-align: center;
}


  input {
    display: block;
    margin: 10px auto;
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
  
  .switch {
    margin-top: 15px;
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