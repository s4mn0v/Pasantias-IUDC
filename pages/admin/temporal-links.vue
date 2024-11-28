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
      // Filtra los enlaces expirados, excluyendo los que están usados
      return temporalLinksStore.expiredLinks.filter(link => !link.used)
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
  return new Date(date).toLocaleString('es-CO', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
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
    <div class="flex justify-between items-center mb-8 content-center">
      <h1 class="text-3xl text-purple-500 uppercase tracking-wider font-extrabold">Enlaces Temporales</h1>
      <div class="text-sm text-gray-500">
        {{ formatDate(new Date()) }}
      </div>
    </div>

    <div class="border drop-shadow-lg bg-slate-50 rounded-lg p-6 mb-8">
      <p class="mb-4">Minutos hasta expiración (5-60):</p>
      <div class="flex w-full h-auto space-x-7">
        <input v-model="minutes" type="number" min="5" max="60" class="w-full px-4 py-2 rounded border"/>

        <button @click="generateLink" :disabled="!temporalLinksStore.canCreateNewLink"
          class="bg-purple-500 p-3 rounded-full hover:bg-purple-600 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center text-white"
          title="Generar un nuevo enlace">
          <Icon name="uil:plus" class="w-6 h-6" />
        </button>
      </div>

      <div v-if="!temporalLinksStore.canCreateNewLink" class="text-yellow-500 mb-4">
        Has alcanzado el límite de 5 enlaces activos, por favor elimina algunos enlaces.
      </div>

      <!-- Mostrar enlace generado -->
      <div v-if="newLinkUrl" class="mt-6">
        <div class="flex items-center justify-between bg-blue-100 p-4 rounded">
          <!-- Mostrar todo el enlace sin recortes -->
          <div class="text-gray-700 break-all mr-4">{{ newLinkUrl }}</div>
          <button
            @click="copyToClipboard(newLinkUrl)"
            class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            title="Copiar URL">
            <Icon name="uil:copy" class="w-5 h-5" />
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
    <div v-if="temporalLinksStore.isLoading" class="text-center">
      Cargando...
    </div>

    <div v-else-if="temporalLinksStore.error" class="text-red-500">
      {{ temporalLinksStore.error }}
    </div>

    <div v-else class="space-y-4">
      <div v-for="link in displayedLinks" :key="link.id"
        class="rounded-lg p-4 flex items-center justify-between space-x-10 border drop-shadow-lg bg-slate-50">
        <div class="flex-1">
          <div class="flex justify-between sm:flex-1">
            <p class="flex items-center justify-between space-x-5">
              <span>
                <Icon name="uil:link" class="w-4 h-4 mr-2 text-green-700" /> ID: {{
                  `${baseUrl}/register/${link.token}`.slice(110)
                }}
              </span>
              <span v-if="!link.used && new Date(link.expirationDate) > new Date()" class="text-fuchsia-700">
                ({{ getTimeRemaining(link.expirationDate) }})
              </span>
            </p>
            <div class="flex space-x-4">
              <p class="text-gray-500 text-sm">
                Creado: {{ formatDate(link.createdAt) }}
              </p>
              <p class="text-gray-500 text-sm">
                Expira: {{ formatDate(link.expirationDate) }}
              </p>
            </div>
          </div>
          <p v-if="link.used && link.companyData">
            Nombre de la empresa: {{ link.companyData.nombre }}
          </p>
          <p v-if="link.used && link.companyData">NIT: {{ link.companyData.nit }}</p>
        </div>

        <div class="flex gap-2">
          <button @click="copyToClipboard(`${baseUrl}/register/${link.token}`)"
            class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center justify-center"
            title="Copiar enlace">
            <Icon name="uil:copy" class="w-5 h-5" />
          </button>

          <button @click="deleteLink(link.id)"
            class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center"
            title="Eliminar enlace">
            <Icon name="uil:trash-alt" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div v-if="displayedLinks.length === 0" class="text-center text-gray-400">
        No hay enlaces para mostrar
      </div>
    </div>
  </div>
</template> 