# GoLaburo

App móvil que conecta técnicos independientes (plomeros, electricistas, cerrajeros, carpinteros, etc.) con clientes que necesitan servicios para el hogar en Cochabamba, Bolivia.

Proyecto académico — UPDS — Aplicaciones Móviles.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework móvil | React Native | **0.85.1** |
| Toolchain / SDK | Expo | **56.0.19** |
| Lenguaje | JavaScript (React) | React **19.2.3** |
| Runtime | Node.js | **22.23.2 LTS** — ver nota importante |
| Gestor de paquetes | npm | **11.19.0** — ver nota importante |
| Gestión de estado | Zustand | **5.x** |
| Backend / DB / Auth (BaaS) | Supabase (`@supabase/supabase-js`) | **2.x** — pendiente de conectar |
| Navegación | React Navigation (native-stack) | **7.x** |
| Estilos | React Native StyleSheet + theme/colors.js | nativo, sin librerías externas |
| IDE recomendado | Android Studio | **2026.1.3.7** (SDK Android + emulador) |
| Editor | VS Code | — |
| Contacto directo | WhatsApp API | enlaces `wa.me/` (sin SDK) |
| Prototipado | Figma | — |
| Control de versiones | Git + GitHub | Git **2.55.0** |

---

## ⚠️ Notas importantes antes de instalar

### Node.js — usar versión 22 LTS obligatoriamente
Expo SDK 56 **no es compatible con Node 26.x**. Usar Node 22 LTS es obligatorio.

**Linux (Arch/CachyOS):**
```bash
sudo pacman -S nodejs-lts-jod
node --version   # debe mostrar v22.x.x
```

**Windows:** descargar el instalador LTS desde `nodejs.org` (elegir "LTS", no "Current").

### npm — usar serie 11.x obligatoriamente
npm 12.x tiene un bug confirmado que rompe herramientas de Expo. Todo el equipo debe usar **npm 11.x**:

```bash
sudo npm install -g npm@11   # Linux
npm install -g npm@11        # Windows
npm --version                # debe mostrar 11.x.x
```

### NativeWind — NO está instalado intencionalmente
NativeWind (Tailwind para React Native) tiene un bug activo con el bundler de Expo SDK 56/57 que impide que la app corra. Se usa **React Native StyleSheet nativo** con colores centralizados en `theme/colors.js`. Cuando Expo resuelva el bug se puede migrar sin reescribir pantallas.

---

## Requisitos previos (instalar ANTES de clonar)

1. **Node.js 22 LTS** (ver nota arriba).
2. **npm 11.x** (ver nota arriba).
3. **Android Studio 2026.1.3.7** — para el Android SDK y el emulador.
4. **Git**.
5. **VS Code** (recomendado).
6. Archivo **`.env`** con las credenciales de Supabase (pedirlas al líder del equipo).

---

## Instalación — Linux (Arch / CachyOS / Manjaro)

```bash
# 1. Node.js 22 LTS y npm
sudo pacman -S nodejs-lts-jod npm

# 2. Bajar npm a serie 11.x si quedó en 12.x
npm --version
sudo npm install -g npm@11   # solo si muestra 12.x

# 3. Android Studio
yay -S android-studio
```

Después de instalar Android Studio, ábrelo y completa el **Setup Wizard** (instalación "Standard") para descargar el Android SDK. Luego crea un emulador: `Device Manager → Create Device` (ej. Pixel 8, imagen API 35).

Agregar `adb` al PATH de fish (si usas fish shell):
```bash
fish_add_path /home/tu-usuario/Android/Sdk/platform-tools
```

---

## Instalación — Windows

1. Descargar **Node.js LTS** desde `nodejs.org` (el `.msi` incluye npm).
2. Verificar: `node --version` (debe ser 22.x).
3. Si npm quedó en 12.x: `npm install -g npm@11`.
4. Instalar **Git for Windows**.
5. Instalar **Android Studio** y completar el Setup Wizard.
6. Crear un emulador desde Android Studio: `Device Manager → Create Device`.
7. Instalar **VS Code**.

---

## Clonar el proyecto y correrlo

```bash
git clone https://github.com/NicoBA-Dev/golaburo.git
cd golaburo
npm install
```

### Configurar variables de entorno (obligatorio)

```bash
cp .env.example .env
```

Abrir `.env` y llenar con las credenciales de Supabase (pedirlas al líder del equipo):

```
EXPO_PUBLIC_SUPABASE_URL=pegar_aqui_la_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=pegar_aqui_la_anon_key
```

### Correr la app

