<template>
    <div class="account-container" v-if="user">
                  <!-- 🔵 Logo cliquable -->
                  <router-link to="/" class="logo-link">
      <img src="/icons/Logo_KreyolKwest.png" alt="KreyolKwest" class="logo-img" />
    </router-link>
      <h2>Mon compte</h2>
      <p><strong>Pseudo :</strong> {{ user.pseudo }}</p>
      <p><strong>Email :</strong> {{ user.email }}</p>
      <p><strong>Téléphone :</strong> {{ user.telephone }}</p>
      <p><strong>Identifiant :</strong> {{ user.identifiant }}</p>
  
      <div class="edit-section">
        <h3>Modifier mes informations</h3>
        <form @submit.prevent="updateInfos">
          <input v-model="newPseudo" placeholder="Nouveau pseudo" />
          <input v-model="newEmail" placeholder="Nouvel email" />
          <input v-model="newIdentifiant" placeholder="Nouvel identifiant" />
          <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe" />
          <button type="submit">Mettre à jour</button>
        </form>
      </div>
  
      <button class="logout-btn" @click="logout">Se déconnecter</button>
      <button class="delete-btn" @click="confirmDelete">Supprimer mon compte</button>
  
      <!-- ✅ Popup de confirmation -->
      <div class="popup-overlay" v-if="showConfirm">
        <div class="popup">
          <p>Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.</p>
          <button class="confirm" @click="deleteAccount">Oui, supprimer</button>
          <button class="cancel" @click="showConfirm = false">Annuler</button>
        </div>
      </div>
  
      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="erreur" class="error">{{ erreur }}</p>
    </div>
  
    <div v-else class="loading">
      Chargement des informations...
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
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '../api/api'
  
  const router = useRouter()
  const user = ref(null)
  const newPseudo = ref('')
  const newEmail = ref('')
  const newIdentifiant = ref('')
  const newPassword = ref('')
  const message = ref('')
  const erreur = ref('')
  const showConfirm = ref(false)
  const goTo = (r) => router.push(r)
  
  const getUser = async () => {
    try {
      const token = localStorage.getItem('token')
      console.log('TOKEN:', token)
      if (!token) return router.push('/connexion')
  
      const res = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('USER:', res.data)
      user.value = res.data
    } catch (err) {
      console.error('Erreur getUser', err.response?.data || err)
      router.push('/connexion')
    }
  }
  
  const updateInfos = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/connexion')
  
      const res = await api.put(
        `/users/${user.value._id}`,
        {
          pseudo: newPseudo.value,
          email: newEmail.value,
          identifiant: newIdentifiant.value,
          motDePasse: newPassword.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
  
      message.value = 'Informations mises à jour avec succès.'
      erreur.value = ''
      newPseudo.value = ''
      newEmail.value = ''
      newIdentifiant.value = ''
      newPassword.value = ''
      await getUser()
    } catch (err) {
      erreur.value = err.response?.data?.message || "Erreur lors de la mise à jour"
      message.value = ''
    }
  }
  
  const logout = () => {
    localStorage.removeItem('token')
    router.push('/connexion')
  }
  
  const confirmDelete = () => {
    showConfirm.value = true
  }
  
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return router.push('/connexion')
  
      await api.delete(`/users/${user.value._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      localStorage.removeItem('token')
      router.push('/connexion')
    } catch (err) {
      erreur.value = err.response?.data?.message || "Erreur lors de la suppression"
    }
  }
  onMounted(getUser)
  </script>
  
  <style scoped>
  .account-container {
    max-width: 500px;
    margin: 60px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: left;
    background: #fff;
  }
  /* 🔵 Logo */
.logo-link {
  display: block;
  margin-bottom: 0px;
}
.logo-img {
  height: 200px;
  margin: 0  auto;
  text-align: center;
}
  .edit-section {
    margin-top: 30px;
  }
  
  input {
    display: block;
    margin: 10px 0;
    padding: 10px;
    width: 90%;
  }
  
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    gap: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
   
  }
  
  .logout-btn {
    margin-top: 20px;
    background-color: #6c757d;
   
    margin-right: 150px;
    
  }
  
  .logout-btn:hover {
    background-color: #545b62;
  }
  
  .delete-btn {
    margin-top: 10px;
    background-color: #dc3545;
  }
  
  .delete-btn:hover {
    background-color: #b02a37;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .message {
    color: green;
    margin-top: 10px;
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
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-width: 350px;
  }
  
  .popup button {
    margin: 10px;
  }
  
  .popup .confirm {
    background-color: #dc3545;
  }
  
  .popup .cancel {
    background-color: #6c757d;
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