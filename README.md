# 🛒 Compritas MX

**Dashboard Web de Gestión de Compras** - Aplicación React para gestionar listas de compras con interfaz moderna y profesional.

![Compritas MX](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-11.1-FFCA28?logo=firebase)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

## 📋 Descripción

**Compritas MX** es una aplicación web de escritorio (Desktop View) diseñada para gestionar múltiples listas de compras de forma eficiente y elegante. Desarrollada con React y siguiendo las mejores prácticas de diseño moderno.

## ✨ Características Principales

### 🎯 Funcionalidades Core
- ✅ **Múltiples Listas**: Crea y gestiona varias listas de compras simultáneamente
- ✅ **CRUD Completo**: Agregar, editar, marcar y eliminar productos
- ✅ **Cálculos en Tiempo Real**: Totales y subtotales que se actualizan instantáneamente
- 🔥 **Sincronización Cloud**: Datos guardados en Firebase Firestore con sync en tiempo real
- 🌐 **Actualización Automática**: Los cambios se reflejan instantáneamente entre pestañas/dispositivos
- ✅ **Interfaz Intuitiva**: Diseño de dos columnas para máxima productividad

### 🎨 Diseño y UX
- 🎨 **Sistema de Diseño Premium**: Paleta de colores moderna con gradientes vibrantes
- 🌊 **Glassmorphism Effects**: Efectos de cristal esmerilado en el header
- ✨ **Micro-animaciones**: Transiciones suaves y hover effects
- 📊 **Indicadores Visuales**: Barras de progreso y badges informativos
- 🎭 **Tipografía Moderna**: Fuente Inter de Google Fonts

### 📐 Layout - Dos Columnas (Split View)

#### 📁 Sidebar Izquierdo (25%)
- Lista de todas las listas de compras
- Botón para crear nueva lista
- Información de cada lista:
  - Nombre
  - Fecha de creación
  - Cantidad de items
  - Total de la lista
  - Barra de progreso
- Formulario inline para crear listas rápidamente
- Estado activo visual de la lista seleccionada

#### 📊 Panel Principal (75%)
- **Header de la lista**: Nombre, estadísticas y badges
- **Formulario siempre visible**: Para agregar productos rápidamente
  - Nombre (requerido)
  - Precio
  - Enlace (opcional)
  - Nota (opcional)
- **Tabla de productos** con columnas:
  - ☑️ Estado (Checkbox)
  - 📦 Nombre
  - 🔗 Enlace
  - 📝 Nota
  - 💰 Precio
  - 🗑️ Acciones (Eliminar)
- **Sección de totales**:
  - Subtotal de productos marcados
  - Gran Total de todos los productos

## 🚀 Tecnologías Utilizadas

- **React 18.3**: Framework de UI
- **Vite 7.2**: Build tool y dev server
- **Firebase 11.1**: Backend y base de datos
  - **Firestore**: Base de datos NoSQL en tiempo real
  - **Analytics**: Métricas de uso
- **CSS3**: Diseño custom sin frameworks
- **Custom Hooks**: `useShoppingLists` para gestión de estado con Firestore

## 📦 Instalación

```bash
# Navegar al directorio del proyecto
cd compritas-mx

# Instalar dependencias
npm install

# Configurar Firebase (IMPORTANTE)
# Lee FIRESTORE_RULES.md para configurar las reglas de seguridad

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173/
```

### ⚠️ Configuración de Firebase (Requerido)

Antes de usar la aplicación, **DEBES** configurar las reglas de seguridad de Firestore:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto **compritas-mx**
3. Ve a **Firestore Database** → **Reglas**
4. Lee el archivo `FIRESTORE_RULES.md` para instrucciones detalladas
5. Para desarrollo rápido, usa las reglas de acceso público (ver archivo)

> 📖 **Guía completa**: Consulta `FIRESTORE_RULES.md` para más detalles

## 🏗️ Estructura del Proyecto

