<!-- components/admin/pasantes/PasantesAddPopup.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0">
        <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
            <h2 class="text-2xl font-bold mb-4">Agregar Pasante</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
                <!-- Campos del formulario -->
                <div v-for="field in ['nombre', 'cedula', 'correo', 'semestre', 'celular']" :key="field">
                    <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
                        {{ field.charAt(0).toUpperCase() + field.slice(1) }}
                    </label>
                    <input :id="field" v-model="formData[field]" :type="field === 'correo' ? 'email' : 'text'" required
                        class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <!-- Campo para seleccionar la carrera -->
                <div>
                    <label for="carrera" class="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
                    <select id="carrera" v-model="formData.carrera" required
                        class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="" disabled selected>Selecciona una carrera</option>
                        <option value="Veterinaria">Veterinaria</option>
                        <option value="Ing. Software">Ing. Software</option>
                        <option value="Ing. Sistemas">Ing. Sistemas</option>
                        <option value="Ing. Industrial">Ing. Industrial</option>
                        <option value="Derecho">Derecho</option>
                    </select>
                </div>

                <!-- Botones -->
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
    carrera: '',  // Se asegura de que la carrera sea parte del formulario
    semestre: '',
    celular: ''
});

const submitForm = () => {
    emit('add-pasante', { ...formData });
};
</script>
