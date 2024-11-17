<!-- components/admin/pasantes/PasantesSearch.vue -->
<template>
    <input v-model="searchTerm" @input="emitSearch" type="text" placeholder="Buscar por nombre o cédula"
        class="w-full px-3 py-2 mb-6 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
</template>

<script setup>
import { ref, watch } from 'vue';

const searchTerm = ref('');
const emit = defineEmits(['search']);

const emitSearch = () => {
    emit('search', searchTerm.value);
};

watch(searchTerm, emitSearch);
</script>