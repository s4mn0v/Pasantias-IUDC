<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96">
        <h2 class="text-xl font-bold mb-4">Editar Empresa</h2>
        <form @submit.prevent="$emit('save')" class="space-y-4">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input v-model="empresa.nombre" id="nombre" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <div>
            <label for="correo" class="block text-sm font-medium text-gray-700">Correo</label>
            <input v-model="empresa.correo" id="correo" type="email" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <div>
            <label for="celular" class="block text-sm font-medium text-gray-700">Celular</label>
            <input v-model="empresa.celular" id="celular" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <div>
            <label for="ubicacion" class="block text-sm font-medium text-gray-700">Ubicación</label>
            <input v-model="empresa.ubicacion" id="ubicacion" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps(['empresa'])
  defineEmits(['save', 'close'])
  </script>