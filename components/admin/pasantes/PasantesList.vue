<!-- components/admin/pasantes/PasantesList.vue -->
<template>
    <div class="space-y-4">
        <div v-for="pasante in pasantes" :key="pasante.id" class="bg-gray-200 rounded-md p-4 shadow-md">
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-lg font-semibold text-gray-800">
                    {{ pasante.nombre }} - {{ pasante.cedula }}
                </h2>
                <div class="space-x-2 flex">
                    <button @click="$emit('edit', pasante)"
                        class="flex items-center justify-center px-4 py-1 text-white bg-blue-600 font-semibold rounded-full border border-blue-600 hover:text-blue-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                        <Icon name="uil:edit" class="w-5 h-5" />
                    </button>
                    <button @click="$emit('delete', pasante.id)"
                        class="flex items-center justify-center px-4 py-1 text-white bg-red-600 font-semibold rounded-full border border-red-600 hover:text-red-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2">
                        <Icon name="uil:trash-alt" class="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p class="text-gray-700">
                {{ pasante.carrera }} - Semestre {{ pasante.semestre }}
            </p>
            <p class="text-gray-700">{{ pasante.correo }}</p>
            <p class="text-gray-700">Celular: {{ pasante.celular }}</p>
            <div class="mt-2">
                <select
                    @change="($event) => $emit('assign-empresa', pasante.id, $event.target.value, empresas.find((e) => e.id === $event.target.value)?.nombre)"
                    class="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-md py-2 px-3">
                    <option value="">Seleccionar empresa</option>
                    <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id"
                        :selected="empresa.id === pasante.empresaId">
                        {{ empresa.nombre }}
                    </option>
                </select>
                <button v-if="pasante.empresaId" @click="$emit('remove-empresa', pasante.id, pasante.empresaId)"
                    class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                    Remover de empresa
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    pasantes: {
        type: Array,
        required: true
    },
    empresas: {
        type: Array,
        required: true
    }
});

defineEmits(['edit', 'delete', 'assign-empresa', 'remove-empresa']);
</script>