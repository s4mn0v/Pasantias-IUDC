<!-- components/admin/pasantes/PasantesAddPopup.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">Agregar Pasante</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div v-for="field in ['nombre', 'cedula', 'correo', 'carrera', 'semestre', 'celular']" :key="field">
                    <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
                        {{ field.charAt(0).toUpperCase() + field.slice(1) }}
                    </label>
                    <input :id="field" v-model="formData[field]" :type="field === 'correo' ? 'email' : 'text'" required
                        class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div class="flex space-x-4">
                    <button type="submit"
                        class="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700">
                        Agregar Pasante
                    </button>
                    <button @click="$emit('close')" type="button"
                        class="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['add-pasante', 'close']);

const formData = reactive({
    nombre: '',
    cedula: '',
    correo: '',
    carrera: '',
    semestre: '',
    celular: ''
});

const submitForm = () => {
    emit('add-pasante', { ...formData });
};
</script>