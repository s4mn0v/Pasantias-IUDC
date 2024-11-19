<!-- components/admin/pasantes/PasantesPagination.vue -->
<template>
    <div class="flex items-center justify-between mt-6 px-4">
      <!-- Información de elementos -->
      <div class="text-sm text-gray-700">
        Mostrando
        <span class="font-medium">{{ startItem }}</span>
        -
        <span class="font-medium">{{ endItem }}</span>
        de
        <span class="font-medium">{{ totalItems }}</span>
        elementos
      </div>
  
      <!-- Controles de paginación -->
      <nav class="flex items-center space-x-1" role="navigation" aria-label="Navegación de páginas">
        <!-- Botón Anterior -->
        <button
          @click="$emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 rounded-md text-sm transition-colors duration-200"
          :class="[
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
          ]"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
  
        <!-- Páginas -->
        <div class="flex items-center space-x-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('page-change', page)"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200',
              currentPage === page
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
            ]"
          >
            {{ page }}
          </button>
        </div>
  
        <!-- Botón Siguiente -->
        <button
          @click="$emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-md text-sm transition-colors duration-200"
          :class="[
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
          ]"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true,
      default: 10
    },
    totalItems: {
      type: Number,
      required: true
    }
  });
  
  defineEmits(['page-change']);
  
  // Calcular páginas visibles (siempre 3)
  const visiblePages = computed(() => {
    const pages = [];
    let start = props.currentPage - 1;
    
    // Ajustar el inicio si estamos en los extremos
    if (start < 1) start = 1;
    if (start > props.totalPages - 2) start = props.totalPages - 2;
    if (start < 1) start = 1; // Por si totalPages es menor a 3
    
    // Agregar hasta 3 páginas
    for (let i = start; i <= Math.min(start + 2, props.totalPages); i++) {
      pages.push(i);
    }
    
    return pages;
  });
  
  // Calcular información de elementos mostrados
  const startItem = computed(() => 
    ((props.currentPage - 1) * props.itemsPerPage) + 1
  );
  
  const endItem = computed(() => 
    Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
  );
  </script>