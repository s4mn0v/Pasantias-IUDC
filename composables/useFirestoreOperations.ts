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
    orderBy
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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

    async function createUser(uid: string, user: User): Promise<void> {
        await setDoc(doc(db, "usuarios", uid), user);
    }

    async function eliminarReporte(id: string): Promise<void> {
        await deleteDoc(doc(db, "reportes", id));
    }

    async function getEmpresas(): Promise<Empresa[]> {
        const empresasRef = collection(db, "empresas");
        const snapshot = await getDocs(empresasRef);
        return snapshot.docs.map(
            (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Empresa)
        );
    }

    async function getPasantes(): Promise<Pasante[]> {
        const pasantesRef = collection(db, "pasantes");
        const snapshot = await getDocs(pasantesRef);
        return snapshot.docs.map(
            (doc) =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Pasante)
        );
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

    async function actualizarEmpresa(
        id: string,
        empresa: Partial<Empresa>
    ): Promise<void> {
        await updateDoc(doc(db, "empresas", id), empresa);
    }

    async function eliminarEmpresa(id: string): Promise<void> {
        await deleteDoc(doc(db, "empresas", id));
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

    async function asignarPasanteAEmpresa(
        pasanteId: string,
        empresaId: string,
        empresaNombre: string
    ): Promise<void> {
        const pasanteRef = doc(db, "pasantes", pasanteId);
        const empresaRef = doc(db, "empresas", empresaId);

        // Check if the pasante is already assigned to a company
        const pasanteDoc = await getDoc(pasanteRef);
        if (!pasanteDoc.exists()) {
            throw new Error("El pasante no existe");
        }

        const pasanteData = pasanteDoc.data();
        if (pasanteData.empresaId) {
            throw new Error("El pasante ya está asignado a una empresa");
        }

        // Assign the pasante to the new company
        await updateDoc(pasanteRef, { empresaId: empresaId });
        await updateDoc(empresaRef, {
            pasantes: arrayUnion(pasanteId),
        });
    }

    async function removerPasanteDeEmpresa(
        pasanteId: string,
        empresaId: string
    ): Promise<void> {
        const pasanteRef = doc(db, "pasantes", pasanteId);
        const empresaRef = doc(db, "empresas", empresaId);

        await updateDoc(pasanteRef, { empresaId: null });
        await updateDoc(empresaRef, {
            pasantes: arrayRemove(pasanteId),
        });
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
        crearEmpresaConUsuario
    };
}
