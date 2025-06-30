<template>
    <footer class="footer-global">
      <!-- Version desktop -->
      <div class="footer-desktop desktop-only">
        <div class="footer-columns">
          <div>
            <h3>À propos</h3>
            <ul>
              <li><a href="#">Notre histoire</a></li>
              <li><a href="#">Équipe</a></li>
              <button class="contact-btn" @click="goTo('/contact')">Nous contacter</button>
            </ul>
          </div>
          <div>
            <h3>Explorer</h3>
            <ul>
             
              <button class="contact-btn" @click="goTo('/Home')">Activités </button>
              <button class="contact-btn" @click="goTo('/Home')">Restaurants </button>

              <button class="contact-btn" @click="goTo('/Conseil')">Conseils de voyage </button>
              <button class="contact-btn" @click="goTo('/Confidentialite')">Confidentialité </button>
            </ul>
          </div>
          <div>
            <h3>Partenaires</h3>
            <ul>
              <li><a href="#">Devenir partenaire</a></li>
              <li><a href="#">Accès API</a></li>
            </ul>
          </div>
          <div>
            <h3>Nous suivre</h3>
            <div class="social-icons">
                <a href="https://www.instagram.com/kreyolkwest_martinique" target="_blank">
          <img src="/icons/instagram.png" alt="Instagram" />
        </a>
        <a href="https://whatsapp.com/channel/0029VaFflWGGzzKLLltJi21U" target="_blank">
          <img src="/icons/whatsapp.png" alt="WhatsApp" />
        </a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2025 KreyolKwest. Tous droits réservés.</p>
          <div class="legal-links">
            <button class="contact-btn" @click="goTo('/CGU')">Conditions d'utilisation</button>
            
            <button class="contact-btn" @click="goTo('/Confidentialite')">Confidentialité </button>
            
            <button class="contact-btn" @click="goTo('/Accessibilite')">Accessibilité </button>
          </div>
        </div>
      </div>
  
      <!-- Version mobile -->
      <div class="footer-mobile mobile-only">
        <p>© 2025 KreyolKwest</p>
        <div class="social-icons">
            <a href="https://www.instagram.com/kreyolkwest_martinique" target="_blank">
          <img src="/icons/instagram.png" alt="Instagram" />
        </a>
        <a href="https://whatsapp.com/channel/0029VaFflWGGzzKLLltJi21U" target="_blank">
          <img src="/icons/whatsapp.png" alt="WhatsApp" />
        </a>

        </div>
        <div class="footer-bottom">
          <div class="legal-links">
            <button class="contact-btn" @click="goTo('/CGU')">Conditions d'utilisation</button>
            
            <button class="contact-btn" @click="goTo('/Confidentialite')">Confidentialité </button>
            
            <button class="contact-btn" @click="goTo('/Accessibilite')">Accessibilité </button>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
 import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/api'
import NavBar from '../components/NavBar.vue';

const route = useRoute()
const router = useRouter()
  const goTo = (r) => router.push(r)
  </script>
  
  <style scoped>
  .footer-global {
    background-color: #dd7f40;
    color: #f9f9f9;
    padding: 40px 40px;
    font-size: 14px;
  }
  
  .footer-columns {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: auto;
    gap: 20px;
  }
  
  .footer-columns h3 {
    margin-bottom: 10px;
  }
  
  .footer-columns ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-columns li {
    margin-bottom: 6px;
  }
  
  .footer-columns a {
    color: #ffffff;
    text-decoration: none;
  }
  
  .footer-columns a:hover {
    text-decoration: underline;
  }
  
  .footer-bottom {
    margin-top: 30px;
    text-align: center;
  }

  button {
  
 
  background: #ff770000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
  
  .legal-links a {
    margin: 0 10px;
    text-decoration: none;
    color: #333;
  }
  
  .social-icons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .social-icons img {
    width: 24px;
    height: 24px;
  }
  
  /* Mobile version */
  .footer-mobile {
    text-align: center;
    padding: 20px 10px;
  }
  
  @media screen and (max-width: 768px) {
    .desktop-only {
      display: none;
    }
    .mobile-only {
      display: block;
    }
  }
  .social-icons {
    justify-content: center;
  }
  .social-icons img {
    width: 30px;
    height: 30px;
  }
  
  @media screen and (min-width: 769px) {
    .mobile-only {
      display: none;
    }
  }
  </style>