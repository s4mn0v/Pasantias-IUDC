<!-- pages/admin/pasantes.vue -->
<template>
    <div class="flex font-poppins items-center justify-center min-h-screen w-full bg-gray-100 p-4">
        <div class="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden relative">
            <div class="relative p-8">
                <h1 class="text-3xl font-bold text-center text-purple-600 mb-8">
                    Gestión de Pasantes
                </h1>
                <PasantesSearch @search="updateFilter" />
                <PasantesActions @add-pasante="showAddPopup = true" @upload-xlsx="showUploadPopup = true" />
                <PasantesList :pasantes="paginatedPasantes" :empresas="empresas" @edit="editPasante"
                    @delete="deletePasante" @assign-empresa="assignEmpresa" @remove-empresa="removeEmpresa" />
                <PasantesPagination :currentPage="currentPage" :totalPages="totalPages" @page-change="changePage" />
                <PasantesAddPopup v-if="showAddPopup" @close="showAddPopup = false" @add-pasante="addPasante" />
                <PasantesUploadPopup v-if="showUploadPopup" @close="showUploadPopup = false"
                    @upload-pasantes="uploadPasantes" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFirestoreOperations } from '~/composables/useFirestoreOperations';
import PasantesSearch from '~/components/admin/pasantes/PasantesSearch.vue';
import PasantesActions from '~/components/admin/pasantes/PasantesActions.vue';
import PasantesList from '~/components/admin/pasantes/PasantesList.vue';
import PasantesPagination from '~/components/admin/pasantes/PasantesPagination.vue';
import PasantesAddPopup from '~/components/admin/pasantes/PasantesAddPopup.vue';
import PasantesUploadPopup from '~/components/admin/pasantes/PasantesUploadPopup.vue';

const { getPasantes, getEmpresas, crearPasante, actualizarPasante, eliminarPasante, asignarPasanteAEmpresa, removerPasanteDeEmpresa } = useFirestoreOperations();

const pasantes = ref([]);
const empresas = ref([]);
const filter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const showAddPopup = ref(false);
const showUploadPopup = ref(false);

onMounted(async () => {
    pasantes.value = await getPasantes();
    empresas.value = await getEmpresas();
});

const filteredPasantes = computed(() => {
    const filterLower = filter.value.toLowerCase();
    return pasantes.value.filter(
        (pasante) =>
            pasante.nombre.toLowerCase().includes(filterLower) ||
            pasante.cedula.includes(filterLower)
    );
});

const totalPages = computed(() => Math.ceil(filteredPasantes.value.length / itemsPerPage));

const paginatedPasantes = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPasantes.value.slice(start, end);
});

const updateFilter = (newFilter) => {
    filter.value = newFilter;
    currentPage.value = 1;
};

const changePage = (page) => {
    currentPage.value = page;
};

const addPasante = async (newPasante) => {
    await crearPasante(newPasante);
    pasantes.value = await getPasantes();
    showAddPopup.value = false;
};

const editPasante = async (updatedPasante) => {
    await actualizarPasante(updatedPasante.id, updatedPasante);
    pasantes.value = await getPasantes();
};

const deletePasante = async (id) => {
    await eliminarPasante(id);
    pasantes.value = await getPasantes();
};

const assignEmpresa = async (pasanteId, empresaId, empresaNombre) => {
    await asignarPasanteAEmpresa(pasanteId, empresaId, empresaNombre);
    pasantes.value = await getPasantes();
};

const removeEmpresa = async (pasanteId, empresaId) => {
    await removerPasanteDeEmpresa(pasanteId, empresaId);
    pasantes.value = await getPasantes();
};

const uploadPasantes = async (newPasantes) => {
    for (const pasante of newPasantes) {
        await crearPasante(pasante);
    }
    pasantes.value = await getPasantes();
    showUploadPopup.value = false;
};
</script>