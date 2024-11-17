<script setup>
import { ref, onMounted, computed } from "vue";
import { useFirestoreOperations } from "~/composables/useFirestoreOperations.ts";
import xlsx from 'node-xlsx';

const {
    getPasantes,
    crearPasante,
    actualizarPasante,
    eliminarPasante,
    getEmpresas,
    asignarPasanteAEmpresa,
    removerPasanteDeEmpresa,
} = useFirestoreOperations();

const pasantes = ref([]);
const empresas = ref([]);
const filtro = ref("");
const nuevoPasante = ref({
    nombre: "",
    cedula: "",
    correo: "",
    carrera: "",
    semestre: "",
    celular: "",
});
const editandoPasante = ref(null);
const mostrarFormulario = ref(false);
const mostrarPopup = ref(false);

onMounted(async () => {
    pasantes.value = await getPasantes();
    empresas.value = await getEmpresas();
});

const pasanteActual = computed(
    () => editandoPasante.value || nuevoPasante.value
);

const pasantesFiltrados = computed(() => {
    const filtroLower = filtro.value.toLowerCase();
    return pasantes.value.filter(
        (pasante) =>
            pasante.nombre.toLowerCase().includes(filtroLower) ||
            pasante.cedula.includes(filtroLower)
    );
});

async function agregarPasante() {
    await crearPasante(nuevoPasante.value);
    pasantes.value = await getPasantes();
    resetNuevoPasante();
    mostrarPopup.value = false;
}

function resetNuevoPasante() {
    nuevoPasante.value = {
        nombre: "",
        cedula: "",
        correo: "",
        carrera: "",
        semestre: "",
        celular: "",
    };
}

function iniciarEdicion(pasante) {
    editandoPasante.value = { ...pasante };
    mostrarFormulario.value = true;
}

async function guardarEdicion() {
    if (editandoPasante.value) {
        await actualizarPasante(editandoPasante.value.id, editandoPasante.value);
        pasantes.value = await getPasantes();
        editandoPasante.value = null;
        mostrarFormulario.value = false;
    }
}

async function borrarPasante(id) {
    await eliminarPasante(id);
    pasantes.value = await getPasantes();
}

async function asignarEmpresa(pasanteId, empresaId, empresaNombre) {
    await asignarPasanteAEmpresa(pasanteId, empresaId, empresaNombre);
    pasantes.value = await getPasantes();
}

async function removerEmpresa(pasanteId, empresaId) {
    await removerPasanteDeEmpresa(pasanteId, empresaId);
    pasantes.value = await getPasantes();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
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

        for (const pasante of jsonData) {
            await crearPasante(pasante);
        }

        pasantes.value = await getPasantes();
    };

    reader.readAsArrayBuffer(file);
}
</script>

<template>
    <div class="flex font-poppins items-center justify-center min-h-screen w-full bg-gray-100 p-4">
        <div class="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden relative">
            <div class="relative p-8">
                <h1 class="text-3xl font-bold text-center text-purple-600 mb-8">
                    Gestión de Pasantes
                </h1>

                <input v-model="filtro" type="text" placeholder="Buscar por nombre o cédula"
                    class="w-full px-3 py-2 mb-6 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

                <div class="flex space-x-4 mb-6">
                    <button @click="mostrarPopup = true"
                        class="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out">
                        Agregar Pasante
                    </button>
                    <label for="file-upload"
                        class="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 ease-in-out text-center cursor-pointer">
                        Cargar XLSX
                    </label>
                    <input id="file-upload" type="file" accept=".xlsx" @change="handleFileUpload" class="hidden" />
                </div>

                <!-- Pop-up para agregar pasante manualmente -->
                <div v-if="mostrarPopup"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 class="text-2xl font-bold mb-4">Agregar Pasante</h2>
                        <form @submit.prevent="agregarPasante" class="space-y-4">
                            <div v-for="field in ['nombre', 'cedula', 'correo', 'carrera', 'semestre', 'celular']"
                                :key="field">
                                <label :for="field" class="block text-sm font-medium text-gray-700 mb-1">
                                    {{ field.charAt(0).toUpperCase() + field.slice(1) }}
                                </label>
                                <input :id="field" v-model="nuevoPasante[field]"
                                    :type="field === 'correo' ? 'email' : 'text'" required
                                    class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div class="flex space-x-4">
                                <button type="submit"
                                    class="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700">
                                    Agregar Pasante
                                </button>
                                <button @click="mostrarPopup = false" type="button"
                                    class="flex-1 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-gray-400">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="space-y-4">
                    <div v-for="pasante in pasantesFiltrados" :key="pasante.id"
                        class="bg-gray-200 rounded-md p-4 shadow-md">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="text-lg font-semibold text-gray-800">
                                {{ pasante.nombre }} - {{ pasante.cedula }}
                            </h2>
                            <div class="space-x-2 flex">
                                <button @click="iniciarEdicion(pasante)"
                                    class="flex items-center justify-center px-4 py-1 text-white bg-blue-600 font-semibold rounded-full border border-blue-600 hover:text-blue-600 hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
                                    <Icon name="uil:edit" class="w-5 h-5" />
                                </button>
                                <button @click="borrarPasante(pasante.id)"
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
                            <select @change="($event) =>
                                asignarEmpresa(
                                    pasante.id,
                                    $event.target.value,
                                    empresas.find((e) => e.id === $event.target.value)?.nombre
                                )
                                " class="w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-md py-2 px-3">
                                <option value="">Seleccionar empresa</option>
                                <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id"
                                    :selected="empresa.id === pasante.empresaId">
                                    {{ empresa.nombre }}
                                </option>
                            </select>
                            <button v-if="pasante.empresaId" @click="removerEmpresa(pasante.id, pasante.empresaId)"
                                class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm">
                                Remover de empresa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>