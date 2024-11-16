<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
  style="background-image: url('https://images.pexels.com/photos/29128147/pexels-photo-29128147/free-photo-of-vibrant-abstract-neon-lightwave-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')">
  <div class="py-8 px-6 max-w-md bg-white bg-opacity-30 rounded-lg shadow-lg backdrop-blur-xl backdrop-filter text-center text-white">
    <div class="text-9xl font-bold mb-4">{{ error?.statusCode }}</div>
    <h1 class="text-4xl font-bold mb-6">Oops!</h1>
    <div href="#"
      class="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300">
    <NuxtLink to="/">Go back home</NuxtLink>
    </div>
  </div>
</div>
</template>