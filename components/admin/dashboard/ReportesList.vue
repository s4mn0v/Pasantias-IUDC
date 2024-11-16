<script setup>
const props = defineProps({
  reportes: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['nextPage', 'prevPage', 'updatePage', 'updateItemsPerPage'])

const pageNumbers = computed(() => {
  const delta = 2
  const range = []
  let start = Math.max(1, props.currentPage - delta)
  let end = Math.min(props.totalPages, props.currentPage + delta)

  if (props.currentPage - delta > 2) {
    range.push(1, '...')
  } else {
    for (let i = 1; i < start; i++) {
      range.push(i)
    }
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  if (props.totalPages - end > 1) {
    range.push('...', props.totalPages)
  } else {
    for (let i = end + 1; i <= props.totalPages; i++) {
      range.push(i)
    }
  }

  return range
})

const itemsPerPageOptions = [5, 10, 20, 50]

const handlePageClick = (page) => {
  if (typeof page === 'number') {
    emit('updatePage', page)
  }
}
</script>

<template>
  <div>
    <!-- Grid container para los reportes -->
    <div class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <slot></slot>
    </div>

    <!-- Paginación -->
    <div v-if="reportes.length > 0" class="flex flex-col items-center gap-4 mt-6">
      <!-- Controles de paginación -->
      <div class="flex items-center gap-2">
        <button @click="$emit('prevPage')" :disabled="currentPage === 1"
          class="flex items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 transition-opacity cursor-pointer">
          <Icon name="uil:angle-left" class="w-10 h-8" />
        </button>

        <!-- Números de página -->
        <div class="flex gap-1">
          <button v-for="page in pageNumbers" :key="page"
            @click="handlePageClick(page)"
            :disabled="page === '...'"
            :class="[
              'px-3 py-1 rounded-lg transition-colors',
              page === currentPage
                ? 'bg-purple-500 text-white'
                : page === '...'
                  ? 'cursor-default'
                  : 'bg-gray-200 hover:bg-purple-100'
            ]"
          >
            {{ page }}
          </button>
        </div>

        <button @click="$emit('nextPage')" :disabled="currentPage === totalPages"
          class="flex items-center justify-center bg-purple-700 hover:bg-purple-600 text-white rounded-lg disabled:opacity-50 transition-opacity cursor-pointer">
          <Icon name="uil:angle-right" class="w-10 h-8" />
        </button>
      </div>

      <!-- Información de paginación y selector de items por página -->
      <div class="flex items-center gap-4 text-sm text-gray-600">
        <span>
          Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} - 
          {{ Math.min(currentPage * itemsPerPage, totalItems) }}
          de {{ totalItems }} reportes
        </span>

        <div class="flex items-center gap-2">
          <label>Items por página:</label>
          <select
            :value="itemsPerPage"
            @change="$emit('updateItemsPerPage', parseInt($event.target.value))"
            class="border rounded-lg px-2 py-1"
          >
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>