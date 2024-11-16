<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations.ts'
import { useCurrentUser } from 'vuefire'

const { getReportesPorEmpresa, getPasantes, getEmpresas } = useFirestoreOperations()
const user = useCurrentUser()

const reportes = ref([])
const pasantes = ref([])
const empresaActual = ref(null)
const loading = ref(true)

// Configuración de la paginación
const currentPage = ref(1)
const itemsPerPage = ref(5)
const totalPages = computed(() => Math.ceil(reportes.value.length / itemsPerPage.value))

// Reportes paginados
const paginatedReportes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return reportes.value.slice(start, end)
})

onMounted(async () => {
  if (user.value) {
    const empresas = await getEmpresas()
    empresaActual.value = empresas.find(empresa => empresa.id === user.value.uid)

    if (empresaActual.value) {
      reportes.value = await getReportesPorEmpresa(empresaActual.value.id)
      const todosPasantes = await getPasantes()
      pasantes.value = todosPasantes.filter(pasante =>
        empresaActual.value.pasantes.includes(pasante.id)
      )
    }
  }
  loading.value = false
})

function getDatosPasante(pasanteId) {
  const pasante = pasantes.value.find(p => p.id === pasanteId)
  return pasante ? { nombre: pasante.nombre, cedula: pasante.cedula } : { nombre: 'Pasante desconocido', cedula: 'N/A' }
}

const getUrgencyColor = (urgencia) => {
  switch (urgencia) {
    case 'verde':
      return 'bg-green-500'
    case 'amarillo':
      return 'bg-yellow-500'
    case 'rojo':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div class="flex font-poppins items-center justify-center min-h-screen w-full">
    <div class="w-full max-w-4xl rounded-[26px] overflow-hidden relative">
      <!-- Content -->
      <div class="relative p-8">
        <div v-if="loading" class="text-center">
          Cargando reportes...
        </div>

        <div v-else-if="reportes.length === 0" class="text-center">
          No hay reportes disponibles.
        </div>

        <div v-else>
          <!-- Reportes -->
          <div class="space-y-4 mb-6">
            <div v-for="reporte in paginatedReportes" :key="reporte.id" class="rounded-lg p-4 shadow border bg-white">
              <div class="flex justify-between items-center mb-2">
                <h2 class="text-xl font-semibold">{{ getDatosPasante(reporte.pasanteId).nombre }}</h2>
                <span :class="['w-10 h-4 rounded-full mr-2', getUrgencyColor(reporte.urgencia)]"></span>
              </div>
              <p class="mb-2">{{ reporte.contenido }}</p>
              <div class="flex justify-between text-sm text-gray-500">
                <p>{{ getDatosPasante(reporte.pasanteId).cedula }}</p>
                <p>{{ new Date(reporte.fecha).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>

          <!-- Controles de paginación -->
          <div class="flex items-center justify-center space-x-4 mt-6">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="flex items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 transition-opacity cursor-pointer">
              <Icon name="uil:angle-left" class="w-10 h-8" />
            </button>

            <div class="flex space-x-2">
              <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="[
                'px-3 py-1 rounded-md',
                currentPage === page
                  ? 'bg-purple-500 text-white'
                  : 'bg-purple-300 text-gray-900'
              ]">
                {{ page }}
              </button>
            </div>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="flex items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 transition-opacity cursor-pointer">
              <Icon name="uil:angle-right" class="w-10 h-8" />
            </button>
          </div>

          <!-- Información de paginación -->
          <div class="text-center mt-4 text-sm text-gray-500">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, reportes.length) }}
            de {{ reportes.length }} reportes
          </div>
        </div>
      </div>
    </div>
  </div>
</template>