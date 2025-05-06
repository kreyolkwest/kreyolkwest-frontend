<template>
    <div class="construction-page">
      <img src="/icons/Logo_KreyolKwest.png" alt="Logo KreyolKwest" class="logo" />
      <h1>🚧 Site en construction</h1>
      <p>Nous préparons quelque chose d’incroyable pour vous en Martinique…</p>
      <p>Revenez très bientôt !</p>
      <button @click="contact">Nous contacter</button>
    </div>
  </template>
  
  <script setup>
  const contact = () => {
    window.location.href = 'mailto:kreyolkwest.gestion@gmail.com'
  }
  </script>
  
  <style scoped>
  .construction-page {
    min-height: 100vh;
    background: #f7e5c6;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
  }
  
  .logo {
    width: 180px;
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.2rem;
    margin: 5px 0;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #007bff;
    border: none;
    color: white;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>