<template>
  <div class="min-h-screen flex justify-center items-center px-4">
    <div class="bg-white rounded-lg p-8 max-w-4xl w-full drop-shadow-2xl flex flex-col md:flex-row">
      <div class="hidden md:block w-1/2">
        <img src="/assets/img/login.jpg" alt="login" class="object-cover w-full h-full rounded-r-lg">
      </div>
      <div class="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <h1 class="text-4xl font-bold mb-8">Bienvenido</h1>
        <form @submit.prevent="signIn" class="space-y-6">
          <div>
            <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="border border-gray-300 shadow p-3 w-full rounded mb- outline-none"
              placeholder="Ingresa tu email"
              required
            />
            <p v-if="error.email" class="text-red-500 text-sm mt-1">{{ error.email }}</p>
          </div>
          <div>
            <label for="password" class="block text-gray-700 font-bold mb-2">Contraseña</label>
            <div class="relative">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="border border-gray-300 shadow p-3 w-full rounded mb- outline-none"
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
            <p v-if="error.password" class="text-red-500 text-sm mt-1">{{ error.password }}</p>
          </div>
          <button
            type="submit"
            class="w-full bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-4 rounded-lg"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Procesando...' : 'Iniciar sesión' }}
          </button>
        </form>
        <p v-if="error.general" class="text-red-500 text-center mt-4">{{ error.general }}</p>
        <div class="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
          <p class="cursor-default">
            Al iniciar sesión, aceptas nuestros
            <a class="group text-blue-400 transition-all duration-100 ease-in-out" href="#">
              <span class="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Términos
              </span>
            </a>
            y
            <a class="group text-blue-400 transition-all duration-100 ease-in-out" href="#">
              <span class="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Política de Privacidad
              </span>
            </a>
          </p>
        </div>
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
  general: ''
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
    general: ''
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
</script>
