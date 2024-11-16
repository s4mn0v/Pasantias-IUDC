import { v4 as uuidv4 } from 'uuid'
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore'

interface TemporalLink {
  id: string
  token: string
  expirationDate: Date
  used: boolean
  createdAt: Date
  createdBy?: string
  minutesToExpire?: number
  companyData?: {
    nombre?: string
    correo?: string
    celular?: string
    ubicacion?: string
  }
}

export const useTemporalLinksStore = defineStore('temporalLinks', {
  state: () => ({
    links: [] as TemporalLink[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    canCreateNewLink: (state) => state.links.length < 5,
    activeLinks: (state) => state.links.filter(link => 
      !link.used && new Date(link.expirationDate) > new Date()
    ),
    expiredLinks: (state) => state.links.filter(link => 
      new Date(link.expirationDate) <= new Date()
    ),
    usedLinks: (state) => state.links.filter(link => link.used)
  },

  actions: {
    async fetchLinks() {
      const db = getFirestore()
      this.isLoading = true
      this.error = null
      
      try {
        const q = query(
          collection(db, 'temporalLinks'),
          orderBy('createdAt', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        this.links = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          expirationDate: doc.data().expirationDate.toDate(),
          createdAt: doc.data().createdAt.toDate()
        })) as TemporalLink[]
      } catch (error) {
        console.error('Error fetching links:', error)
        this.error = 'Error al cargar los enlaces'
      } finally {
        this.isLoading = false
      }
    },

    async createTemporalLink(minutes: number) {
      if (!this.canCreateNewLink) {
        throw new Error('Has alcanzado el límite máximo de enlaces activos (5)')
      }

      if (minutes < 5 || minutes > 60) {
        throw new Error('El tiempo debe estar entre 5 y 60 minutos')
      }

      const db = getFirestore()
      const token = uuidv4()
      const now = new Date()
      const expirationDate = new Date(now.getTime() + (minutes * 60 * 1000))

      const newLink = {
        token,
        expirationDate,
        used: false,
        createdAt: now,
        minutesToExpire: minutes
      }

      try {
        const docRef = await addDoc(collection(db, 'temporalLinks'), newLink)
        const link = {
          id: docRef.id,
          ...newLink
        }
        this.links.unshift(link)
        return link
      } catch (error) {
        console.error('Error creating temporal link:', error)
        throw error
      }
    },

    async getValidLink(token: string) {
      const db = getFirestore()
      const q = query(
        collection(db, 'temporalLinks'),
        where('token', '==', token),
        where('used', '==', false)
      )

      try {
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) return null

        const linkDoc = querySnapshot.docs[0]
        const link = {
          id: linkDoc.id,
          ...linkDoc.data(),
          expirationDate: linkDoc.data().expirationDate.toDate(),
          createdAt: linkDoc.data().createdAt.toDate()
        } as TemporalLink

        if (new Date(link.expirationDate) < new Date()) {
          return null
        }

        return link
      } catch (error) {
        console.error('Error getting temporal link:', error)
        throw error
      }
    },

    async markLinkAsUsed(linkId: string, companyData: any) {
      const db = getFirestore()
      try {
        await updateDoc(doc(db, 'temporalLinks', linkId), {
          used: true,
          companyData,
          fromTemplink: true // Asegúrate de incluir este campo
        })
        
        const linkIndex = this.links.findIndex(link => link.id === linkId)
        if (linkIndex !== -1) {
          this.links[linkIndex].used = true
          this.links[linkIndex].companyData = companyData
        }
      } catch (error) {
        console.error('Error marking link as used:', error)
        throw error
      }
    },

    async deleteExpiredLinks() {
      const db = getFirestore()
      const now = new Date()
      
      try {
        const q = query(
          collection(db, 'temporalLinks'),
          where('expirationDate', '<', now)
        )
        
        const querySnapshot = await getDocs(q)
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)
        
        this.links = this.links.filter(link => 
          new Date(link.expirationDate) >= now
        )
      } catch (error) {
        console.error('Error deleting expired links:', error)
        throw error
      }
    },

    async deleteLink(linkId: string) {
      const db = getFirestore()
      try {
        await deleteDoc(doc(db, 'temporalLinks', linkId))
        this.links = this.links.filter(link => link.id !== linkId)
      } catch (error) {
        console.error('Error deleting link:', error)
        throw error
      }
    }
  }
})
