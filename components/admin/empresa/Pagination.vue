<template>
    <div class="mt-8 flex justify-center">
        <nav class="inline-flex rounded-md shadow">
            <button v-for="page in totalPages" :key="page" @click="$emit('change-page', page)" :class="[
                'px-4 py-2 border',
                currentPage === page
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                page === 1 ? 'rounded-l-md' : '',
                page === totalPages ? 'rounded-r-md' : '',
            ]">
                {{ page }}
            </button>
        </nav>
    </div>
</template>

<script setup>
defineProps(['currentPage', 'totalPages'])
defineEmits(['change-page'])
</script>