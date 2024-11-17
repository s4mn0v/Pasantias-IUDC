<!-- components/admin/pasantes/PasantesUploadPopup.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4">Cargar XLSX</h2>
            <input type="file" accept=".xlsx" @change="handleFileUpload" class="mb-4" />
            <div class="flex space-x-4">
                <button @click="uploadFile" :disabled="!file"
                    class="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Cargar
                </button>
                <button @click="$emit('close')"
                    class="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400">
                    Cancelar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import xlsx from 'node-xlsx';

const emit = defineEmits(['upload-pasantes', 'close']);
const file = ref(null);

const handleFileUpload = (event) => {
    file.value = event.target.files[0];
};

const uploadFile = () => {
    if (file.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = xlsx.parse(data);
            const sheet = workbook[0];
            const jsonData = sheet.data.slice(1).map(row => ({
                nombre: row[0],
                cedula: row[1],
                correo: row[2],
                carrera: row[3],
                semestre: row[4],
                celular: row[5]
            }));
            emit('upload-pasantes', jsonData);
        };
        reader.readAsArrayBuffer(file.value);
    }
};
</script>