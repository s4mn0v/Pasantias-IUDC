<template>
    <header class="header bg-white shadow p-4 flex items-center">
      <!-- Logo alineado a la izquierda -->
      <div class="flex items-center gap-4">
        <img src="/assets/img/logonegro.png" alt="Logo" class="h-12 w-auto object-contain" />
        
        <!-- Contenedor para el nombre de la empresa -->
        <h1 class="text-xl font-bold uppercase tracking-widest empresa-nombre">
          {{ isLoading ? 'Cargando...' : (empresaNombre || 'Nombre no disponible') }}
        </h1>
      </div>
  
      <!-- Espaciado entre el logo y el menú -->
      <div class="flex-grow"></div>
  
      <!-- Menú de navegación centrado -->
      <nav class="hidden md:flex gap-4 ml-0 items-center">
        <NuxtLink to="/empresa/dashboard" class="text-lg font-semibold text-gray-900 hover:text-purple-500 transition">
          Inicio
        </NuxtLink>
        <NuxtLink to="/empresa/reportes" class="text-lg font-semibold text-gray-900 hover:text-purple-500 transition">
          Reportes
        </NuxtLink>
  
        <!-- Botón de Cerrar Sesión en el lado derecho -->
        <div class="hidden md:flex ">
          <button @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-full transition-colors duration-200 justify-center items-center flex"  title="Cerrar sesion">
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
    </header>
  
    <!-- Navegación móvil -->
    <div v-if="isMenuOpen" class="md:hidden mt-4 space-y-2 px-4">
      <NuxtLink to="/empresa/dashboard"
        class="block text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
        Inicio
      </NuxtLink>
      <NuxtLink to="/empresa/reportes" class="block text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
        Reportes
      </NuxtLink>
      <NuxtLink to="/empresa/pasantes" class="block text-lg font-semibold text-gray-700 hover:text-purple-500 transition">
        Pasantes
      </NuxtLink>
      <button @click="logout"
        class="w-full text-left bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 mt-2" title="Cerrar sesion">
        Cerrar Sesión
      </button>
    </div>
  
    <!-- Mensaje de error -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthOperations } from '~/composables/useAuthOperations';
  import { useFirestoreOperations } from '~/composables/useFirestoreOperations';
  import { useCurrentUser } from 'vuefire';
  
  const { logout } = useAuthOperations();
  const { getEmpresas } = useFirestoreOperations();
  const user = useCurrentUser();
  
  const empresaNombre = ref('');
  const error = ref(null);
  const isLoading = ref(true);
  const isMenuOpen = ref(false);
  
  onMounted(async () => {
    try {
      if (user.value) {
        const empresas = await getEmpresas();
        const empresaActual = empresas.find(empresa => empresa.id === user.value.uid);
        if (empresaActual) {
          empresaNombre.value = empresaActual.nombre;
        } else {
          error.value = 'No se encontró la empresa asociada al usuario actual';
        }
      } else {
        error.value = 'No hay usuario autenticado';
      }
    } catch (e) {
      console.error('Error en onMounted:', e);
      error.value = `Error al cargar los datos: ${e.message}`;
    } finally {
      isLoading.value = false;
    }
  });
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  </script>
  
  <style scoped>
  /* Estilos para truncar el nombre de la empresa */
  .empresa-nombre {
    max-width: 200px;  /* Limita el ancho del contenedor */
    white-space: nowrap; /* Evita el salto de línea */
    overflow: hidden; /* Esconde el texto que no cabe */
    text-overflow: ellipsis; /* Muestra "..." cuando el texto es demasiado largo */
  }
  </style>
  