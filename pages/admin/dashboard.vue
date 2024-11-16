<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations'
import SearchReportes from '~/components/admin/dashboard/SearchReportes.vue'
import ReporteCard from '~/components/admin/dashboard/ReporteCard.vue'
import ReportesList from '~/components/admin/dashboard/ReportesList.vue'
import FilterModal from '~/components/admin/dashboard/FilterModal.vue'

const { getReportes, getPasantes, getEmpresas } = useFirestoreOperations()

const reportes = ref([])
const pasantes = ref([])
const empresas = ref([])
const searchQuery = ref('')
const showFilters = ref(false)
const activeFilters = ref({
  empresaId: '',
  pasanteId: '',
  urgencia: '',
  fechaInicio: '',
  fechaFin: ''
})

const itemsPerPage = ref(10)
const currentPage = ref(1)

const loadData = async () => {
  reportes.value = await getReportes()
  pasantes.value = await getPasantes()
  empresas.value = await getEmpresas()
}

onMounted(loadData)

const getPasanteName = (pasanteId) => {
  const pasante = pasantes.value.find(p => p.id === pasanteId)
  return pasante ? pasante.nombre : 'Pasante desconocido'
}

const getEmpresaName = (empresaId) => {
  const empresa = empresas.value.find(e => e.id === empresaId)
  return empresa ? empresa.nombre : 'Empresa desconocida'
}

const filteredReportes = computed(() => {
  let filtered = reportes.value

  // Aplicar filtros
  if (activeFilters.value.empresaId) {
    filtered = filtered.filter(r => r.empresaId === activeFilters.value.empresaId)
  }
  if (activeFilters.value.pasanteId) {
    filtered = filtered.filter(r => r.pasanteId === activeFilters.value.pasanteId)
  }
  if (activeFilters.value.urgencia) {
    filtered = filtered.filter(r => r.urgencia.toLowerCase() === activeFilters.value.urgencia.toLowerCase())
  }
  if (activeFilters.value.fechaInicio) {
    filtered = filtered.filter(r => new Date(r.fecha) >= new Date(activeFilters.value.fechaInicio))
  }
  if (activeFilters.value.fechaFin) {
    filtered = filtered.filter(r => new Date(r.fecha) <= new Date(activeFilters.value.fechaFin))
  }

  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(reporte =>
      getPasanteName(reporte.pasanteId).toLowerCase().includes(query) ||
      getEmpresaName(reporte.empresaId).toLowerCase().includes(query) ||
      reporte.contenido.toLowerCase().includes(query) ||
      reporte.urgencia.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredReportes.value.length / itemsPerPage.value))

const paginatedReportes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredReportes.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const updatePage = (page) => {
  currentPage.value = page
}

const updateItemsPerPage = (newValue) => {
  itemsPerPage.value = newValue
  // Reset a la primera página cuando se cambia el número de items
  currentPage.value = 1
}

const applyFilters = (filters) => {
  activeFilters.value = { ...filters }
  currentPage.value = 1 // Reset to first page when filters change
}

const handleReporteEliminado = async () => {
  await loadData()
  // Ajustar la página actual si es necesario
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
}
</script>

<template>
  <div class="flex font-poppins justify-center min-h-screen w-full p-4">
    <div class="w-full rounded-[26px] overflow-hidden relative">
      <div class="relative p-4 md:p-8">
        <!-- Barra de búsqueda y filtros -->
        <div class="flex justify-center mb-6">
          <SearchReportes 
            v-model="searchQuery"
            @open-filters="showFilters = true" 
          />
        </div>

        <ReportesList 
          :reportes="filteredReportes"
          :current-page="currentPage"
          :total-pages="totalPages"
          :items-per-page="itemsPerPage"
          :total-items="filteredReportes.length"
          @next-page="nextPage"
          @prev-page="prevPage"
          @update-page="updatePage"
          @update-items-per-page="updateItemsPerPage"
        >
          <ReporteCard
            v-for="reporte in paginatedReportes"
            :key="reporte.id"
            :reporte="reporte"
            :pasante-name="getPasanteName(reporte.pasanteId)"
            :empresa-name="getEmpresaName(reporte.empresaId)"
            @reporte-eliminado="handleReporteEliminado"
          />

          <div v-if="filteredReportes.length === 0" 
               class="text-center text-gray-400 mt-8 col-span-1 md:col-span-2">
            No hay reportes disponibles que coincidan con la búsqueda.
          </div>
        </ReportesList>

        <!-- Modal de filtros -->
        <FilterModal
          :is-open="showFilters"
          :empresas="empresas"
          :pasantes="pasantes"
          :active-filters="activeFilters"
          @close="showFilters = false"
          @apply-filters="applyFilters"
        />
      </div>
    </div>
  </div>
</template>