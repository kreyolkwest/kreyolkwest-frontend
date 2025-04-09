<template>
  <div class="admin-gestion">
    <h2>⚙️ Ajout & Gestion</h2>

    <!-- Sélecteur de type -->
    <div class="form-type-selector">
      <label>Ajouter :</label>
      <select v-model="type">
        <option value="">-- Choisir --</option>
        <option value="etablissement">Etablissement</option>
        <option value="restaurant">Restaurant</option>
        <option value="activite">Activité</option>
      </select>
    </div>

    <!-- Formulaire dynamique selon le type -->
    <form v-if="type" @submit.prevent="submitForm">
      <input v-model="form.nom" placeholder="Nom" required />
      <textarea v-model="form.description" placeholder="Description" required></textarea>
      <input v-model="form.telephone" placeholder="Téléphone" required />
      <input v-model="form.horaires" placeholder="Horaires d'ouverture" required />
      <input v-model="form.capacite" type="number" placeholder="Capacité max" />
      <input v-model="form.imagesInput" placeholder="Lien(s) image(s), séparés par des virgules" />
      <input v-model="form.videosInput" placeholder="Lien(s) vidéo(s), séparés par des virgules" />
      <button type="submit">Ajouter {{ type }}</button>
    </form>

    <!-- Liste pour suppression -->
    <div v-if="type" class="gestion-liste">
      <h3>Liste des {{ type }}s</h3>
      <div v-for="item in liste" :key="item._id" class="gestion-card">
        <p><strong>{{ item.nom }}</strong></p>
        <button @click="supprimerItem(item._id)">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '../api/api'

const type = ref('')
const form = ref({
  nom: '',
  description: '',
  telephone: '',
  horaires: '',
  capacite: '',
  imagesInput: '',
  videosInput: ''
})
const liste = ref([])

const endpointMap = {
  activite: 'activities',
  restaurant: 'restaurants',
  etablissement: 'etablissements'
}

const chargerListe = async () => {
  if (!type.value) return
  const endpoint = endpointMap[type.value]
  if (!endpoint) return

  try {
    const res = await api.get(`/api/${endpoint}`)
    liste.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement', err)
  }
}

watch(type, () => {
  chargerListe()
})

const submitForm = async () => {
  try {
    const images = form.value.imagesInput.split(',').map(url => url.trim()).filter(Boolean)
    const videos = form.value.videosInput.split(',').map(url => url.trim()).filter(Boolean)

    const medias = [
      ...images.map(url => ({ type: 'image', url })),
      ...videos.map(url => ({ type: 'video', url }))
    ]

    const payload = {
      nom: form.value.nom,
      presentation: form.value.description,
      telephone: form.value.telephone,
      horaires: form.value.horaires,
      limiteNombrePers: form.value.capacite,
      medias
    }

    await api.post(`/api/${type.value}s`, payload)

    alert(`${type.value} ajouté avec succès !`)
    form.value = {
      nom: '',
      description: '',
      telephone: '',
      horaires: '',
      capacite: '',
      imagesInput: '',
      videosInput: ''
    }
    chargerListe()
  } catch (err) {
    console.error(err)
    alert('Erreur lors de l\'ajout')
  }
}

const supprimerItem = async (id) => {
  if (!confirm('Confirmer la suppression ?')) return
  try {
    await api.delete(`/api/${type.value}s/${id}`)
    alert('Supprimé !')
    chargerListe()
  } catch (err) {
    console.error(err)
    alert('Erreur lors de la suppression')
  }
}
</script>

<style scoped>
.admin-gestion {
  padding: 20px;
}

.form-type-selector {
  margin-bottom: 20px;
}

form {
  background: #f2f2f2;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gestion-liste {
  display: grid;
  gap: 10px;
}

.gestion-card {
  background: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>