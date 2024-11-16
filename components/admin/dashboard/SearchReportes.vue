<script setup>
const props = defineProps({
    modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'openFilters'])

const updateSearch = (event) => {
    emit('update:modelValue', event.target.value)
}
</script>

<template>
    <div class="flex gap-2 items-center mb-6">
        <div class="relative sm:w-80">
            <input :value="modelValue" @input="updateSearch" type="text" placeholder="Buscar reportes..."
                class="block w-full h-11 pr-5 pl-6 py-2.5 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none" />
            <button
                class="flex flex-row items-center justify-center min-w-6 px-4 rounded-full border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-purple-700 hover:bg-purple-600 text-white font-medium tracking-wide border-transparent py-1.5 h-9 absolute right-1 top-1">
                <Icon name="uil:search" class="w-5 h-5" />
            </button>
        </div>
        <button @click="$emit('openFilters')"
            class="flex items-center gap-2 px-4 h-10 rounded-full bg-purple-700 hover:bg-purple-600 text-white transition-colors">
            <Icon name="uil:filter" class="w-5 h-5" />
            Filtros
        </button>
    </div>
</template>