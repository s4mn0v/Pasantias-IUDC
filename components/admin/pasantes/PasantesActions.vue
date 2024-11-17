<!-- components/admin/pasantes/PasantesActions.vue -->
<template>
    <div class="flex space-x-4 mb-6">
        <button @click="$emit('add-pasante')"
            class="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out flex items-center justify-center"
            title="Agregar un nuevo pasante">
            <Icon name="uil:user-plus" class="w-5 h-5 mr-4"/>
            Agregar Pasante
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