import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    arrayUnion,
    arrayRemove,
    query,
    where,
    setDoc,
    getDoc,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Preferences } from '@capacitor/preferences';

interface User {
    email: string;
    rol: "admin" | "empresa";
}

interface Empresa {
    id?: string;
    nombre: string;
    ubicacion: string;
    celular: string;
    correo: string;
    pasantes: string[];
}

interface Pasante {
    id?: string;
    nombre: string;
    cedula: string;
    correo: string;
    carrera: string;
    semestre: string;
    empresaId?: string;
    celular: string;
}

interface Reporte {
    id?: string;
    pasanteId: string;
    empresaId: string;
    urgencia: "verde" | "amarillo" | "rojo";
    contenido: string;
    fecha: Date;
}

interface NewUser {
    email: string;
    password: string;
}

export function useFirestoreOperations() {
    const db = getFirestore();

    // Función para enviar notificación
async function enviarNotificacion(titulo: string, contenido: string) {
    const notificationId = Math.floor(Math.random() * 100000); // Genera un entero aleatorio
    await LocalNotifications.schedule({
      notifications: [
        {
          title: titulo,
          body: "Despliega la notificación para ver más detalles",
          largeBody: contenido,
          id: notificationId,
        },
      ],
    });
  }
  
  // Monitor de nuevos reportes para enviar notificaciones
    async function monitorNuevoReporte() {
        const reportesRef = collection(db, "reportes");
    
        // Obtén la fecha del último reporte notificado o inicialízala
        let { value: lastNotified } = await Preferences.get({ key: "lastNotifiedDate" });
        if (!lastNotified) {
        lastNotified = new Date().toISOString();
        await Preferences.set({ key: "lastNotifiedDate", value: lastNotified });
        }
        const lastNotifiedDate = new Date(lastNotified);
    
            onSnapshot(reportesRef, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === "added") {
                const reporte = change.doc.data();
                const reporteFecha = new Date(reporte.fecha);
                // Notificar si el reporte es más reciente que la última notificación
                if (reporteFecha > lastNotifiedDate) {
                    const preUrgencia = reporte.urgencia;
                    let urgencia = preUrgencia == "rojo" ? "🔴" : preUrgencia == "amarillo" ? "🟡" : "🟢";
                    const pasanteDoc = await getDoc(doc(db, "pasantes", reporte.pasanteId));
                    const empresaDoc = await getDoc(doc(db, "empresas", reporte.empresaId));
                    if (empresaDoc.exists() && pasanteDoc.exists()) {
                    await enviarNotificacion(
                        `Nuevo Reporte ${urgencia}`,
                        `Pasante: ${pasanteDoc.data().nombre}
Empresa: ${empresaDoc.data().nombre}`
                    );
                    await Preferences.set({ key: "lastNotifiedDate", value: reporteFecha.toISOString() });
                    }
                }
                }
            });
        });
    }  

    async function createUser(uid: string, user: User): Promise<void> {
        await setDoc(doc(db, "usuarios", uid), user);
    }

    async function eliminarReporte(id: string): Promise<void> {
        await deleteDoc(doc(db, "reportes", id));
    }

    const getEmpresas = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'empresas'))
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                pasantes: doc.data().pasantes || []
            }))
        } catch (error) {
            console.error('Error al obtener empresas:', error)
            throw error
        }
    }

    const getPasantes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'pasantes'))
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (error) {
            console.error('Error al obtener pasantes:', error)
            throw error
        }
    }

    async function getReportes(): Promise<Reporte[]> {
        const reportesRef = collection(db, "reportes");

        const q = query(reportesRef, orderBy("fecha", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Reporte)
        );
    }

    async function crearEmpresa(
        uid: string,
        empresa: Omit<Empresa, 'id'>
    ): Promise<void> {
        await setDoc(doc(db, 'empresas', uid), empresa);
    }

    const actualizarEmpresa = async (empresaId: string, datos: any) => {
        try {
            const empresaRef = doc(db, 'empresas', empresaId)
            await updateDoc(empresaRef, datos)
            return true
        } catch (error) {
            console.error('Error al actualizar empresa:', error)
            throw error
        }
    }

    const eliminarEmpresa = async (empresaId: string) => {
        try {
            await deleteDoc(doc(db, 'empresas', empresaId))
            return true
        } catch (error) {
            console.error('Error al eliminar empresa:', error)
            throw error
        }
    }

    async function crearPasante(
        pasante: Omit<Pasante, "id">
    ): Promise<string> {
        const docRef = await addDoc(collection(db, "pasantes"), pasante);
        return docRef.id;
    }

    async function actualizarPasante(
        id: string,
        pasante: Partial<Pasante>
    ): Promise<void> {
        await updateDoc(doc(db, "pasantes", id), pasante);
    }

    async function eliminarPasante(id: string): Promise<void> {
        await deleteDoc(doc(db, "pasantes", id));
    }

    const asignarPasanteAEmpresa = async (pasanteId: string, empresaId: string, empresaNombre: string) => {
        try {
            // 1. Verificar que el pasante existe
            const pasanteRef = doc(db, 'pasantes', pasanteId)
            const pasanteDoc = await getDoc(pasanteRef)

            if (!pasanteDoc.exists()) {
                throw new Error('El pasante no existe')
            }

            // 2. Verificar que la empresa existe
            const empresaRef = doc(db, 'empresas', empresaId)
            const empresaDoc = await getDoc(empresaRef)

            if (!empresaDoc.exists()) {
                throw new Error('La empresa no existe')
            }

            // 3. Actualizar el pasante con la referencia a la empresa
            await updateDoc(pasanteRef, {
                empresaId: empresaId,
                empresaNombre: empresaNombre
            })

            // 4. Actualizar la empresa añadiendo el pasante al array
            const empresaData = empresaDoc.data()
            const pasantesActuales = empresaData.pasantes || []

            if (!pasantesActuales.includes(pasanteId)) {
                await updateDoc(empresaRef, {
                    pasantes: [...pasantesActuales, pasanteId]
                })
            }

            return true
        } catch (error) {
            console.error('Error al asignar pasante:', error)
            throw error
        }
    }

    const removerPasanteDeEmpresa = async (pasanteId: string, empresaId: string) => {
        try {
            // 1. Actualizar el pasante removiendo la referencia a la empresa
            const pasanteRef = doc(db, 'pasantes', pasanteId)
            await updateDoc(pasanteRef, {
                empresaId: null,
                empresaNombre: null
            })

            // 2. Actualizar la empresa removiendo el pasante del array
            const empresaRef = doc(db, 'empresas', empresaId)
            const empresaDoc = await getDoc(empresaRef)

            if (empresaDoc.exists()) {
                const empresaData = empresaDoc.data()
                const pasantesActualizados = empresaData.pasantes.filter((id: string) => id !== pasanteId)

                await updateDoc(empresaRef, {
                    pasantes: pasantesActualizados
                })
            }

            return true
        } catch (error) {
            console.error('Error al remover pasante:', error)
            throw error
        }
    }

    async function crearReporte(reporte: Omit<Reporte, "id">): Promise<string> {
        const docRef = await addDoc(collection(db, "reportes"), reporte);
        return docRef.id;
    }

    async function getReportesPorEmpresa(empresaId: string): Promise<Reporte[]> {
        const reportesRef = collection(db, "reportes");
        const q = query(reportesRef, where("empresaId", "==", empresaId), orderBy("fecha", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Reporte)
        );
    }

    async function getReportesPorPasante(pasanteId: string): Promise<Reporte[]> {
        const reportesRef = collection(db, "reportes");
        const q = query(reportesRef, where("pasanteId", "==", pasanteId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Reporte)
        );
    }

    async function crearEmpresaConUsuario(
        empresa: Omit<Empresa, 'id' | 'pasantes'>,
        usuario: NewUser
    ): Promise<void> {
        const auth = getAuth();

        try {
            // Crear el usuario en Firebase Auth
            const { user } = await createUserWithEmailAndPassword(auth, usuario.email, usuario.password);

            // Crear la empresa en Firestore
            await crearEmpresa(user.uid, {
                ...empresa,
                pasantes: [],
            });

            // Crear el usuario en la colección 'usuarios' de Firestore
            await createUser(user.uid, {
                email: usuario.email,
                rol: 'empresa',
            });
        } catch (error) {
            console.error('Error al crear la empresa y el usuario:', error);
            throw error;
        }
    }

    return {
        crearReporte,
        createUser,
        getEmpresas,
        getPasantes,
        getReportes,
        crearEmpresa,
        actualizarEmpresa,
        eliminarEmpresa,
        crearPasante,
        actualizarPasante,
        eliminarPasante,
        asignarPasanteAEmpresa,
        removerPasanteDeEmpresa,
        getReportesPorEmpresa,
        getReportesPorPasante,
        eliminarReporte,
        crearEmpresaConUsuario,
        monitorNuevoReporte
    };
}
