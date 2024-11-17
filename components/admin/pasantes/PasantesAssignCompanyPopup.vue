<!-- components/admin/pasantes/PasantesAssignCompanyPopup.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0" style="margin: 0;">
        <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">Asignar Empresa</h2>
            <div class="mb-4">
                <input v-model="searchTerm" type="text" placeholder="Buscar empresa"
                    class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div class="max-h-60 overflow-y-auto mb-4">
                <button v-for="empresa in filteredEmpresas" :key="empresa.id" @click="selectEmpresa(empresa)"
                    class="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md">
                    {{ empresa.nombre }}
                </button>
            </div>
            <div class="flex space-x-4">
                <button @click="$emit('close')"
                    class="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    empresas: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['assign-empresa', 'close']);

const searchTerm = ref('');

const filteredEmpresas = computed(() => {
    const term = searchTerm.value.toLowerCase();
    return props.empresas.filter(empresa => empresa.nombre.toLowerCase().includes(term));
});

const selectEmpresa = (empresa) => {
    emit('assign-empresa', empresa);
};
</script>