# Folder Structure
- components/
  - admin/
    - dashboard/
      - FilterModal.vue
      - ReporteCard.vue
      - ReportesList.vue
      - SearchReportes.vue
    - Navbar.vue
  - empresas/
    - Navbar.vue
    - Pasantes.vue
    - ReportesList.vue
  - LoginForm.vue
- composables
  - useAuthOperations.ts
  - useFirestoreOperations.ts
- middleware
  - auth.global.ts
- pages/
  - admin/
    - dashboard.vue
    - empresas.vue
    - pasantes.vue
    - temporal-links.vue
  - empresa/
    - dashboard.vue
    - reportes.vue
  - register/
    - [token].vue
  - index.vue
  - login.vue
- stores/
  - useTemporalLinks.ts

# Install vuefire and nuxt firebase
```
npm i firebase vuefire nuxt-vuefire
```