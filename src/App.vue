<template>
  <div id="app">


    <div class="body-content">
      <router-view />
    </div>

  </div>
  <FooterGlobal />
</template>

<script setup lang="ts">
import FooterGlobal from './components/FooterGlobal.vue'
//import { computed } from 'vue';
//import { useRoute } from 'vue-router';

//import CategoriesBar from './components/CategoriesBar.vue';

//const route = useRoute();
//const _isHomePage = computed(() => route.path === '/');


// rajouter dans #app dans style cette ligne pour le fond crème
// background-color:rgb(255, 218, 179);
</script>



<style>
#app {
  font-family: Arial, sans-serif;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  background-color:rgb(243, 243, 243);
}
.footer-global {
  width: 100vw;
  background-color: #e87c3f;
  color: white;
  padding: 20px 0;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  box-sizing: border-box;
}


/* Empêche le scroll horizontal */
html, body {
  overflow-x: hidden;
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: start;
}





/* Contenu principal */
.body-content {
  width: 100%;
  margin: 0 auto;
  text-align: center;
  margin-top: 20px;
}

/* Mobile */
@media screen and (max-width: 768px) {
  #app {
    max-width: 100%;
  }

}


@media (prefers-color-scheme: dark) {
  body {
    background-color: rgb(255, 224, 199) !important;
    color: black !important;
  }

  input, textarea, select, button {
    background-color: rgb(255, 255, 255) !important;
    color: rgb(255, 218, 179) !important;
    border: 1px solid #ccc;
  }

  .popup,
  .popup input,
  .popup select {
    background-color: rgb(255, 218, 179)!important;
    color: black !important;
  }

  .tab-content,
  .auth-container,
  .gestion-card {
    background-color: rgb(255, 218, 179) !important;
    color: black !important;
  }
}
</style>