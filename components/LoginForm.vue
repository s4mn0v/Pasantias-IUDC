<template>
  <div class="min-h-screen flex justify-center items-center px-4">
    <div class="bg-white rounded-lg p-8 max-w-4xl w-full drop-shadow-2xl flex flex-col md:flex-row">
      <div class="hidden md:block w-1/2">
        <img src="/assets/img/login.jpg" alt="login" class="object-cover w-full h-full rounded-r-lg">
      </div>
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h1 class="text-4xl font-extrabold mb-8 uppercase text-center tracking-wider">Bienvenido</h1> 
        <form @submit.prevent="signIn" class="space-y-6">
          <!-- Notificaciones de error -->
          <div
            v-if="error.email"
            class="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded"
            role="alert"
          >
            <span class="block sm:inline pl-2">
              <strong class="font-bold">{{ error.email }}</strong>
            </span>
            <span class="inline cursor-pointer" @click="closeMessage('email')">
              <Icon name="uil:multiply" />
            </span>
          </div>
          <div
            v-if="error.password"
            class="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded"
            role="alert"
          >
            <span class="block sm:inline pl-2">
              <strong class="font-bold">{{ error.password }}</strong>
            </span>
            <span class="inline cursor-pointer" @click="closeMessage('password')">
              <Icon name="uil:multiply" />
            </span>
          </div>
          <div
            v-if="error.general"
            class="flex items-center justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded"
            role="alert"
          >
            <span class="block sm:inline pl-2">
              <strong class="font-bold">{{ error.general }}</strong>
            </span>
            <span class="inline cursor-pointer" @click="closeMessage('general')">
              <Icon name="uil:multiply" />
            </span>
          </div>

          <div class="relative">
            <!-- Icono de usuario -->
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Icon name="uil:user" class="w-5 h-5 text-gray-400" />
            </span>
            <input
              id="email"
              v-model="email"
              type="email"
              class="border border-gray-300 shadow p-3 w-full pl-10 rounded mb- outline-none"
              placeholder="Ingresa tu email"
              required
            />
          </div>
          <div class="relative">
            <!-- Icono de candado -->
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Icon name="uil:lock-alt" class="w-5 h-5 text-gray-400" />
            </span>
            <input
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="border border-gray-300 shadow p-3 w-full pl-10 rounded mb- outline-none"
              placeholder="••••••••"
              required
            />
            <span
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-purple-700"
            >
              <Icon
                :name="passwordVisible ? 'uil:eye-slash' : 'uil:eye'"
                class="w-5 h-5 text-purple-700"
              />
            </span>
          </div>
          <button
            type="submit"
            class="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-lg"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Procesando...' : 'Iniciar sesión' }}
          </button>
        </form>

        <!-- Mensajes de error de restablecimiento de contraseña -->
        <div
          v-if="error.reset"
          class="flex items-center justify-between bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 my-2 rounded"
          role="alert"
        >
          <span class="block sm:inline pl-2">
            <strong class="font-bold">{{ error.reset }}</strong>
          </span>
          <span class="inline cursor-pointer" @click="closeMessage('reset')">
            <Icon name="uil:multiply" />
          </span>
        </div>

        <p class="text-center mt-4">
          <button
            class="text-sm text-blue-400 hover:text-blue-600"
            @click="resetPassword"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const passwordVisible = ref(false);
const error = ref({
  email: '',
  password: '',
  general: '',
  reset: '', // Para errores de restablecimiento de contraseña
});
const router = useRouter();

function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

async function signIn() {
  // Limpiar errores anteriores
  error.value = {
    email: '',
    password: '',
    general: '',
    reset: '',
  };

  // Elimina espacios en blanco al inicio y final de los valores
  email.value = email.value.trim();
  password.value = password.value.trim();

  // Validación de campos vacíos
  if (!email.value || !password.value) {
    if (!email.value) error.value.email = 'El correo es obligatorio.';
    if (!password.value) error.value.password = 'La contraseña es obligatoria.';
    return;
  }

  isLoading.value = true;

  try {
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');

    const auth = getAuth();
    const db = getFirestore();

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    const userData = userDoc.data();

    if (userData && userData.rol) {
      if (userData.rol === 'admin') {
        await router.push('/admin/dashboard');
      } else if (userData.rol === 'empresa') {
        await router.push('/empresa/dashboard');
      } else {
        console.warn("Rol no reconocido:", userData.rol);
      }
    } else {
      console.error("El usuario no tiene rol asignado en la base de datos.");
    }
  } catch (e) {
    if (e.code === 'auth/invalid-credential') {
      error.value.password = 'Credenciales incorrectas.';
    } else if (e.code === 'auth/invalid-email') {
      error.value.email = 'No existe una cuenta con este correo.';
    } else if (e.code === 'auth/network-request-failed') {
      error.value.general = 'No se pudo establecer una conexión. Verifica tu conexión a Internet.';
    } else {
      error.value.general = 'Hubo un error al intentar iniciar sesión. Intenta nuevamente.';
    }
    console.error(e.message);
  } finally {
    isLoading.value = false;
  }
}

async function resetPassword() {
  // Limpiar errores previos
  error.value.reset = '';
  error.value.general = '';

  // Validar si el correo está vacío
  if (!email.value.trim()) {
    error.value.email = 'Por favor, ingresa tu correo para restablecer la contraseña.';
    return;
  }

  // Llamar a Firebase para enviar el correo de restablecimiento
  try {
    const { getAuth, sendPasswordResetEmail } = await import('firebase/auth');
    const auth = getAuth();

    await sendPasswordResetEmail(auth, email.value);
    error.value.reset =
      'Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.';
  } catch (e) {
    if (e.code === 'auth/invalid-email') {
      error.value.email = 'El correo ingresado no es válido.';
    } else if (e.code === 'auth/user-not-found') {
      error.value.email = 'No hay una cuenta asociada a este correo.';
    } else {
      error.value.general = 'Hubo un error al intentar restablecer la contraseña.';
    }
    console.error(e.message);
  }
}

function closeMessage(type) {
  error.value[type] = ''; // Ocultar el mensaje de error
}
</script>
