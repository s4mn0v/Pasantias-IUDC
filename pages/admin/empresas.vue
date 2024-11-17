<template>
  <div class="flex font-poppins min-h-screen w-full">
    <div class="container mx-auto rounded-[26px] m-10 px-4">
      <h1 class="text-4xl font-bold text-center text-purple-500 mb-8">Gestión de Empresas</h1>

      <SearchBar v-model="searchQuery" />

      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

      <EmpresasList
        :empresas="paginatedEmpresas"
        :pasantes="pasantes"
        :expandedCards="expandedCards"
        @edit="iniciarEdicion"
        @delete="borrarEmpresa"
        @assign="openPasanteModal"
        @remove="removerPasante"
        @toggle="toggleCard"
      />

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @change-page="changePage"
      />
    </div>

    <EditEmpresaModal
      v-if="mostrarPopup"
      :empresa="editandoEmpresa"
      @save="guardarEdicion"
      @close="cerrarPopup"
    />

    <AssignPasanteModal
      v-if="showPasanteModal"
      :pasantes="pasantesDisponibles"
      :searchQuery="pasanteSearchQuery"
      @assign="asignarPasante"
      @close="closePasanteModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations'
import EmpresasList from '~/components/admin/empresa/EmpresasList.vue'
import SearchBar from '~/components/admin/empresa/SearchBar.vue'
import Pagination from '~/components/admin/empresa/Pagination.vue'
import EditEmpresaModal from '~/components/admin/empresa/EditEmpresaModal.vue'
import AssignPasanteModal from '~/components/admin/empresa/AssignPasanteModal.vue'

const { getEmpresas, actualizarEmpresa, eliminarEmpresa, getPasantes, asignarPasanteAEmpresa, removerPasanteDeEmpresa } = useFirestoreOperations()

const empresas = ref([])
const pasantes = ref([])
const editandoEmpresa = ref(null)
const mostrarPopup = ref(false)
const error = ref(null)
const searchQuery = ref('')
const pasanteSearchQuery = ref('')
const showPasanteModal = ref(false)
const selectedEmpresaId = ref(null)
const expandedCards = ref({})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 6

onMounted(async () => {
  await refreshData()
})

async function refreshData() {
  empresas.value = await getEmpresas()
  pasantes.value = await getPasantes()
}

const empresasFiltradas = computed(() => {
  if (!searchQuery.value) return empresas.value
  const lowercaseQuery = searchQuery.value.toLowerCase()
  return empresas.value.filter(empresa =>
    empresa.nombre.toLowerCase().includes(lowercaseQuery) ||
    empresa.correo.toLowerCase().includes(lowercaseQuery) ||
    empresa.ubicacion.toLowerCase().includes(lowercaseQuery)
  )
})

const paginatedEmpresas = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return empresasFiltradas.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => Math.ceil(empresasFiltradas.value.length / itemsPerPage))

const pasantesDisponibles = computed(() => {
  let disponibles = pasantes.value.filter(p => !p.empresaId)
  if (pasanteSearchQuery.value) {
    const lowercaseQuery = pasanteSearchQuery.value.toLowerCase()
    disponibles = disponibles.filter(p =>
      p.cedula.toLowerCase().includes(lowercaseQuery)
    )
  }
  return disponibles
})

function iniciarEdicion(empresa) {
  editandoEmpresa.value = { ...empresa }
  mostrarPopup.value = true
}

async function guardarEdicion() {
  if (editandoEmpresa.value) {
    await actualizarEmpresa(editandoEmpresa.value.id, editandoEmpresa.value)
    await refreshData()
    cerrarPopup()
  }
}

function cerrarPopup() {
  editandoEmpresa.value = null
  mostrarPopup.value = false
}

async function borrarEmpresa(id) {
  if (confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
    const pasantesAsociados = pasantes.value.filter(p => p.empresaId === id);
    for (const pasante of pasantesAsociados) {
      await removerPasanteDeEmpresa(pasante.id, id); // Remover relaciones con pasantes
    }
    await eliminarEmpresa(id); // Eliminar empresa
    await refreshData(); // Refrescar datos
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  }
}

async function asignarPasante(pasanteId) {
  try {
    await asignarPasanteAEmpresa(pasanteId, selectedEmpresaId.value, empresas.value.find(e => e.id === selectedEmpresaId.value).nombre)
    await refreshData()
    error.value = null
    showPasanteModal.value = false
    pasanteSearchQuery.value = ''
  } catch (e) {
    console.error('Error al asignar pasante:', e)
    error.value = e.message
  }
}

async function removerPasante(empresaId, pasanteId) {
  try {
    await removerPasanteDeEmpresa(pasanteId, empresaId)
    await refreshData()
    error.value = null
  } catch (e) {
    console.error('Error al remover pasante:', e)
    error.value = e.message
  }
}

function openPasanteModal(empresaId) {
  selectedEmpresaId.value = empresaId
  showPasanteModal.value = true
  pasanteSearchQuery.value = ''
}

function closePasanteModal() {
  showPasanteModal.value = false
  selectedEmpresaId.value = null
  pasanteSearchQuery.value = ''
}

function changePage(page) {
  currentPage.value = page
}

function toggleCard(empresaId) {
  expandedCards.value[empresaId] = !expandedCards.value[empresaId]
}
</script>

<style scoped>
/* Custom scrollbar styles */
.max-h-40 {
  scrollbar-width: thin;
  scrollbar-color: #4B5563 #1F2937;
}

.max-h-40::-webkit-scrollbar {
  width: 8px;
}

.max-h-40::-webkit-scrollbar-track {
  background: #1F2937;
}

.max-h-40::-webkit-scrollbar-thumb {
  background-color: #4B5563;
  border-radius: 20px;
  border: 3px solid #1F2937;
}
</style>