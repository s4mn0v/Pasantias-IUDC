import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export function useAuthOperations() {
    const auth = getAuth()
    const router = useRouter()

    const logout = async () => {
        try {
            await signOut(auth)
            router.push('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return {
        logout
    }
}