Con un emulador Android ya abierto desde Android Studio:

```bash
npx expo start
```

Presionar `a` para abrir en el emulador Android.

Para abrir en celular físico por USB (recomendado sobre WiFi):
1. Activar **Depuración USB** en el celular (Ajustes → Opciones de desarrollador).
2. Conectar el cable USB.
3. Correr `npx expo start` y presionar `a`.

Para abrir en celular por red (celular y PC en la misma WiFi):
```bash
npx expo start
# Escanear el QR con Expo Go (Play Store) o ingresar la URL manualmente
```

---

## Estructura del proyecto

```
golaburo/
  App.js                   # Punto de entrada — monta el NavigationContainer
  index.js                 # Registro de la app (generado por Expo, no tocar)
  app.json                 # Configuración de Expo (nombre, ícono, splash, bundle ID)
  .env                     # Credenciales de Supabase — NO se sube al repo
  .env.example             # Plantilla de variables — SÍ se sube al repo
  package.json             # Dependencias del proyecto

  theme/
    colors.js              # ★ FUENTE ÚNICA DE VERDAD de colores de la app

  screens/                 # Una pantalla completa por archivo, máx. 100 líneas
    auth/
      LoginScreen.js       # Pantalla de inicio de sesión
      RegisterScreen.js    # Pantalla de registro + selección de rubro (técnico)
    busqueda/              # Interfaz "Búsqueda de Servicios" (todos los usuarios)
      HomeScreen.js        # Grilla de categorías (RF-10)
      ListaTecnicosScreen.js
      PerfilTecnicoScreen.js
      FormularioSolicitudScreen.js
      ConfirmacionScreen.js
      CalificarScreen.js
    gestion/               # Interfaz "Gestión de Trabajos" (solo Perfil Técnico activo)
      DashboardScreen.js
      SolicitudesScreen.js
      EditarPerfilScreen.js
      HistorialScreen.js

  components/              # Piezas de UI reutilizables, máx. 100 líneas cada una
    # Ejemplos: PrimaryButton.js, TechnicianCard.js, RatingStars.js, InputField.js

  navigation/              # Configuración de rutas — qué pantalla lleva a cuál
    AppNavigator.js        # Stack navigator raíz + lógica de auth

  store/                   # Estado global con Zustand
    authStore.js           # Sesión del usuario, rol, Perfil Técnico activo/inactivo
    solicitudesStore.js    # Lista y estado de solicitudes
    perfilStore.js         # Datos del Perfil Técnico del usuario actual

  services/                # ★ ÚNICO lugar que habla con Supabase
    authService.js         # login(), registro(), logout()
    tecnicosService.js     # getTecnicosPorCategoria(), getPerfilTecnico()
    solicitudesService.js  # crearSolicitud(), cambiarEstado()
    calificacionesService.js

  hooks/                   # Lógica reutilizable sin UI
    # Ejemplos: useAuth.js, useDebounce.js

  types/                   # Forma de los datos (qué campos tiene cada entidad)
    # Ejemplos: tecnico.js, solicitud.js, calificacion.js

  config/
    supabaseConfig.js      # Lee EXPO_PUBLIC_SUPABASE_URL y ANON_KEY del .env

  assets/                  # Íconos, imágenes, splash screen
```

---

## Cómo funciona la navegación

La navegación usa **React Navigation con native-stack**. El flujo es:

```
App.js
  └── NavigationContainer
        └── AppNavigator.js
              ├── AuthStack (si no hay sesión)
              │     ├── LoginScreen
              │     └── RegisterScreen
              └── MainStack (si hay sesión)
                    ├── HomeScreen (Búsqueda de Servicios)
                    ├── ListaTecnicosScreen
                    ├── PerfilTecnicoScreen
                    ├── FormularioSolicitudScreen
                    ├── ConfirmacionScreen
                    ├── CalificarScreen
                    └── DashboardScreen (Gestión de Trabajos — solo si Perfil Técnico activo)
```

El `authStore.js` de Zustand decide qué stack se muestra según el estado de sesión.

---

## Sistema de estilos

Este proyecto usa **React Native StyleSheet nativo** con colores centralizados. No hay Tailwind ni CSS.

### Cómo usar los colores en cualquier pantalla o componente

```js
import { StyleSheet, View, Text } from "react-native";
import { colors } from "../theme/colors";

export default function MiComponente() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Hola</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
  },
  titulo: {
    color: colors.textMain,
    fontSize: 18,
    fontWeight: "bold",
  },
});
```

### Paleta de colores (`theme/colors.js`)