```
compritas-mx/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Componente del sidebar
│   │   ├── Sidebar.css          # Estilos del sidebar
│   │   ├── MainPanel.jsx        # Panel principal
│   │   └── MainPanel.css        # Estilos del panel principal
│   ├── firebase/
│   │   ├── config.js            # Configuración de Firebase
│   │   └── useShoppingLists.js  # Hook personalizado para Firestore
│   ├── App.jsx                  # Componente principal
│   ├── App.css                  # Estilos del App
│   ├── index.css                # Sistema de diseño global
│   └── main.jsx                 # Punto de entrada
├── public/                      # Archivos estáticos
├── FIRESTORE_RULES.md          # Guía de configuración de Firebase
├── README.md                    # Este archivo
├── package.json                 # Dependencias
└── vite.config.js              # Configuración de Vite
```

## 💡 Uso

### Crear una Nueva Lista
1. Haz clic en el botón **"Nueva Lista"** en el sidebar
2. Ingresa el nombre de la lista
3. Presiona **"Crear"**

### Agregar Productos
1. Selecciona una lista del sidebar
2. Llena el formulario de agregar producto
3. Haz clic en **"Agregar a la Lista"**

### Marcar Productos
- Haz clic en el checkbox de cualquier producto para marcarlo como completado
- Los productos marcados se resaltan con fondo verde claro
- El subtotal se actualiza automáticamente

### Eliminar Productos
- Haz clic en el icono de basura 🗑️ en la columna de Acciones
- Confirma la eliminación
- El total se actualiza en tiempo real

### Eliminar Listas
- Haz clic en el icono de basura en la tarjeta de la lista
- Confirma la eliminación

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores Primarios */
--primary-500: #0ea5e9;  /* Sky Blue */
--primary-600: #0284c7;  /* Dark Sky */

/* Colores Semánticos */
--success: #10b981;      /* Green */
--danger: #ef4444;       /* Red */
--warning: #f59e0b;      /* Amber */

/* Neutrales */
--neutral-50: #fafafa;   /* Light Gray */
--neutral-900: #171717;  /* Dark Gray */
```

### Tipografía

- **Fuente Principal**: Inter (Google Fonts)
- **Tamaños**: Sistema de escala tipográfica de 12px a 30px
- **Pesos**: 300, 400, 500, 600, 700, 800

### Espaciado

Escala de espaciado consistente:
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

## 📊 Gestión de Estado

La aplicación utiliza React Hooks para la gestión de estado:
- `useState` para el estado local de la lista seleccionada
- `useEffect` para efectos secundarios
- **Custom Hook `useShoppingLists`**: Encapsula toda la lógica de Firestore
- Props drilling para comunicación entre componentes

### Persistencia con Firebase Firestore

Todos los datos se guardan automáticamente en **Firebase Firestore**:

- **Colección**: `shoppingLists`
- **Sincronización en Tiempo Real**: Usa `onSnapshot` para escuchar cambios
- **Estructura de Documentos**:
  ```javascript
  {
    id: "doc_id",           // ID generado por Firestore
    name: "Mi Lista",       // Nombre de la lista
    createdAt: Timestamp,   // Timestamp de Firebase
    items: [                // Array de productos
      {
        id: 1234567890,     // Timestamp numérico
        name: "Producto",
        price: 100,
        link: "url",
        note: "nota",
        checked: false
      }
    ]
  }
  ```

### Hook Personalizado: `useShoppingLists`

El hook proporciona:
- `shoppingLists`: Array de listas en tiempo real
- `loading`: Estado de carga inicial
- `error`: Estado de error
- `createList()`: Crear nueva lista
- `deleteList()`: Eliminar lista
- `addItemToList()`: Agregar producto
- `updateItemInList()`: Actualizar producto
- `deleteItemFromList()`: Eliminar producto

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Crear build de producción
npm run preview      # Previsualizar build de producción

# Linting
npm run lint         # Verificar código con ESLint
```

## 🎯 Características de Diseño

### Desktop-First
- **No incluye diseño responsivo**: Optimizado para monitores de escritorio
- **Layout fijo**: Sidebar 25% | Panel Principal 75%
- **Sin media queries**: Experiencia optimizada para escritorio

### Interactividad
- ✨ Hover effects en todas las tarjetas y botones
- 🔄 Transiciones suaves (150ms - 350ms)
- 📍 Estados activos claramente identificados
- 🎭 Animaciones de entrada (fade-in, slide-in)

