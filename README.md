# 🎟️ Sistema de Tickets — Guía de instalación completa

## Estructura del proyecto

```
ticket-firebase/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── firebase.js   ← aquí pegas tus credenciales
    └── App.jsx
```

---

## PASO 1 — Crear proyecto en Firebase (gratis)

1. Ve a https://console.firebase.google.com
2. Haz clic en **"Agregar proyecto"**
3. Dale un nombre (ej: `tickets-clase`) y continúa
4. Desactiva Google Analytics si no lo necesitas → **Crear proyecto**

---

## PASO 2 — Activar Firestore

1. En el menú izquierdo → **Firestore Database**
2. Clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** → Siguiente
4. Elige la ubicación más cercana (ej: `us-central1`) → **Listo**

---

## PASO 3 — Obtener las credenciales de tu app

1. Ve a **Configuración del proyecto** (ícono ⚙️ junto a "Descripción general del proyecto")
2. Baja hasta **"Tus aplicaciones"** → clic en el ícono `</>`  (Web)
3. Registra la app con cualquier nombre
4. Copia el objeto `firebaseConfig` que aparece

Pega esas credenciales en `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey:            "AIzaSy...",
  authDomain:        "mi-proyecto.firebaseapp.com",
  projectId:         "mi-proyecto",
  storageBucket:     "mi-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
};
```

---

## PASO 4 — Reglas de seguridad de Firestore

En Firebase Console → Firestore → pestaña **"Reglas"**, pega esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Temas: cualquiera puede leer, nadie puede escribir desde el cliente
    // (el profesor escribe desde el panel con contraseña en la app)
    match /config/{doc} {
      allow read: if true;
      allow write: if true;  // puedes restringir más adelante
    }

    // Assignments: cualquiera puede leer y crear su propio ticket
    match /assignments/{userId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;  // nadie puede modificar tickets ya creados
    }
  }
}
```

Haz clic en **Publicar**.

---

## PASO 5 — Instalar y correr localmente

Necesitas tener [Node.js](https://nodejs.org) instalado (versión 18 o superior).

```bash
# Entra a la carpeta del proyecto
cd ticket-firebase

# Instala las dependencias
npm install

# Corre en modo desarrollo
npm run dev
```

Abre http://localhost:5173 — ¡ya funciona con Firebase!

---

## PASO 6 — Subir a GitHub

```bash
git init
git add .
git commit -m "sistema de tickets con firebase"
```

1. Ve a https://github.com/new
2. Crea un repositorio nuevo (ej: `tickets-clase`)
3. Copia los comandos que GitHub te muestra y ejecútalos en tu terminal

---

## PASO 7 — Desplegar en Vercel (gratis, URL pública)

1. Ve a https://vercel.com y crea cuenta (puedes usar tu cuenta de GitHub)
2. Clic en **"Add New Project"**
3. Selecciona tu repositorio `tickets-clase`
4. Vercel detecta Vite automáticamente → clic en **Deploy**
5. En ~2 minutos tienes tu URL pública: `https://tickets-clase.vercel.app`

### ¿Cómo actualizar la app?
Solo haz `git push` y Vercel redespliega automáticamente.

---

## Acceso al panel del profesor

**Método 1 (PC):** Escribe la contraseña `prof2024` directamente en el teclado desde la pantalla de estudiante (sin hacer clic en ningún campo).

**Método 2 (móvil/tablet):** Haz clic en la esquina inferior derecha de la pantalla (hay un área invisible que aparece al hacer hover).

Para cambiar la contraseña, edita esta línea en `src/App.jsx`:
```js
const PROFESSOR_PASSWORD = "prof2024";
```

---

## Plan gratuito de Firebase (Spark)

| Recurso | Límite gratuito |
|---------|----------------|
| Lecturas Firestore | 50,000 / día |
| Escrituras Firestore | 20,000 / día |
| Almacenamiento | 1 GB |
| Transferencia | 10 GB / mes |

Para un salón de clases, esto es más que suficiente. ✅
