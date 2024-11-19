<template>
    <div class="space-y-4">
        <div v-for="pasante in pasantes" :key="pasante.id" class="bg-gray-200 rounded-md p-4 shadow-md">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h2 class="text-lg font-semibold text-gray-800">
                    {{ pasante.nombre }}<span class="hidden sm:inline"> - {{ pasante.cedula }}</span>
                </h2>

                <!-- Desplegable con opciones -->
                <div class="relative">
                    <button @click="toggleDropdown(pasante.id)" class="text-gray-800 focus:outline-none"
                        title="Opciones">
                        <Icon name="uil:ellipsis-h" class="w-6 h-6" />
                    </button>

                    <!-- Menú desplegable -->
                    <div v-if="dropdownVisibility[pasante.id]"
                        class="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <ul class="py-1">
                            <li>
                                <button @click="openEditPopup(pasante)"
                                    class="block px-4 py-2 text-gray-700 w-full text-left hover:bg-gray-200"
                                    title="Editar pasante">
                                    Editar
                                </button>
                            </li>
                            <li>
                                <button @click="confirmDelete(pasante.id)"
                                    class="block px-4 py-2 text-gray-700 w-full text-left hover:bg-gray-200"
                                    title="Eliminar pasante">
                                    Eliminar
                                </button>
                            </li>

                            <!-- Cambiar el texto según si el pasante tiene o no empresa asignada -->
                            <li v-if="!pasante.empresaId">
                                <button @click="openAssignCompanyPopup(pasante)"
                                    class="block px-4 py-2 text-gray-700 w-full text-left hover:bg-gray-200"
                                    title="Asignar empresa">
                                    Asignar Empresa
                                </button>
                            </li>
                            <li v-else>
                                <button @click="$emit('remove-empresa', pasante.id, pasante.empresaId)"
                                    class="block px-4 py-2 text-gray-700 w-full text-left hover:bg-gray-200"
                                    title="Remover de empresa">
                                    Remover de empresa
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Información del estudiante: Carrera y semestre -->
            <p class="text-gray-700 flex items-center sm:hidden">
                <Icon name="uil:credit-card" class="mr-2 text-purple-600" />
                {{ pasante.cedula }}
            </p>
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
            <!-- Información adicional: Empresa actual (si tiene) -->
            <p v-if="pasante.empresaId" class="text-gray-700 flex items-center">
                <Icon name="uil:briefcase" class="mr-2 text-purple-600" />
                Empresa actual: {{ empresas.find(e => e.id === pasante.empresaId)?.nombre }}
            </p>
        </div>


        <PasantesAssignCompanyPopup v-if="showAssignCompanyPopup" :empresas="empresas" @assign-empresa="assignEmpresa"
            @close="showAssignCompanyPopup = false" />
        <PasantesEditPopup v-if="showEditPopup" :pasante="currentPasante" @update-pasante="updatePasante"
            @close="showEditPopup = false" />
        <div v-if="showDeleteConfirmation"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0" style="margin: 0;">
            <div class="bg-white p-8 rounded-lg shadow-xl m-4">
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

// Estado para manejar la visibilidad del desplegable de cada pasante
const dropdownVisibility = ref({});

const toggleDropdown = (pasanteId) => {
    // Alterna la visibilidad del desplegable para el pasante correspondiente
    if (dropdownVisibility.value[pasanteId]) {
        dropdownVisibility.value[pasanteId] = false;
    } else {
        // Cierra cualquier otro desplegable abierto
        for (const id in dropdownVisibility.value) {
            dropdownVisibility.value[id] = false;
        }
        dropdownVisibility.value[pasanteId] = true;
    }
};

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