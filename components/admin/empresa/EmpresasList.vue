<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="empresa in empresas" :key="empresa.id" :id="`empresa-${empresa.id}`"
            class="p-4 rounded-lg bg-white shadow-lg">
            <div class="flex justify-between items-center mb-2">
                <h2 class="text-xl font-semibold mr-2">
                    <!-- Mostrar nombre truncado o completo según el estado expandido -->
                    {{ expandedCards[empresa.id] ? empresa.nombre : truncateNombre(empresa.nombre) }}
                </h2>
                <button @click="$emit('toggle', empresa.id)" class="hover:text-purple-500 transition duration-300">
                    <Icon :name="expandedCards[empresa.id] ? 'uil:angle-up' : 'uil:angle-down'" class="w-7 h-7" />
                </button>
            </div>

            <p class="flex items-center text-gray-500 mb-1">NIT - {{ empresa.nit }}</p>
            <div class="flex items-center text-gray-500 mb-1">
                <Icon name="uil:envelope" class="w-5 h-5 mr-2" />
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
                <!-- Contenedor con scroll si hay muchos pasantes -->
                <div
                    class="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    <ul>
                        <li v-for="pasanteId in empresa.pasantes" :key="pasanteId"
                            class="flex justify-between items-center py-1 border-b-2 border-gray-200 mb-2">
                            <span>{{ pasantes.find(p => p.id === pasanteId)?.nombre }}</span>
                            <button @click="$emit('remove', empresa.id, pasanteId)"
                                class="text-red-500 ml-2 hover:text-red-700 transition duration-300">
                                <Icon name="uil:trash-alt" class="w-4 h-4"/>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="mt-4 space-x-2 flex justify-between items-center">
                <div class="flex space-x-2">
                    <button @click="$emit('edit', empresa)"
                        class="flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full bg-yellow-600 border border-yellow-600 hover:text-yellow-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition duration-300">
                        <Icon name="uil:edit" class="w-5 h-5" />
                    </button>
                    <button @click="$emit('delete', empresa.id)"
                        class="flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full bg-red-600 border border-red-600 hover:text-red-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition duration-300">
                        <Icon name="uil:trash-alt" class="w-5 h-5" />
                    </button>
                    <button @click="$emit('assign', empresa.id)"
                        class="flex items-center justify-center px-4 py-1 text-sm text-white font-semibold rounded-full bg-green-600 border border-green-600 hover:text-green-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition duration-300">
                        <Icon name="uil:user-plus" class="w-5 h-5" />
                    </button>
                </div>
                <span class="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    <Icon name="uil:user" class="w-4 h-4 mr-1" />
                    {{ empresa.pasantes.length }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps(['empresas', 'pasantes', 'expandedCards']);
defineEmits(['edit', 'delete', 'assign', 'remove', 'toggle']);

/**
 * Truncar el nombre de la empresa a 17 caracteres y añadir '...' si es necesario
 * @param {string} nombre - Nombre de la empresa
 * @returns {string} - Nombre truncado o completo
 */
function truncateNombre(nombre) {
    return nombre.length > 17 ? nombre.slice(0, 17) + '...' : nombre;
}
</script>
