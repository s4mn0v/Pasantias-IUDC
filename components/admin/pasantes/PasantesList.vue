<!-- components/admin/pasantes/PasantesList.vue -->
<template>
    <div class="space-y-4">
        <div v-for="pasante in pasantes" :key="pasante.id" class="bg-gray-200 rounded-md p-4 shadow-md">
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-lg font-semibold text-gray-800">
                    {{ pasante.nombre }} - {{ pasante.cedula }}
                </h2>
                <div class="space-x-2 flex">
                    <button @click="openEditPopup(pasante)"
                        class="flex items-center justify-center px-4 py-1 text-white bg-blue-600 rounded-full border border-blue-600 hover:text-blue-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        title="Editar pasante">
                        <Icon name="uil:edit" class="w-5 h-5" />
                    </button>
                    <button @click="confirmDelete(pasante.id)"
                        class="flex items-center justify-center px-4 py-1 text-white bg-red-600 rounded-full border border-red-600 hover:text-red-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                        title="Eliminar pasante">
                        <Icon name="uil:trash-alt" class="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p class="text-gray-700 flex items-center">
                <Icon name="uil:graduation-cap" class="mr-2 text-purple-600" />
                {{ pasante.carrera }} - Semestre {{ pasante.semestre }}
            </p>
            <p class="text-gray-700 flex items-center">
                <Icon name="uil:envelope" class="mr-2 text-purple-600" />
                {{ pasante.correo }}
            </p>
            <p class="text-gray-700 flex items-center">
                <Icon name="uil:phone" class="mr-2 text-purple-600" />
                {{ pasante.celular }}
            </p>
            <p v-if="pasante.empresaId" class="text-gray-700 flex items-center">
                <Icon name="uil:briefcase" class="mr-2 text-purple-600" />
                Empresa actual: {{ empresas.find(e => e.id === pasante.empresaId)?.nombre }}
            </p>
            <div class="mt-2 flex items-center space-x-4">
                <button @click="openAssignCompanyPopup(pasante)"
                    class="bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 flex items-center justify-center h-9"
                    :title="pasante.empresaId ? 'Cambiar Empresa' : 'Asignar Empresa'">
                    <Icon :name="pasante.empresaId ? 'uil:sync' : 'uil:building'" class="mr-2" />
                    {{ pasante.empresaId ? 'Cambiar Empresa' : 'Asignar Empresa' }}
                </button>

                <button v-if="pasante.empresaId" @click="$emit('remove-empresa', pasante.id, pasante.empresaId)"
                    class="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 flex items-center justify-center h-9">
                    <Icon name="uil:trash-alt" class="mr-2" />
                    Remover de empresa
                </button>
            </div>

        </div>
        <PasantesAssignCompanyPopup v-if="showAssignCompanyPopup" :empresas="empresas" @assign-empresa="assignEmpresa"
            @close="showAssignCompanyPopup = false" />
        <PasantesEditPopup v-if="showEditPopup" :pasante="currentPasante" @update-pasante="updatePasante"
            @close="showEditPopup = false" />
        <div v-if="showDeleteConfirmation"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0" style="margin: 0;">
            <div class="bg-white p-8 rounded-lg shadow-xl">
                <h2 class="text-2xl font-bold mb-4">Confirmar Eliminación</h2>
                <p class="mb-4">¿Está seguro de que desea eliminar este pasante?</p>
                <div class="flex space-x-4">
                    <button @click="deleteConfirmed"
                        class="flex-1 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">
                        Eliminar
                    </button>
                    <button @click="showDeleteConfirmation = false"
                        class="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PasantesAssignCompanyPopup from './PasantesAssignCompanyPopup.vue';
import PasantesEditPopup from './PasantesEditPopup.vue';

const props = defineProps({
    pasantes: {
        type: Array,
        required: true
    },
    empresas: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['edit', 'delete', 'assign-empresa', 'remove-empresa']);

const showAssignCompanyPopup = ref(false);
const showEditPopup = ref(false);
const showDeleteConfirmation = ref(false);
const currentPasante = ref(null);
const pasanteToDeleteId = ref(null);

const openAssignCompanyPopup = (pasante) => {
    currentPasante.value = pasante;
    showAssignCompanyPopup.value = true;
};

const openEditPopup = (pasante) => {
    currentPasante.value = pasante;
    showEditPopup.value = true;
};

const assignEmpresa = (empresa) => {
    emit('assign-empresa', currentPasante.value.id, empresa.id, empresa.nombre);
    showAssignCompanyPopup.value = false;
};

const updatePasante = (updatedPasante) => {
    emit('edit', updatedPasante);
    showEditPopup.value = false;
};

const confirmDelete = (pasanteId) => {
    pasanteToDeleteId.value = pasanteId;
    showDeleteConfirmation.value = true;
};

const deleteConfirmed = () => {
    emit('delete', pasanteToDeleteId.value);
    showDeleteConfirmation.value = false;
};
</script>