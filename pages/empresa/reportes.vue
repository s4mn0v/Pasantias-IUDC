<script setup>
import { ref, onMounted } from "vue";
import { useFirestoreOperations } from "~/composables/useFirestoreOperations.ts";
import { useCurrentUser } from "vuefire";

const { getReportesPorEmpresa, crearReporte, getPasantes, getEmpresas } = useFirestoreOperations();
const user = useCurrentUser();

const pasantes = ref([]);
const empresaActual = ref(null);
const nuevoReporte = ref({ pasanteId: "", urgencia: "verde", contenido: "" });
const loading = ref(true);

onMounted(async () => {
  if (user.value) {
    const empresas = await getEmpresas();
    empresaActual.value = empresas.find(
      (empresa) => empresa.id === user.value.uid
    );

    if (empresaActual.value) {
      const todosPasantes = await getPasantes();
      pasantes.value = todosPasantes.filter((pasante) =>
        empresaActual.value.pasantes.includes(pasante.id)
      );
    }
  }
  loading.value = false;
});

async function agregarReporte() {
  if (!empresaActual.value) return;

  const reporte = {
    ...nuevoReporte.value,
    empresaId: empresaActual.value.id,
    fecha: new Date().toISOString(),
  };
  await crearReporte(reporte);
  nuevoReporte.value = { pasanteId: "", urgencia: "verde", contenido: "" };
}
</script>

<template>
  <div
    class="flex font-poppins justify-center w-full bg-gray-100 p-4"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden relative"
    >
      <!-- Content -->
      <div class="relative p-8">
        <h1 class="text-3xl font-bold text-center mb-2 uppercase">
          Reportes
        </h1>

        <!-- Formulario para crear un nuevo reporte -->
        <form @submit.prevent="agregarReporte" class="mb-8 space-y-4">
          <div class="lg:flex lg:space-x-6">
            <div class="mt-3">
              <label
                for="pasante"
                class="block text-sm font-medium text-gray-700 mb-1"
                >Pasante</label
              >
              <select
                id="pasante"
                v-model="nuevoReporte.pasanteId"
                required
                class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Seleccione un pasante</option>
                <option
                  v-for="pasante in pasantes"
                  :key="pasante.id"
                  :value="pasante.id"
                >
                  {{ pasante.nombre }}
                </option>
              </select>
            </div>
            <div>
              <label
                for="urgencia"
                class="block text-sm font-medium text-gray-700 mb-1 mt-3"
                >Urgencia</label
              >
              <select
                id="urgencia"
                v-model="nuevoReporte.urgencia"
                required
                class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="verde">Verde</option>
                <option value="amarillo">Amarillo</option>
                <option value="rojo">Rojo</option>
              </select>
            </div>
          </div>    
          <div>
            <label
              for="contenido"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Contenido del reporte</label
            >
            <textarea
              id="contenido"
              v-model="nuevoReporte.contenido"
              placeholder="Contenido del reporte"
              required
              class="w-full px-3 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="4"
              maxlength="400"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out"
          >
            Crear Reporte
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
