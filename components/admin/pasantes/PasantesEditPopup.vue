<!-- components/admin/pasantes/PasantesEditPopup.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0" style="margin: 0;">
        <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">Editar Pasante</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div v-for="field in ['nombre', 'cedula', 'correo', 'semestre', 'celular']" :key="field">
                    <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
                        {{ field.charAt(0).toUpperCase() + field.slice(1) }}
                    </label>
                    <input :id="field" v-model="formData[field]" :type="field === 'correo' ? 'email' : 'text'" required
                        class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
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
                <div class="flex space-x-4">
                    <button type="submit"
                        class="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700">
                        Guardar Cambios
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

const props = defineProps({
    pasante: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update-pasante', 'close']);

const formData = reactive({ ...props.pasante });

const submitForm = () => {
    emit('update-pasante', { ...formData });
};
</script>