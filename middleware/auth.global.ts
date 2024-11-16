import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { getCurrentUser } from 'vuefire'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const nuxtApp = useNuxtApp()

    // Set loading state to true
    nuxtApp.isLoading = true

    // Add a small delay to ensure the loader is shown
    await new Promise(resolve => setTimeout(resolve, 500))

    // Lista de rutas públicas que no requieren autenticación
    const publicRoutes = [
        '/login',
        '/registro-exitoso'
    ]

    // Verifica si la ruta actual es un enla  ce temporal de registro
    const isTemporalLink = to.path.startsWith('/register/')

    const user = await getCurrentUser()

    // Permite acceso a rutas públicas y enlaces temporales sin autenticación
    if (!user && !publicRoutes.includes(to.path) && !isTemporalLink) {
        nuxtApp.isLoading = false
        return navigateTo('/login')
    }

    if (user) {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
        const userData = userDoc.data()

        // Redireccionar según el rol si el usuario está autenticado
        if (userData && userData.rol) {
            // No redirigir si el usuario está accediendo a una ruta apropiada para su rol
            if (userData.rol === 'admin' && !to.path.startsWith('/admin') && !publicRoutes.includes(to.path)) {
                nuxtApp.isLoading = false
                return navigateTo('/admin/dashboard')
            } else if (userData.rol === 'empresa' && !to.path.startsWith('/empresa') && !publicRoutes.includes(to.path)) {
                nuxtApp.isLoading = false
                return navigateTo('/empresa/dashboard')
            }
        } else if (!publicRoutes.includes(to.path)) {
            // Si el usuario no tiene rol, redirigir al login
            nuxtApp.isLoading = false
            return navigateTo('/login')
        }
    }

    // Set loading state to false after all checks
    nuxtApp.isLoading = false

    // Si la ruta no existe y no se ha redirigido antes, mostrar la página 404
    if (to.matched.length === 0) {
        return navigateTo('/error')
    }
})