<template>
    <header class="header bg-white shadow p-4">
      <div class="container mx-auto flex items-center justify-between">
        <!-- Logo / Título -->
        <div class="flex items-center gap-4">
          <NuxtLink to="/admin/dashboard" class="text-2xl font-bold text-fuchsia-950 uppercase tracking-widest">
            <img src="/assets/img/logonegro.png" alt="Logo" class="h-12 w-auto object-contain" />
          </NuxtLink>
        </div>
  
        <!-- Espaciado entre el logo y el menú -->
        <div class="flex-grow"></div>
  
        <!-- Navegación de Escritorio centrada -->
        <nav class="hidden md:flex gap-4 items-center">
          <NuxtLink to="/admin/dashboard" class="text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
            Inicio
          </NuxtLink>
          <NuxtLink to="/admin/empresas" class="text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
            Empresas
          </NuxtLink>
          <NuxtLink to="/admin/pasantes" class="text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
            Pasantes
          </NuxtLink>
  
          <!-- Botón de Cerrar Sesión en Escritorio -->
          <div class="hidden md:flex">
            <button @click="logout"
              class="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full transition-colors duration-200 justify-center items-center flex">
              <Icon name="uil:exit" class="w-5 h-5" />
            </button>
          </div>
        </nav>
  
        <!-- Botón para abrir el menú móvil -->
        <button @click="toggleMenu" class="md:hidden p-2 text-gray-700 hover:text-purple-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
  
      <!-- Navegación Móvil -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 space-y-2 px-4">
        <NuxtLink to="/admin/dashboard"
          class="block text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
          Inicio
        </NuxtLink>
        <NuxtLink to="/admin/empresas" class="block text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
          Empresas
        </NuxtLink>
        <NuxtLink to="/admin/pasantes" class="block text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
          Pasantes
        </NuxtLink>
        <button @click="logout"
          class="w-full text-left bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 mt-2 items-center flex">
          Cerrar Sesión
          <Icon name="uil:exit" class="w-5 h-5" />
        </button>
      </div>
    </header>
  </template>
  <script>
  import { ref } from 'vue';
  import { useAuthOperations } from '~/composables/useAuthOperations';
  
  export default {
    setup() {
      const { logout } = useAuthOperations();
      const isMenuOpen = ref(false);
  
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
      };
  
      return {
        isMenuOpen,
        toggleMenu,
        logout,
      };
    },
  };
  </script>
  