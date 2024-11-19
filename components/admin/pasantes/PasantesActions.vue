<!-- components/admin/pasantes/PasantesActions.vue -->
<template>
    <div class="flex space-x-4 mb-6">
        <button @click="$emit('add-pasante')"
            class="fflex-1 bg-purple-600 text-white font-bold py-1 px-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out flex items-center justify-center"
            title="Agregar un nuevo pasante">
            <!-- Icono que siempre se muestra -->
            <Icon name="uil:user-plus" class="w-5 h-5 mr-2" />

            <!-- Texto visible solo en pantallas grandes y oculto en móviles -->
            <span class="hidden sm:inline-block">Agregar Pasante</span>

            <!-- Texto visible solo en pantallas pequeñas (móviles) -->
            <span class="inline-block sm:hidden">Agregar</span>
        </button>
        <button @click="$emit('upload-xlsx')"
            class="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 ease-in-out flex items-center justify-center"
            title="Cargar archivo XLSX">
            <Icon name="uil:file-upload" class="w-5 h-5 mr-4" />
            Cargar XLSX
        </button>
    </div>
</template>

<script setup>
defineEmits(['add-pasante', 'upload-xlsx']);
</script>