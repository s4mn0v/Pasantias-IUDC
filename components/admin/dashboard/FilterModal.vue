<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    empresas: {
        type: Array,
        default: () => []
    },
    pasantes: {
        type: Array,
        default: () => []
    },
    activeFilters: {
        type: Object,
        default: () => ({
            empresaId: '',
            pasanteId: '',
            urgencia: '',
            fechaInicio: '',
            fechaFin: ''
        })
    }
})

const emit = defineEmits(['close', 'apply-filters'])

const localFilters = ref({ ...props.activeFilters })

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        localFilters.value = { ...props.activeFilters }
    }
})

const urgenciaOptions = [
    { value: '', label: 'Todas' },
    { value: 'verde', label: 'Verde' },
    { value: 'amarillo', label: 'Amarillo' },
    { value: 'rojo', label: 'Rojo' }
]

const applyFilters = () => {
    emit('apply-filters', localFilters.value)
    emit('close')
}

const clearFilters = () => {
    localFilters.value = {
        empresaId: '',
        pasanteId: '',
        urgencia: '',
        fechaInicio: '',
        fechaFin: ''
    }
    emit('apply-filters', localFilters.value)
    emit('close')
}
</script>

<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Filtros</h2>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <Icon name="uil:times" class="w-6 h-6" />
                </button>
            </div>

            <div class="space-y-4">
                <!-- Empresa -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                    <select v-model="localFilters.empresaId" class="w-full rounded-lg border border-gray-300 p-2">
                        <option value="">Todas las empresas</option>
                        <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
                            {{ empresa.nombre }}
                        </option>
                    </select>
                </div>

                <!-- Pasante -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pasante</label>
                    <select v-model="localFilters.pasanteId" class="w-full rounded-lg border border-gray-300 p-2">
                        <option value="">Todos los pasantes</option>
                        <option v-for="pasante in pasantes" :key="pasante.id" :value="pasante.id">
                            {{ pasante.nombre }} - {{ pasante.cedula }}
                        </option>
                    </select>
                </div>

                <!-- Urgencia -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Urgencia</label>
                    <select v-model="localFilters.urgencia" class="w-full rounded-lg border border-gray-300 p-2">
                        <option v-for="option in urgenciaOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>

                <!-- Rango de fechas -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                        <input type="date" v-model="localFilters.fechaInicio"
                            class="w-full rounded-lg border border-gray-300 p-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                        <input type="date" v-model="localFilters.fechaFin"
                            class="w-full rounded-lg border border-gray-300 p-2">
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <button @click="clearFilters" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Limpiar filtros
                </button>
                <button @click="applyFilters"
                    class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    Aplicar filtros
                </button>
            </div>
        </div>
    </div>
</template>