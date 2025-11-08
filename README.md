# TinZip: Compartir Archivos de Forma Segura y Temporal

TinZip es una aplicación web para compartir archivos de forma segura. La característica principal es que los archivos se comprimen, se **cifran directamente en el navegador (client-side)** y luego se suben al servidor.

Se genera un enlace de descarga único protegido por contraseña que expira después de 72 horas. La persistencia de los metadatos se maneja a través de una base de datos **MongoDB**, priorizando la máxima privacidad y un almacenamiento de datos robusto.

## Características Principales

* **Cifrado en el Cliente (Client-Side):** Los archivos nunca salen de tu navegador sin estar cifrados con AES-GCM. El servidor solo almacena un blob cifrado.
* **Descifrado en el Cliente (Client-Side):** El proceso inverso es igual de seguro. El navegador descarga el blob cifrado y usa la contraseña para descifrarlo localmente antes de guardarlo.
* **Protección por Contraseña:** Cada subida requiere una contraseña (mín. 8 caracteres).
* **Compresión ZIP:** Múltiples archivos se agrupan y comprimen en un solo `.zip` antes de cifrarse.
* **Enlaces Temporales:** Todos los enlaces de descarga expiran automáticamente 72 horas después de su creación (lógica manejada por MongoDB).
* **Persistencia con MongoDB:** Utiliza Mongoose para definir esquemas y conectarse a una base de datos MongoDB (local o Atlas) para una persistencia escalable.
* **Tema Dinámico (Claro/Oscuro):**
    * **Modo Claro (06:00 - 18:59):** Tema blanco con acentos en verde pastel.
    * **Modo Oscuro (19:00 - 05:59):** Tema azul oscuro con un fondo de estrellas y acentos en verde oscuro.

## Cómo Funciona (Flujo de Usuario)

El proceso está diseñado para ser simple y seguro, dividido en dos flujos principales:

### 1. Para Subir Archivos (Página Principal)

1.  **Completar el Formulario:** El usuario rellena los campos:
    * `Origen`: Su email (obligatorio).
    * `Destinatarios`: Emails (separados por comas) a quienes notificar (opcional).
    * `Contraseña`: Una contraseña segura de al menos 8 caracteres (obligatoria).
    * `Título` y `Descripción`: (Opcional).
2.  **Arrastrar Archivos:** El usuario arrastra o selecciona uno o más archivos.
3.  **Comprimir y Cifrar:** Al pulsar "Comprimir y Enviar", la aplicación:
    a.  Comprime todos los archivos en un solo `.zip` usando `JSZip`.
    b.  Cifra ese `.zip` usando la `Web Crypto API` (AES-GCM) y la contraseña proporcionada.
    c.  Genera un `hash` (SHA-256) de la contraseña para la verificación (la contraseña real nunca se envía).
4.  **Subir:** El navegador sube el **archivo .zip cifrado** junto con los metadatos y el *hash* de la contraseña a la API (`POST /api/upload`).
5.  **Obtener Enlace:** El servidor guarda el archivo cifrado en la carpeta `/uploads`, añade una nueva entrada a la colección de MongoDB con los metadatos y devuelve un enlace de descarga único (ej. `/download/abc-123`).

### 2. Para Descargar Archivos (Página de Descarga)

Este flujo utiliza una máquina de estados para una experiencia de usuario clara.

1.  **Estado `idle` (Pedir Contraseña):** Al abrir el enlace, la app muestra un modal pidiendo la contraseña.
2.  **Verificación:** El usuario introduce la contraseña. Al pulsar "Verificar":
    a.  El navegador genera un *hash* (SHA-256) de la contraseña.
    b.  Llama a `GET /api/validate/[id]?hash=...`.
3.  **Validación de API:** El servidor consulta MongoDB por el `id` y comprueba el `hash`:
    * Si el hash es incorrecto, devuelve un error 401 (`invalidPass`).
    * Si el `id` no existe en la DB, devuelve un 404 (`notFound`).
    * Si el enlace expiró (lógica de Mongoose), devuelve un 410 (`expired`).
    * Si todo es correcto, devuelve un 200 con los metadatos del archivo (nombre, tamaño, etc.).
4.  **Estado `success` (Confirmar Descarga):** La app muestra un modal de éxito con los detalles del archivo (nombre, tamaño) y un botón "Descargar".
5.  **Descarga y Descifrado:** Al pulsar "Descargar":
    a.  El navegador llama a `GET /api/download/[id]?hash=...`.
    b.  La API devuelve el **blob cifrado** desde la carpeta `/uploads`.
    c.  El navegador recibe este blob, usa la contraseña original (guardada en el estado) y la `Web Crypto API` (`decryptZip`) para descifrarlo.
    d.  Se genera un nuevo `Blob` local con el `.zip` descifrado y se ofrece al usuario para su descarga.
6.  **Estado Final:** Aparece un modal de "Descarga Completa", invitando al usuario a subir sus propios archivos.

## Decisiones Técnicas y de Diseño

* **Seguridad (Client-Side Encryption):** Esta es la decisión de arquitectura más importante. El servidor actúa como un "almacén tonto" (dumb storage). Nunca tiene acceso a los archivos en claro ni a la contraseña del usuario. Esto maximiza la privacidad.
* **Persistencia (MongoDB):** Se utiliza MongoDB para almacenar los *metadatos* de los archivos. Mongoose facilita la definición de esquemas (`models/file.js`) y la validación de datos. El archivo `lib/dbConnect.ts` gestiona una conexión cacheada y eficiente a la base de datos, siguiendo las mejores prácticas de Next.js en entornos serverless.
* **Máquina de Estados (React):** La página de descarga (`app/download/[id]/page.tsx`) utiliza un `useState<PageStatus>` para gestionar el flujo (`idle`, `loading`, `success`, `invalidPass`, `expired`, `notFound`, `error`). Esto limpia la lógica de renderizado y permite manejar todos los casos de error de forma explícita.
* **Tema Dinámico (CSS Variables):** El cambio de tema (verde pastel/azul oscuro) se gestiona con un componente `ThemeManager.tsx` que añade/quita la clase `.dark` al `<html>`. La paleta de colores completa está definida con variables CSS (`--primary`, `--background`, etc.) en `app/globals.css`.
* **API (Next.js Route Handlers):** Se utiliza el App Router de Next.js. Las rutas de API son concisas y están claramente separadas por responsabilidad:
    * `api/upload/route.ts`: Maneja la subida (POST).
    * `api/validate/[id]/route.ts`: Valida y devuelve metadatos (GET).
    * `api/download/[id]/route.ts`: Valida y devuelve el blob cifrado (GET).

## Stack Tecnológico

* **Framework:** Next.js 14+ (App Router)
* **Lenguaje:** TypeScript
* **Base de Datos:** MongoDB (a través de Mongoose)
* **Estilos:** Tailwind CSS
* **Formularios:** Formik (Gestión de estado) y Yup (Validación de esquemas)
* **Peticiones API:** Axios
* **Compresión (Cliente):** `JSZip`
* **Cifrado (Cliente):** `Web Crypto API` (AES-GCM)
* **Almacenamiento de Archivos:** Sistema de archivos local (`/uploads`)
