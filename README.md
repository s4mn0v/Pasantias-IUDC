# Folder Structure
- .firebase/
- assests/
  - css
    - tailwind.css
  - img/
    - login.jpg
    - logonegro.png
- components/
  - admin/
    - dashboard/
      - FilterModal.vue
      - ReporteCard.vue
      - ReportesList.vue
      - SearchReportes.vue
    - pasantes/
      - PasantesActions.vue
      - PasantesAddPopup.vue
      - PasantesAssignCompanyPopup.vue
      - PasantesEditPopup.vue
      - PasantesList.vue
      - PasantesPagination.vue
      - PasantesSearch.vue
      - PasantesUploadPopup.vue
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
    - pasantes.vue
    - reportes.vue
  - register/
    - [token].vue
  - index.vue
  - login.vue
- server
  - tsconfig.json
- stores/
  - useTemporalLinks.ts
- .firebaserc
- .gitignore
- app.vue
- error.vue
- firebase.json
- nuxt.config.ts
- package-lock.json
- package.json
- tailwind.config.js
- tsconfig.json

---
# Folder Explication
This **Nuxt 3** project with **Firebase** integration, files and folders have specific roles that allow both the operation of the application on the client side and the configuration of interactions with Firebase and other services.

### 1. **.firebase/**
- This directory is usually created by Firebase tools (such as Firebase CLI) to store configuration files related to the project on the Firebase platform. It is not common for it to be directly in the source code if you are not working with Firebase services locally (for example, for emulators or deployment).

### 2. **assets/**
- The `assets` folder contains static resources that can be used in the application, such as images, fonts, and CSS files.

- **assets/css/tailwind.css**: This file contains the configuration for **Tailwind CSS**, a highly configurable layout framework based on utility classes.
- **assets/img/**: Images used in the application are stored here.
- **login.jpg**: Image probably used on the login page.
- **logonegro.png**: Probably the application logo in a black version.

### 3. **components/**
- This folder contains the Vue.js components used in various parts of the application. It is organized into subdirectories to differentiate functionalities according to user roles or parts of the application.

- **admin/**: Specific components for the administration view, including dashboards, reports, and "intern" management.
- **dashboard/FilterModal.vue**: Modal for filtering data in the dashboard.
- **dashboard/ReporteCard.vue**: Component that represents a report card.
- **dashboard/ReportesList.vue**: List of reports that can probably be viewed or managed from the admin.
- **dashboard/SearchReportes.vue**: Component to search for reports within the dashboard.
- **interns/InternsList.vue**: List of interns.
- **interns/InternsAddPopup.vue**: Popup to add a new intern.
- **interns/InternsAssignCompanyPopup.vue**: Popup to assign an intern to a company.
- **interns/InternsEditPopup.vue**: Popup to edit an intern's information.
- **interns/InternsPagination.vue**: Component to handle pagination of the intern list.
- **interns/InternsSearch.vue**: Component to search for interns.
- **interns/InternsUploadPopup.vue**: Popup to upload information related to interns.

- **companies/**: Components for company views.
- **Navbar.vue**: Navigation bar specific to company views.
- **Interns.vue**: View that shows the interns of a company.
- **ReportesList.vue**: List of reports that the company can see.

- **LoginForm.vue**: Component to show the login form.

### 4. **composables/**
- **composables** in Nuxt 3 are reusable functions that allow you to manage state or logic in multiple components. This pattern is used to share functions globally.

- **useAuthOperations.ts**: Function that handles authentication-related operations, such as login, logout, and user verification.
- **useFirestoreOperations.ts**: Function to interact with Firebase Firestore (Firebase's real-time database), probably to add, get, update, or delete documents.

### 5. **middleware/**
- Middleware in Nuxt 3 is used to handle logic before a page is rendered. They allow, for example, to perform authentication checks or redirect to certain routes.

- **auth.global.ts**: Global middleware that probably checks if a user is authenticated before allowing access to protected pages.

### 6. **pages/**
- Pages in Nuxt 3 correspond to application routes. Nuxt automatically creates the routes based on the file structure in this folder.

- **admin/**: Pages for admin users.
- **dashboard.vue**: Main dashboard view for admins.
- **empresas.vue**: View for managing companies.
- **interns.vue**: View for managing interns.
- **temporary-links.vue**: Page for temporary links (probably for invitations or limited access).

- **empresa/**: Pages that correspond to company views.
- **dashboard.vue**: Specific dashboard for each company.
- **interns.vue**: View of the interns associated with a company.
- **reports.vue**: Page to view or manage reports related to a company.

- **register/**: Views related to user registration.
- **[token].vue**: Dynamic page that probably handles a temporary registration link based on a `token` (to validate the registration of new users).
- **index.vue**: Main page of the application, which is loaded when no route is specified.
- **login.vue**: User login page.

### 7. **server/**
- **tsconfig.json**: TypeScript configuration file, which allows you to specify how TypeScript code should be compiled and executed in the project.

### 8. **stores/**
- Nuxt 3 introduces a **stores** system to handle the global state of the application in a reactive way.

- **useTemporalLinks.ts**: Probably handles state related to temporary links (e.g. registration or login links).

### 9. **Configuration Files and Dependencies**

- **.firebaserc**: Firebase configuration file containing Firebase project settings, such as project name and environment aliases.
- **.gitignore**: Specifies which files or folders should be ignored by Git, such as auto-generated or temporary files.
- **firebase.json**: Configuration file for Firebase, defining how feature deployment and hosting on Firebase should behave.
- **nuxt.config.ts**: Nuxt 3's main configuration file, where global application settings are defined, such as plugins, route handling, environment variables, etc.
- **package-lock.json** and **package.json**: Dependency management files for **npm** or **yarn**, where libraries used in the project are defined.
- **tailwind.config.js**: Configuration file for Tailwind CSS, where customizations such as colors, typography, and other visual aspects are defined.
- **tsconfig.json**: Configuration file for TypeScript, defining how `.ts` and `.tsx` files should be compiled in the project.


### Summary:
- **assets** contains static resources such as images and CSS.
- **components** includes Vue.js components organized by sections (admin, companies, login, etc.).
- **composables** handles reusable functions such as authentication operations and Firestore.
- **middleware** handles global authentication logic.
- **pages** defines the main routes and views of the application.
- **stores** handles the global state of the application.
- Configuration files (`firebase.json`, `nuxt.config.ts`, etc.) define the behavior of the project in both Nuxt and Firebase.

# Install vuefire and nuxt firebase
```
npm i firebase vuefire nuxt-vuefire
```