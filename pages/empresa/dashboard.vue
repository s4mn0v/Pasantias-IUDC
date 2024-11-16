<template>
    <div class="max-w-full grid lg:grid-cols-3">
        <!-- Columna izquierda ocupando 2/3 del ancho -->
        <div class="flex flex-col overflow-hidden lg:col-span-2 lg:border-r-2 lg:border-gray-200 lg:pr-4">
            <EmpresaReportesList />
        </div>

        <!-- Columna derecha ocupando 1/3 del ancho -->
        <div class="flex flex-col overflow-hidden">
            <EmpresaPasantes />
        </div>
    </div>
</template>