### Accesibilidad
- 🏷️ Labels descriptivos en todos los inputs
- 🎯 Títulos semánticos (title attributes)
- ⌨️ Formularios enviables con Enter
- 🎨 Alto contraste para legibilidad

## 📈 Actualizaciones en Tiempo Real con Firebase

Gracias a Firebase Firestore, todas las operaciones se sincronizan automáticamente:

### Sincronización Multi-Pestaña/Dispositivo
- 🔄 **Tiempo Real**: Los cambios se reflejan en TODAS las pestañas abiertas
- 🌐 **Multi-Dispositivo**: Edita en un dispositivo, ve los cambios en otro al instante
- ⚡ **Instantáneo**: Sin recargas, sin delays

### Operaciones Sincronizadas
- ➕ Agregar productos → Visible en todas las pestañas
- ☑️ Marcar/desmarcar items → Actualiza en tiempo real
- 🗑️ Eliminar productos o listas → Desaparece instantáneamente
- 💰 Cálculo de totales → Se recalcula automáticamente
- 📊 Estadísticas del header → Siempre actualizadas

### Ventajas vs localStorage

| Característica | localStorage | Firebase Firestore |
|----------------|--------------|--------------------|
| Sincronización | ❌ Solo local | ✅ Tiempo real |
| Multi-dispositivo | ❌ No | ✅ Sí |
| Backup automático | ❌ No | ✅ Sí |
| Límite de datos | ~5-10MB | ✅ 1GB gratis |
| Acceso desde móvil | ❌ Solo mismo dispositivo | ✅ Cualquier dispositivo |

## 🐛 Solución de Problemas

### La aplicación no carga
```bash
# Limpiar caché de node_modules
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### La aplicación muestra "Cargando listas..." indefinidamente

**Causa**: Las reglas de seguridad de Firestore están bloqueando el acceso.

**Solución**:
1. Lee el archivo `FIRESTORE_RULES.md`
2. Ve a [Firebase Console](https://console.firebase.google.com/)
3. Actualiza las reglas de Firestore según las instrucciones
4. Recarga la aplicación

### Error: "Missing or insufficient permissions"

- Las reglas de Firestore están bloqueando el acceso
- Sigue las instrucciones en `FIRESTORE_RULES.md`
- Para desarrollo, usa las reglas de acceso público (Opción 1 o 2)

### Los datos no se sincronizan entre pestañas

- Verifica que estés usando la misma configuración de Firebase
- Revisa la consola del navegador para errores de conexión
- Asegúrate de que las reglas de Firestore permitan lectura

## 🚀 Próximas Mejoras (Roadmap)

### Funcionalidades
- [ ] 🔐 **Firebase Authentication**: Login con Google/Email
- [ ] 👥 **Listas Compartidas**: Compartir listas con otros usuarios
- [ ] 🔍 Búsqueda y filtrado de productos
- [ ] 📊 Ordenamiento de productos (por nombre, precio)
- [ ] 📄 Exportar listas a PDF o CSV
- [ ] 🔗 Compartir listas por URL pública
- [ ] 🎨 Temas (modo oscuro)
- [ ] 🏷️ Categorías de productos
- [ ] 📜 Historial de compras
- [ ] 📱 Versión móvil responsive
- [ ] 🔔 Notificaciones push
- [ ] 📸 Adjuntar imágenes a productos

## 👨‍💻 Desarrollo

### Requisitos Previos
- Node.js 18+
- npm 9+

### Contribuir
Este proyecto fue desarrollado como una aplicación de demostración. Para mejoras o sugerencias, considera:
1. Hacer fork del repositorio
2. Crear una rama para tu feature
3. Commit de tus cambios
4. Push a la rama
5. Crear un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- **React Team**: Por el framework increíble
- **Vite Team**: Por la herramienta de build súper rápida
- **Firebase Team**: Por la plataforma de backend completa
- **Google Fonts**: Por la tipografía Inter
- **Heroicons**: Inspiración para los iconos SVG

---

**Desarrollado con ❤️ para gestionar tus compras de forma eficiente**

🛒 **¡Felices Compras con Compritas MX!** 🇲🇽
