<template>
    <div class="mt-4 px-5">
      <!-- Barra de búsqueda -->
      <div class="mb-4 max-w-lg overflow-hidden drop-shadow-md">
        <div class="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
          <Icon name="uil:search" class="w-5 h-5" />
        </div>
        <input type="text" v-model="searchQuery"
          class="block w-full sm:w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
          placeholder="Buscar pasante" />
      </div>

      <div class="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 scrollbar-hide">
        <div v-if="loading" class="text-center text-gray-400 col-span-full">Cargando pasantes...</div>
        <div v-else-if="filteredPasantes.length === 0" class="text-center text-gray-400 col-span-full">No se encontraron
          pasantes.</div>
        <div v-else v-for="pasante in filteredPasantes" :key="pasante.id"
          class="bg-white p-4 rounded-lg shadow-md space-y-2 border">
          <div>
            <p class="text-lg text-black font-semibold">{{ pasante.nombre }}</p>
            <p class="text-slate-500 font-medium">{{ pasante.cedula }}</p>
            <p class="text-slate-500 font-medium">Carrera: {{ pasante.carrera }}</p>
            <p class="text-slate-500 font-medium">Semestre: {{ pasante.semestre }}</p>
          </div>
          <div class="flex space-x-2">
            <a class="flex items-center justify-center px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              :href="`tel:${pasante.celular}`">
              <Icon name="uil:incoming-call" class="w-5 h-5" />
            </a>
            <a class="flex items-center justify-center px-4 py-1 text-sm text-green-600 font-semibold rounded-full border border-green-200 hover:text-white hover:bg-green-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              :href="`https://wa.me/${pasante.celular}`" target="_blank">
              <Icon name="uil:whatsapp" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations.ts'
import { useCurrentUser } from 'vuefire'

const { getPasantes, getEmpresas } = useFirestoreOperations()
const user = useCurrentUser()

const pasantes = ref([])
const empresaActual = ref(null)
const loading = ref(true)

const searchQuery = ref("")

onMounted(async () => {
  if (user.value) {
    const empresas = await getEmpresas()
    empresaActual.value = empresas.find(empresa => empresa.id === user.value.uid)

    if (empresaActual.value) {
      const todosPasantes = await getPasantes()
      pasantes.value = todosPasantes.filter(pasante => empresaActual.value.pasantes.includes(pasante.id))
    }
  }
  loading.value = false
})

const filteredPasantes = computed(() => {
  return pasantes.value.filter(pasante =>
    pasante.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>