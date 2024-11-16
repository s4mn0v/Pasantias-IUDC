<script setup>
import { ref, onMounted } from 'vue'
import { useTemporalLinksStore } from '~/stores/useTemporalLinks'
import { useRouter, useRoute } from 'vue-router'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations';

const router = useRouter()
const route = useRoute()
const temporalLinksStore = useTemporalLinksStore()
const isValidLink = ref(false)
const error = ref('')
const linkId = ref('')

const form = ref({
    nombre: '',
    celular: '',
    correo: '',
    ubicacion: '',
    password: ''
})

onMounted(async () => {
    const token = route.params.token
    try {
        const link = await temporalLinksStore.getValidLink(token)
        if (link) {
            isValidLink.value = true
            linkId.value = link.id
        } else {
            error.value = 'El enlace ha expirado o no es válido'
        }
    } catch (e) {
        error.value = 'Error al verificar el enlace'
    }
})

async function handleSubmit() {
    try {
        await temporalLinksStore.markLinkAsUsed(linkId.value, form.value);
        await useFirestoreOperations().crearEmpresaConUsuario(
            {
                nombre: form.value.nombre,
                ubicacion: form.value.ubicacion,
                celular: form.value.celular,
                correo: form.value.correo,
            },
            {
                email: form.value.correo,
                password: form.value.password,
            }
        );
        router.push('/registro-exitoso');
    } catch (e) {
        error.value = 'Error al registrar la empresa';
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-300 flex items-center justify-center p-4">
        <div class="max-w-md w-full rounded-lg p-8 shadow-lg bg-white">
            <h1 class="text-2xl font-bold text-center text-purple-500 mb-6 uppercase">
                Registro de Empresa
            </h1>

            <div v-if="error" class="bg-red-500 text-white p-4 rounded mb-6">
                {{ error }}
            </div>

            <form v-if="isValidLink" @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <input v-model="form.nombre" type="text" placeholder="Nombre de la empresa" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                </div>

                <div>
                    <input v-model="form.correo" type="email" placeholder="Correo electrónico" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                </div>

                <div>
                    <input v-model="form.password" type="password" placeholder="Contraseña" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                </div>

                <div>
                    <input v-model="form.celular" type="tel" placeholder="Celular" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                </div>

                <div>
                    <input v-model="form.ubicacion" type="text" placeholder="Ubicación" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                </div>

                <button type="submit"
                    class="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300">
                    Registrar Empresa
                </button>
            </form>
        </div>
    </div>
</template>