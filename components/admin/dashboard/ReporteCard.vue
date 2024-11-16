<script setup>
import { ref } from 'vue'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations'

const props = defineProps({
  reporte: {
    type: Object,
    required: true
  },
  pasanteName: {
    type: String,
    required: true
  },
  empresaName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['reporteEliminado'])

const getUrgencyColor = (urgencia) => {
  switch (urgencia.toLowerCase()) {
    case 'rojo': return 'bg-red-500'
    case 'amarillo': return 'bg-yellow-500'
    case 'verde': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

// State for modal
const showModal = ref(false)
const { eliminarReporte } = useFirestoreOperations()

const toggleModal = () => {
  showModal.value = !showModal.value
}

const handleDelete = async () => {
  const confirmed = confirm("¿Estás seguro de que deseas eliminar este reporte?");
  if (confirmed) {
    try {
      await eliminarReporte(props.reporte.id);
      alert('Reporte eliminado con éxito.');
      emit('reporteEliminado');
      showModal.value = false;
    } catch (error) {
      console.error('Error al eliminar el reporte:', error);
      alert('Hubo un error al eliminar el reporte. Por favor, inténtalo de nuevo.');
    }
  }
}
</script>

<template>
  <div @click="toggleModal" class="rounded-lg p-4 shadow border h-full flex flex-col justify-between cursor-pointer bg-white">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-semibold line-clamp-2">{{ pasanteName }}</h2>
      <span class="flex items-center">
        <span :class="['w-4 h-4 rounded-full', getUrgencyColor(reporte.urgencia)]"></span>
        <span class="sr-only">{{ reporte.urgencia }}</span>
      </span>
    </div>
    <div class="bg-gray-300 h-[1px] w-full my-2"></div>
    <p class="mb-2 line-clamp-3">{{ reporte.contenido }}</p>
    <div class="flex justify-between text-sm text-gray-400">
      <p>Empresa: {{ empresaName }}</p>
      <p>Fecha: {{ new Date(reporte.fecha).toLocaleDateString() }}</p>
    </div>

    <!-- Modal for detailed report view -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 overflow-x-scroll max-h-96">
        <div class="flex items-center mb-4">
          <span :class="['w-4 h-4 rounded-full mr-2', getUrgencyColor(reporte.urgencia)]"></span>
          <h2 class="text-xl font-semibold">{{ pasanteName }}</h2>
          <div class="ml-auto text-sm text-gray-500">
            <p>{{ new Date(reporte.fecha).toLocaleString() }}</p>
          </div>
        </div>
        <div class="bg-gray-300 h-[1px] w-full my-4"></div>
        <p class="mb-4">{{ reporte.contenido }}</p>
        
        <!-- Botón de eliminar -->
        <div class="flex justify-end mt-4">
          <a @click.stop="handleDelete"
            class="flex items-center justify-center px-4 py-1 text-sm text-red-600 font-semibold rounded-full border border-red-200 hover:text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600">
            <Icon name="uil:trash-alt" class="w-5 h-5" />
            Eliminar
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>