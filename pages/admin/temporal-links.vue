<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTemporalLinksStore } from '~/stores/useTemporalLinks'

const temporalLinksStore = useTemporalLinksStore()
const minutes = ref(5)
const newLinkUrl = ref('')
const baseUrl = window.location.origin
const selectedTab = ref('active')

const tabs = {
  active: 'Enlaces Activos',
  expired: 'Enlaces Expirados',
  used: 'Enlaces Usados'
}

const displayedLinks = computed(() => {
  switch (selectedTab.value) {
    case 'active':
      return temporalLinksStore.activeLinks
    case 'expired':
      return temporalLinksStore.expiredLinks
    case 'used':
      return temporalLinksStore.usedLinks
    default:
      return []
  }
})

onMounted(async () => {
  await temporalLinksStore.fetchLinks()
})

async function generateLink() {
  try {
    const link = await temporalLinksStore.createTemporalLink(minutes.value)
    newLinkUrl.value = `${baseUrl}/register/${link.token}`
  } catch (error) {
    alert(error.message)
  }
}

function copyToClipboard(url) {
  navigator.clipboard.writeText(url)
}

function formatDate(date) {
  return new Date(date).toLocaleString()
}

function getTimeRemaining(expirationDate) {
  const now = new Date()
  const expDate = new Date(expirationDate)
  const diff = expDate.getTime() - now.getTime()

  if (diff <= 0) return 'Expirado'

  const minutes = Math.floor(diff / 1000 / 60)
  return `${minutes} minutos`
}

async function deleteLink(linkId) {
  if (confirm('¿Estás seguro de eliminar este enlace?')) {
    try {
      await temporalLinksStore.deleteLink(linkId)
    } catch (error) {
      alert('Error al eliminar el enlace')
    }
  }
}
</script>

<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8 text-purple-500">Enlaces Temporales</h1>

    <div class="bg-gray-800 rounded-lg p-6 mb-8">
      <div class="flex items-center gap-4 mb-4">
        <div class="flex-1">
          <label class="block text-white mb-2">Minutos hasta expiración (5-60):</label>
          <input v-model="minutes" type="number" min="5" max="60"
            class="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600">
        </div>
        <button @click="generateLink" :disabled="!temporalLinksStore.canCreateNewLink"
          class="h-fit bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
          Generar Enlace
        </button>
      </div>

      <div v-if="!temporalLinksStore.canCreateNewLink" class="text-yellow-500 mb-4">
        Has alcanzado el límite de 5 enlaces activos
      </div>

      <div v-if="newLinkUrl" class="mt-6">
        <div class="flex items-center justify-between bg-gray-700 p-4 rounded">
          <div class="text-white break-all mr-4">{{ newLinkUrl }}</div>
          <button @click="copyToClipboard(newLinkUrl)"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
            Copiar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-700">
        <nav class="flex -mb-px">
          <button v-for="(label, key) in tabs" :key="key" @click="selectedTab = key" :class="[
            'px-4 py-2 font-medium',
            selectedTab === key
              ? 'border-b-2 border-purple-500 text-purple-500'
              : 'text-gray-400 hover:text-gray-300'
          ]">
            {{ label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Links List -->
    <div v-if="temporalLinksStore.isLoading" class="text-center text-white">
      Cargando...
    </div>

    <div v-else-if="temporalLinksStore.error" class="text-red-500">
      {{ temporalLinksStore.error }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="link in displayedLinks" :key="link.id"
        class="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
        <div class="flex-1">
          <p class="text-white">
            URL: {{ `${baseUrl}/register/${link.token}` }}
          </p>
          <p class="text-gray-400 text-sm">
            Creado: {{ formatDate(link.createdAt) }}
          </p>
          <p class="text-gray-400 text-sm">
            Expira: {{ formatDate(link.expirationDate) }}
            <span v-if="!link.used && new Date(link.expirationDate) > new Date()" class="text-green-500">
              ({{ getTimeRemaining(link.expirationDate) }})
            </span>
          </p>
          <p v-if="link.used && link.companyData" class="text-white">
            Nombre de la empresa: {{ link.companyData.nombre }}
          </p>
          <p v-if="link.used && link.companyData" class="text-gray-400 text-sm">
            Correo: {{ link.companyData.correo }}
          </p>
          <p v-if="link.used && link.companyData" class="text-gray-400 text-sm">
            Celular: {{ link.companyData.celular }}
          </p>
          <p v-if="link.used && link.companyData" class="text-gray-400 text-sm">
            Ubicación: {{ link.companyData.ubicacion }}
          </p>
        </div>

        <div class="flex gap-2">
          <button @click="copyToClipboard(`${baseUrl}/register/${link.token}`)"
            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300">
            Copiar
          </button>
          <button @click="deleteLink(link.id)"
            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300">
            Eliminar
          </button>
        </div>
      </div>

      <div v-if="displayedLinks.length === 0" class="text-center text-gray-400">
        No hay enlaces para mostrar
      </div>
    </div>
  </div>
</template>