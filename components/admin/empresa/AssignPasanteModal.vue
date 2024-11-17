<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-xl font-bold mb-4">Asignar Pasante</h2>
            <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text"
                placeholder="Buscar pasante por cédula" class="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4">
            <div class="max-h-60 overflow-y-auto">
                <div v-for="pasante in pasantes" :key="pasante.id" @click="$emit('assign', pasante.id)"
                    class="p-2 hover:bg-gray-100 cursor-pointer transition duration-300">
                    {{ pasante.nombre }} ({{ pasante.cedula }})
                </div>
            </div>
            <button @click="$emit('close')"
                class="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">Cerrar</button>
        </div>
    </div>
</template>

<script setup>
defineProps(['pasantes', 'searchQuery'])
defineEmits(['assign', 'close', 'update:searchQuery'])
</script>