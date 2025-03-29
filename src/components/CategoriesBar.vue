<template>
  <div class="categories-bar-container">
    <!-- Flèche gauche -->
    <button v-if="isDesktop" class="arrow left" @click="scrollLeft" :disabled="atStart">
      ◀
    </button>

    <!-- Barre des catégories -->
    <div ref="categoriesBar" class="categories-bar">
      <div
        v-for="category in categories"
        :key="category.name"
        :class="['category', selectedCategory === category.filter ? 'active' : '']"
        @click="selectCategory(category)"
      >
        <img :src="category.icon" :alt="category.name" />
        <span>{{ category.name }}</span>
      </div>
    </div>

    <!-- Flèche droite -->
    <button v-if="isDesktop" class="arrow right" @click="scrollRight" :disabled="atEnd">
      ▶
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['categorie-selectionnee'])

const categories = [
  { name: 'Restaurant', icon: '/src/icons/restaurant.png', route: '/restaurants', filter: 'restaurant' },
  { name: 'Activité sur terre', icon: '/src/icons/activite_terre.png', route: '/activites', filter: 'terre' },
  { name: 'Activité en mer', icon: '/src/icons/activite_mer.png', route: '/activites', filter: 'mer' },
  { name: 'Bateau', icon: '/src/icons/bateau.png', route: '/activites', filter: 'bateau' },
  { name: 'Buggy', icon: '/src/icons/buggy.png', route: '/activites', filter: 'buggy' },
  { name: 'Cheval', icon: '/src/icons/cheval.png', route: '/activites', filter: 'cheval' },
  { name: 'Jet Ski', icon: '/src/icons/jetski.png', route: '/activites', filter: 'jetski' },
  { name: 'Kayak', icon: '/src/icons/kayak.png', route: '/activites', filter: 'kayak' },
  { name: 'Parachute', icon: '/src/icons/parachute.png', route: '/activites', filter: 'parachute' },
  { name: 'Avion', icon: '/src/icons/avion.png', route: '/activites', filter: 'avion' },
  { name: 'Plongée', icon: '/src/icons/plongee.png', route: '/activites', filter: 'plongee' },
  { name: 'Quad', icon: '/src/icons/quad.png', route: '/activites', filter: 'quad' },
  { name: 'Randonnée', icon: '/src/icons/randonnee.png', route: '/activites', filter: 'randonnee' },
  { name: 'Ski Nautique', icon: '/src/icons/ski-nautique.png', route: '/activites', filter: 'ski-nautique' },
  { name: 'Tyrolienne', icon: '/src/icons/tyrolienne.png', route: '/activites', filter: 'tyrolienne' },
];

const router = useRouter();
const categoriesBar = ref<HTMLElement | null>(null);
const selectedCategory = ref<string | null>(null);
const scrollAmount = 200;

const isDesktop = computed(() => window.innerWidth >= 1024);
const atStart = ref(true);
const atEnd = ref(false);

const checkScroll = () => {
  if (!categoriesBar.value) return;
  atStart.value = categoriesBar.value.scrollLeft === 0;
  atEnd.value = categoriesBar.value.scrollLeft + categoriesBar.value.clientWidth >= categoriesBar.value.scrollWidth;
};

const scrollLeft = () => {
  if (categoriesBar.value) {
    categoriesBar.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  }
};

const scrollRight = () => {
  if (categoriesBar.value) {
    categoriesBar.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  }
};

onMounted(() => {
  checkScroll();
  window.addEventListener('resize', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll);
});

// Sélectionner une catégorie avec surbrillance et filtre local
const selectCategory = (category: { route: string; filter: string }) => {
  selectedCategory.value = category.filter
  emit('categorie-selectionnee', category.filter)
};
</script>

<style scoped>
.categories-bar-container {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
  box-shadow: 1px 1px 0px #ffffff;
  padding: 10px 0;
}

.categories-bar {
  display: flex;
  gap: 30px;
  padding: 5px 150px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  white-space: nowrap;
  width: 90%;
  max-width: 1100px;
}

.category {
  flex: 0 0 auto;
  text-align: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  opacity: 0.5;
}

.category.active {
  opacity: 1;
  transform: scale(1.1);
}

.category img {
  width: 25px;
  height: 25px;
}

.category span {
  display: block;
  font-size: 16px;
  margin-top: 8px;
  color: #333;
}

.arrow {
  background: white;
  border: none;
  font-size: 15px;
  cursor: pointer;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
  transition: background 0.3s;
}

.arrow:hover {
  background: #ddd;
}

.left {
  left: 5px;
}

.right {
  right: 5px;
}

.arrow:disabled {
  opacity: 0.5;
  cursor: default;
}

@media screen and (max-width: 1024px) {
  .arrow {
    display: none;
  }

  .categories-bar {
    overflow-x: auto;
    padding: 5px 0;
  }

  .categories-bar-container {
  width: 100vw;
  max-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #ffffff;
  box-shadow: 1px 1px 0px #ffffff;
  padding: 10px 0;
}
.category img {
  width: 20px;
  height: 20px;
}
}
</style>