| Variable | Color | Para qué |
|---|---|---|
| `colors.primary` | #2F5496 (azul) | Botones principales, headers, elementos de marca |
| `colors.secondary` | #ED7D31 (naranja) | Botones secundarios, acentos |
| `colors.background` | #F7F7F7 (gris claro) | Fondo general de pantallas |
| `colors.surface` | #FFFFFF (blanco) | Cards, modales, inputs |
| `colors.textMain` | #1A1A1A (casi negro) | Texto principal |
| `colors.textMuted` | #6B6B6B (gris) | Texto secundario, subtítulos |
| `colors.border` | #E0E0E0 (gris claro) | Bordes de inputs y cards |
| `colors.success` | #2E7D32 (verde) | Estados completados, éxito |
| `colors.error` | #C62828 (rojo) | Errores, validaciones |
| `colors.warning` | #F9A825 (amarillo) | Advertencias |

**Para cambiar los colores de toda la app:** editar solo `theme/colors.js`.

---

## Regla de arquitectura clave — services/

Las pantallas en `screens/` **nunca llaman a Supabase directamente**. Siempre llaman a una función de `services/`:

```js
// ✅ CORRECTO — la pantalla llama al servicio
import { getTecnicosPorCategoria } from "../services/tecnicosService";

// En el servicio, mientras no hay backend, retorna datos mock:
export async function getTecnicosPorCategoria(categoria) {
  return [
    { id: "1", nombre: "Carlos Mamani", rubro: "Plomería", calificacion: 4.5 },
    { id: "2", nombre: "Luis Quispe", rubro: "Plomería", calificacion: 4.8 },
  ];
  // Cuando Supabase esté conectado, se reemplaza esto por la llamada real.
}

// ❌ INCORRECTO — nunca importar Supabase directamente en una pantalla
import { supabase } from "../config/supabaseConfig";
```

---

## Reglas del equipo (obligatorias)

- **Máximo 100 líneas por archivo.** Si un componente crece más, dividirlo en subcomponentes en `components/`.
- **Un archivo = un componente o una responsabilidad.** Nada de varios componentes en un mismo archivo.
- **PascalCase para componentes y pantallas:** `TechnicianCard.js`, `LoginScreen.js`.
- **camelCase para el resto:** `authStore.js`, `tecnicosService.js`, `useAuth.js`.
- **Nombres descriptivos e intuitivos:** nada de `Screen1.js`, `helper2.js`, `nuevo.js`, `temp.js`.
- **Props claras:** cada componente recibe sus datos por props. Nunca asume datos globales salvo los del `store/`.
- **Rama principal:** `main`. Trabajar en ramas por feature: `feature/nombre-corto`.
- **Antes de hacer push:** correr la app y confirmar que no hay errores en consola.
- **No subir `.env`** — contiene credenciales reales. Está en `.gitignore`.
- **No subir `node_modules/`** — ya excluida por `.gitignore`.
- **No hardcodear colores:** siempre usar `colors.X` de `theme/colors.js`.

---

## Comandos de verificación rápida

```bash
node --version         # v22.x.x
npm --version          # 11.x.x
npx expo --version     # 56.x.x
git --version          # 2.x.x
npx expo-doctor        # todos los checks en verde
```

---

## Problemas comunes

| Problema | Causa | Solución |
|---|---|---|
| `Could not parse JSON from npm pack` | npm 12.x tiene bug con create-expo-app | `sudo npm install -g npm@11` |
| `Cannot read properties of undefined (reading 'transformFile')` | Bug de Expo SDK 57 con Metro | Este proyecto usa SDK 56 para evitarlo |
| `npm install -g` falla con `EACCES` en Linux | Node instalado por pacman pertenece a root | Anteponer `sudo` al comando |
| "Something went wrong" en Expo Go por WiFi | PC por cable y celular por WiFi en subredes distintas | Conectar celular por USB con Depuración USB activada |
| `adb: Unknown command` en fish shell | adb no está en el PATH de fish | `fish_add_path /home/tu-usuario/Android/Sdk/platform-tools` |
| `adb: device offline` | Emulador a medio abrir | Reiniciar el emulador desde Android Studio |
| App no conecta a Supabase | Falta `.env` o credenciales incorrectas | `cp .env.example .env` y llenar los valores |
| Colores inconsistentes entre pantallas | Colores hardcodeados en el componente | Siempre usar `colors.X` de `theme/colors.js` |
| Node 26.x instalado | Incompatible con Expo SDK 56 | `sudo pacman -S nodejs-lts-jod` en Arch |