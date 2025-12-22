# PROYECTO COMPRITAS MX: Plan de Mejoras Profesional (Checklist)

Este documento detalla el plan de acción para elevar el nivel de calidad visual y funcional de la aplicación "Compritas MX".

## 1. Diseño Visual y Tema (Look & Feel)
Objetivo: Lograr una apariencia "Profesional, Seria y Moderna" (Corporate/SaaS Clean).

- [ ] **Unificación de Colores**:
    - Eliminar la inconsistencia entre el "Verde Sage" y el "Azul Corporativo" en `index.css`.
    - Establecer una paleta definitiva:
        - **Primario**: Azul Profundo (`#3b82f6` / `#1e40af`) o Slate (`#475569`).
        - **Fondo**: Blanco limpio (`#ffffff`) y Gris muy suave (`#f8fafc`) para superficies.
        - **Acentos**: Usar colores semánticos claros (Verde para éxito, Rojo suave para borrar).
- [ ] **Tipografía Premium**:
    - Asegurar la carga correcta de la fuente `Inter`.
    - Ajustar `line-height` y `letter-spacing` para mejorar la legibilidad en listas densas.
- [ ] **Suavizado de UI (Glassmorphism sutil)**:
    - Aplicar desenfoques (`backdrop-filter: blur()`) en el Header y Sidebar para un toque moderno.
    - Refinar las sombras (`box-shadow`) para que sean más difusas y menos duras.

## 2. Animaciones Profesionales (Framer Motion)
Objetivo: Mejorar la experiencia de usuario (UX) mediante movimiento con propósito.

- [ ] **Transiciones de Página y Rutas**:
    - Implementar `<AnimatePresence>` en `App.jsx` para que al cambiar de lista o ruta, el contenido se desvanezca suavemente (Fade In/Out).
- [ ] **Animaciones de Listas (Staggering)**:
    - Animar la aparición de los productos en la lista de compras uno por uno (efecto cascada) al cargar.
    - Animar suavemente el reordenamiento y la eliminación de items (Layout Animations).
- [ ] **Sidebar Móvil**:
    - Reemplazar la lógica CSS actual por un `motion.div` que se deslice suavemente (`x: 0` a `x: -100%`) con un overlay que haga `fadeIn`.
- [ ] **Micro-interacciones**:
    - Feedback táctil en botones: Pequeña escala al presionar (`scale: 0.98`).
    - Checkbox animado: Animación satisfactoria al marcar un producto como "Comprado" (ej. línea tachada animada o checkmark).

## 3. Experiencia de Usuario (UX) Mejorada
- [ ] **Feedback de Carga (Loading)**:
    - Reemplazar el texto simple "Cargando..." por un **Skeleton Loader** que imite la estructura de la tabla/lista.
- [ ] **Mejora de Notificaciones (Toasts)**:
    - Rediseñar los Toasts de `react-hot-toast` para que coincidan perfectamente con el nuevo tema (bordes redondeados, iconos custom).
- [ ] **Empty States (Estados Vacíos)**:
    - Diseño atractivo cuando no hay listas o productos (Icono gris grande + Texto de ayuda + Botón de acción claro).

## 4. Calidad de Código
- [ ] **Refactorización de CSS**:
    - Limpieza de `index.css`: Eliminar duplicados y organizar las variables CSS por funcionalidad.
- [ ] **Componentes**:
    - Extraer botones y inputs a componentes reutilizables (si no lo están ya completamente) para asegurar consistencia en toda la app.

---

**¿Por dónde empezamos?**
Recomiendo comenzar por el **Punto 1 (Colores y Tema)** para establecer la base visual, y luego proceder inmediatamente al **Punto 2 (Animaciones)** para darle vida.
