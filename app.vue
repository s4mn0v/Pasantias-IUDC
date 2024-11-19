<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCurrentUser } from 'vuefire'
import { useRouter } from '#app' // Correcta importación desde #app (documentación oficial)
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { LocalNotifications } from '@capacitor/local-notifications'
import { useFirestoreOperations } from '~/composables/useFirestoreOperations'

const user = useCurrentUser()
const router = useRouter() // Uso de useRouter desde Nuxt 3
const userRole = ref(null)
const isLoading = ref(true) // Añadido para manejar el estado de carga

const showHeader = computed(() => {
  return user.value && userRole.value
})

// Manejo de la carga inicial
const handleInitialLoad = async () => {
  if (user.value) {
    const db = getFirestore()
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', user.value.uid))
      const userData = userDoc.data()
      userRole.value = userData?.rol || null
    } catch (error) {
      console.error('Error fetching user role:', error)
      userRole.value = null
    }
  } else {
    userRole.value = null
  }
  isLoading.value = false
}

// Solicitar permiso de notificaciones
const solicitarPermisoNotificaciones = async () => {
  await LocalNotifications.requestPermissions()
}

// Monitorizar nuevos reportes
const { monitorNuevoReporte } = useFirestoreOperations()

onMounted(async () => {
  // Manejar la carga inicial
  await handleInitialLoad()
  // Solicitar permiso de notificaciones
  await solicitarPermisoNotificaciones()
  // Monitorizar nuevos reportes si el usuario es un administrador
  if (user.value && (userRole.value === 'admin')) {
    monitorNuevoReporte()
  }
  // Observar cambios en el usuario
  watch(user, async (currentUser, prevUser) => {
    isLoading.value = true
    if (prevUser && !currentUser) {
      userRole.value = null
      isLoading.value = false
      return router.replace('/login') // Redirección a login cuando el usuario se desconecta
    }
    if (currentUser) {
      await handleInitialLoad()
    }
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>

    <!-- Content -->
    <div v-else>
      <AdminNavbar v-if="showHeader && userRole === 'admin'" />
      <EmpresaNavbar v-else-if="showHeader && userRole === 'empresa'" />
      <NuxtPage />
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
