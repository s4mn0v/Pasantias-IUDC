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
const passwordVisible = ref(false)

// Campos del formulario
const form = ref({
    nombre: '',
    celular: '',
    correo: '',
    ubicacion: '',
    password: '',
    nit: ''
})

// Mensajes de error
const formErrors = ref({
    correo: '',
    celular: '',
    nit: ''
})

// Validación de NIT
function validateNIT(nit) {
    // El NIT colombiano generalmente tiene 9 a 12 dígitos, y no debe contener letras.
    const nitRegex = /^[0-9]{9,12}$/;
    return nitRegex.test(nit);
}

// Validación de los campos
function validateForm() {
    let isValid = true;

    // Validar formato del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.correo)) {
        formErrors.value.correo = 'Por favor ingresa un correo electrónico válido.';
        isValid = false;
    } else {
        formErrors.value.correo = '';
    }

    // Validar número de celular colombiano
    const celularRegex = /^3\d{9}$/;
    if (!celularRegex.test(form.value.celular)) {
        formErrors.value.celular = 'Por favor ingresa un número celular válido de Colombia (10 dígitos, iniciando con 3).';
        isValid = false;
    } else {
        formErrors.value.celular = '';
    }

    // Validar NIT
    if (!form.value.nit) {
        formErrors.value.nit = 'Por favor ingresa el NIT de la empresa.';
        isValid = false;
    } else if (!validateNIT(form.value.nit)) {
        formErrors.value.nit = 'Por favor ingresa un NIT válido (solo números, entre 9 y 12 dígitos).';
        isValid = false;
    } else {
        formErrors.value.nit = '';
    }

    return isValid;
}

// Filtrar entrada de celular para permitir solo números
function filterCelularInput(event) {
    const input = event.target.value;
    // Solo mantener los dígitos
    event.target.value = input.replace(/\D/g, '');
    form.value.celular = event.target.value;
}

// Filtrar entrada de NIT para permitir solo números
function filterNITInput(event) {
    const input = event.target.value;
    // Solo mantener los dígitos
    event.target.value = input.replace(/\D/g, '');
    form.value.nit = event.target.value;
}

async function handleSubmit() {
    if (!validateForm()) return;

    try {
        await temporalLinksStore.markLinkAsUsed(linkId.value, form.value);
        await useFirestoreOperations().crearEmpresaConUsuario(
            {
                nombre: form.value.nombre,
                ubicacion: form.value.ubicacion,
                celular: form.value.celular,
                correo: form.value.correo,
                nit: form.value.nit,
            },
            {
                email: form.value.correo,
                password: form.value.password,
            }
        );
        // Primero navegamos a la página de éxito
        await router.push('/registro-exitoso');
        // Luego recargamos la página usando navigateTo con la opción de recarga
        await navigateTo(window.location.pathname, {
            replace: true,
            external: true
        });
    } catch (e) {
        error.value = 'Error al registrar la empresa';
    }
}

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
                    <span v-if="formErrors.correo" class="text-red-500 text-sm">{{ formErrors.correo }}</span>
                </div>

                <div class="relative">
                    <input v-model="form.password" :type="passwordVisible ? 'text' : 'password'"
                        placeholder="Contraseña" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                    <button type="button" @click="passwordVisible = !passwordVisible"
                        class="absolute inset-y-0 right-0 flex items-center px-3">
                        <Icon :name="passwordVisible ? 'uil:eye-slash' : 'uil:eye'" class="w-5 h-5 text-purple-700" />
                    </button>
                </div>

                <div>
                    <input v-model="form.celular" type="tel" placeholder="Celular" required @input="filterCelularInput"
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                    <span v-if="formErrors.celular" class="text-red-500 text-sm">{{ formErrors.celular }}</span>
                </div>

                <div>
                    <input v-model="form.ubicacion" type="text" placeholder="Ubicación" required
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                </div>

                <div>
                    <input v-model="form.nit" type="text" placeholder="NIT de la empresa" required
                        @input="filterNITInput"
                        class="w-full px-4 py-2 rounded border border-gray-400 shadow-sm outline-none">
                    <span v-if="formErrors.nit" class="text-red-500 text-sm">{{ formErrors.nit }}</span>
                </div>

                <button type="submit"
                    class="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300">
                    Registrar Empresa
                </button>
            </form>
        </div>
    </div>
</template>
