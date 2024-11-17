<template>
    <div class="flex items-center justify-center space-x-4 mb-4 max-w-lg drop-shadow-md mx-auto">
        <div
            class="flex items-center py-2 px-6 rounded-full bg-white border focus-within:border-gray-300 shadow-md space-x-2">
            <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text"
                placeholder="Buscar empresa..."
                class="bg-transparent w-full focus:outline-none pr-4 border-0 focus:ring-0 px-0 py-0">
            <button
                class="flex flex-row items-center justify-center px-4 rounded-full border disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out duration-150 text-base bg-purple-500 text-white font-medium tracking-wide border-transparent py-1.5 h-[38px] -mr-3">
                <Icon name="uil:search" class="w-5 h-5" />
            </button>
        </div>

        <NuxtLink to="./temporal-links">
            <button
                class="flex items-center justify-center w-11 h-11 rounded-full border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-300">
                <Icon name="uil:plus-circle" class="w-5 h-5 text-gray-500" />
            </button>
        </NuxtLink>
    </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>