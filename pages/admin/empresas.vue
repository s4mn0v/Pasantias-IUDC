<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations'

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
    await eliminarEmpresa(id)
    await refreshData()
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  }
}

async function asignarPasante(empresaId, pasanteId) {
  try {
    await asignarPasanteAEmpresa(pasanteId, empresaId, empresas.value.find(e => e.id === empresaId).nombre)
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

<template>
  <div class="flex font-poppins min-h-screen w-full">
    <div class="container mx-auto rounded-[26px] m-10 px-4">
      <h1 class="text-4xl font-bold text-center text-purple-500 mb-8">Gestión de Empresas</h1>

      <div class="flex items-center justify-center space-x-4 mb-4 max-w-lg drop-shadow-md mx-auto">
        <!-- Contenedor del Buscador y Botón de Agregar -->
        <div
          class="flex items-center py-2 px-6 rounded-full bg-white border focus-within:border-gray-300 shadow-md space-x-2">
          <input v-model="searchQuery" type="text" placeholder="Buscar empresa..."
            class="bg-transparent w-full focus:outline-none pr-4 border-0 focus:ring-0 px-0 py-0">
          <button
            class="flex flex-row items-center justify-center min-w-[130px] px-4 rounded-full border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-black text-white font-medium tracking-wide border-transparent py-1.5 h-[38px] -mr-3">
            Buscar
          </button>
        </div>

        <NuxtLink to="./temporal-links">
          <button
            class="flex items-center justify-center w-11 h-11 rounded-full border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-300">
            <Icon name="uil:plus-circle" class="w-5 h-5 text-gray-500" />
          </button>
        </NuxtLink>
      </div>

      <p v-if="error" class="text-red-500 mb-4">{{ error }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="empresa in paginatedEmpresas" :key="empresa.id" :id="`empresa-${empresa.id}`"
          class="p-4 rounded-lg bg-white shadow-lg">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-semibold mr-2">{{ empresa.nombre }}</h2>
            <button @click="toggleCard(empresa.id)" class="hover:text-purple-500 transition duration-300">
              <Icon name="mdi:chevron-down" v-if="!expandedCards[empresa.id]" class="w-7 h-7" />
              <Icon name="mdi:chevron-up" v-else class="w-7 h-7" />
            </button>
          </div>

          <div class="flex items-center text-gray-500 mb-1">
            <Icon name="uil:fast-mail" class="w-5 h-5 mr-2" />
            <p>{{ empresa.correo }}</p>
          </div>
          <div class="flex items-center text-gray-500 mb-1">
            <Icon name="uil:phone" class="w-5 h-5 mr-2" />
            <p>{{ empresa.celular }}</p>
          </div>
          <div class="flex items-center text-gray-500 mb-1">
            <Icon name="uil:location-pin-alt" class="w-5 h-5 mr-2" />
            <p>{{ empresa.ubicacion }}</p>
          </div>

          <div v-if="expandedCards[empresa.id]" class="mt-4">
            <h3 class="font-semibold">Lista de Pasantes:</h3>
            <div class="max-h-40 overflow-y-auto pr-2">
              <ul>
                <li v-for="pasanteId in empresa.pasantes" :key="pasanteId"
                  class="flex justify-between items-center py-1">
                  <span>{{ pasantes.find(p => p.id === pasanteId)?.nombre }}</span>
                  <button @click="removerPasante(empresa.id, pasanteId)"
                    class="text-red-500 ml-2 hover:text-red-700 transition duration-300">
                    Remover
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-4 space-x-2 flex justify-between items-center">
            <div class="flex space-x-2">
              <button @click="iniciarEdicion(empresa)"
                class="flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full bg-yellow-600 border border-yellow-600 hover:text-yellow-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition duration-300">
                <Icon name="uil:edit" class="w-5 h-5" />
              </button>
              <button @click="borrarEmpresa(empresa.id)"
                class="flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full bg-red-600 border border-red-600 hover:text-red-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition duration-300">
                <Icon name="uil:trash-alt" class="w-5 h-5" />
              </button>
              <button @click="openPasanteModal(empresa.id)"
                class="flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full bg-blue-600 border border-blue-600 hover:text-blue-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-300">
                <Icon name="mdi:account-plus" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <button v-for="page in totalPages" :key="page" @click="changePage(page)"
          :class="['px-3 py-1 rounded-full mx-1', page === currentPage ? 'bg-purple-500 text-white' : 'bg-gray-200']">
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>
