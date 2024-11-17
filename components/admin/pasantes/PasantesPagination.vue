<!-- components/admin/pasantes/PasantesPagination.vue -->
<template>
    <div class="flex justify-center mt-6 space-x-2">
        <button v-for="page in totalPages" :key="page" @click="$emit('page-change', page)"
            :class="['px-3 py-1 rounded', currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700']">
            {{ page }}
        </button>
    </div>
</template>

<script setup>
defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    }
});

defineEmits(['page-change']);
</script>