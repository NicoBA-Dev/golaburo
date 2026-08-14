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
| Backend / DB / Auth (BaaS) | Supabase (`@supabase/supabase-js`) | **2.x** |
| Estilos | React Native StyleSheet + theme/colors.js | nativo (sin librerías externas) |
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
npm 12.x tiene un bug que rompe `create-expo-app`. Todo el equipo debe usar **npm 11.x**:

```bash
sudo npm install -g npm@11   # Linux
npm install -g npm@11        # Windows
npm --version                # debe mostrar 11.x.x
```

### NativeWind — NO está instalado intencionalmente
NativeWind (Tailwind para React Native) tiene un bug activo con el bundler de Expo SDK 56/57. Se decidió usar **React Native StyleSheet nativo** con colores centralizados en `theme/colors.js`. Cuando Expo resuelva el bug se puede migrar a NativeWind sin reescribir pantallas.

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

Presionar `a` para abrir en el emulador. También se puede escanear el QR con **Expo Go** (Play Store) en un celular físico en la misma red WiFi. Si el celular está en otra red:

```bash
sudo npm install -g @expo/ngrok   # Linux (solo la primera vez)
npm install -g @expo/ngrok        # Windows (solo la primera vez)
npx expo start --tunnel
```

---

## Estructura del proyecto

```
golaburo/
  App.js              # Punto de entrada — importa la navegación principal
  index.js            # Registro de la app (generado por Expo, no tocar)
  app.json            # Configuración de Expo (nombre, ícono, splash, bundle ID)
  .env                # Credenciales de Supabase — NO se sube al repo
  .env.example        # Plantilla de variables de entorno — SÍ se sube al repo
  package.json        # Dependencias del proyecto

  theme/
    colors.js         # ★ FUENTE ÚNICA DE VERDAD de colores

  screens/            # Una pantalla completa por archivo
    auth/
      LoginScreen.js
      RegisterScreen.js
    busqueda/
      HomeScreen.js
      ListaTecnicosScreen.js
      PerfilTecnicoScreen.js
      FormularioSolicitudScreen.js
      ConfirmacionScreen.js
      CalificarScreen.js
    gestion/
      DashboardScreen.js
      SolicitudesScreen.js
      EditarPerfilScreen.js
      HistorialScreen.js

  components/         # Piezas de UI reutilizables (botones, cards, inputs)

  navigation/         # Configuración de rutas
    AppNavigator.js

  store/              # Estado global con Zustand
    authStore.js
    perfilStore.js
    solicitudesStore.js

  services/           # ★ ÚNICO lugar que habla con Supabase
    authService.js
    tecnicosService.js
    solicitudesService.js
    calificacionesService.js

  hooks/              # Lógica reutilizable sin UI (useAuth, useDebounce, etc.)

  types/              # Forma de los datos (Técnico, Solicitud, Calificación, etc.)

  config/
    supabaseConfig.js # Lee las credenciales del .env — SÍ se sube al repo

  assets/             # Íconos, imágenes, splash screen
```

---

## Sistema de estilos

Este proyecto usa **React Native StyleSheet nativo** con colores centralizados. No hay Tailwind ni CSS.

### Cómo usar los colores

```js
import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const styles = StyleSheet.create({
  contenedor: { backgroundColor: colors.background },
  boton: { backgroundColor: colors.primary, borderRadius: 8, padding: 12 },
  texto: { color: colors.textMain, fontSize: 16 },
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

Para cambiar los colores de toda la app: editar solo `theme/colors.js`.

---

## Regla de arquitectura clave

Las pantallas en `screens/` **nunca llaman a Supabase directamente**. Siempre llaman a una función de `services/`:

```js
// ✅ CORRECTO
import { getTecnicosPorCategoria } from "../services/tecnicosService";

// ❌ INCORRECTO — nunca importar Supabase directamente en una pantalla
import { createClient } from "@supabase/supabase-js";
```

Esto permite desarrollar pantallas con datos de prueba (mock) sin backend listo. Cuando el backend esté listo, solo se cambia el contenido de la función en `services/` — ninguna pantalla necesita tocarse.

---

## Reglas del equipo (obligatorias)

- **Máximo 100 líneas por archivo.** Si un componente crece más, dividirlo en subcomponentes en `components/`.
- **Un archivo = un componente o una responsabilidad.** Nada de varios componentes en un mismo archivo.
- **PascalCase para componentes y pantallas:** `TechnicianCard.js`, `LoginScreen.js`.
- **camelCase para el resto:** `authStore.js`, `tecnicosService.js`, `useAuth.js`.
- **Nombres descriptivos:** nada de `Screen1.js`, `helper2.js`, `nuevo.js`, `temp.js`.
- **Props claras:** cada componente recibe sus datos por props. Nunca asume datos globales salvo los del `store/`.
- **Rama principal:** `main`. Trabajar en ramas por feature: `feature/nombre-corto`.
- **Antes de hacer push:** correr la app y verificar que no hay errores en consola.
- **No subir `.env`** — contiene credenciales reales.
- **No subir `node_modules/`** — ya excluida por `.gitignore`.

---

## Comandos de verificación rápida

```bash
node --version       # v22.x.x
npm --version        # 11.x.x
npx expo --version   # 56.x.x
git --version        # 2.x.x
npx expo-doctor      # todos los checks en verde
```

---

## Problemas comunes

| Problema | Causa | Solución |
|---|---|---|
| `Could not parse JSON from npm pack` | npm 12.x tiene bug con create-expo-app | `sudo npm install -g npm@11` |
| `Cannot read properties of undefined (reading 'transformFile')` | Bug de Expo SDK 57 con Metro | Este proyecto usa SDK 56 para evitarlo |
| `npm install -g` falla con `EACCES` en Linux | Node instalado por pacman pertenece a root | Anteponer `sudo` al comando |
| "Something went wrong" en Expo Go | Celular y PC en redes distintas | `npx expo start --tunnel` |
| `adb: device offline` | Emulador a medio abrir | Reiniciar el emulador desde Android Studio |
| App no conecta a Supabase | Falta `.env` o credenciales incorrectas | Copiar `.env.example` como `.env` y llenar valores |
| Colores inconsistentes entre pantallas | Colores hardcodeados en el componente | Siempre usar `colors.X` de `theme/colors.js` |
| Node 26.x instalado | Incompatible con Expo SDK 56 | `sudo pacman -S nodejs-lts-jod` en Arch |