# Seguridad, SEO y privacidad — V4.1

## Verificado

- `npm audit` del lockfile: 519 paquetes y **0 vulnerabilidades** informadas en info, low, moderate, high o critical.
- Escaneo estático de 161 archivos rastreados: ningún patrón de clave privada ni token conocido (AWS, GitHub, Stripe u OpenAI). El único archivo de entorno rastreado es `.env.example`.
- El código de cliente no usa `localStorage`, `sessionStorage`, IndexedDB, `fetch`, XHR ni beacon para enviar o retener solicitudes.
- Los enlaces externos revisados se limitan a WhatsApp. Los que abren una pestaña nueva usan `rel="noopener noreferrer"` y `target="_blank"`.
- El formulario prepara la URL de WhatsApp con los datos introducidos; no abre ni envía automáticamente un mensaje. La persona revisa el texto y confirma el envío en WhatsApp.
- Corregido el envío nativo GET sin JavaScript, que podía exponer nombre, correo, servicio y descripción en la URL. Antes de hidratar, el formulario queda deshabilitado; el aviso sin JavaScript ofrece un enlace general sin esos datos.
- Canonical, descripción, idioma y viewport comprobados por ruta; robots y sitemap responden correctamente; la ruta inexistente devuelve 404 y noindex.

## Pendiente para aceptación comercial / legal

La página explica que la solicitud se prepara localmente y que al continuar los datos del mensaje se comparten con WhatsApp, donde se revisan y envían. Todavía no constan datos legales verificados del responsable, canal de privacidad/derechos, finalidades y bases aplicables, plazo de conservación, tratamiento del proveedor ni avisos legales del negocio. No se inventaron esos datos.

Antes de producción, el propietario y asesoría competente deben definir el aviso y el tratamiento aplicable a nombre, correo y descripción del proyecto, incluso si el sitio no conserva una copia en su servidor. Como referencia contextual, la [opinión técnica de la SPDP de Ecuador](https://www.spdp.gob.ec/docs/consultas-absueltas/2026-2/oficio-n-spdp-ird-2026-0028-o/) analiza los elementos de información del artículo 12 cuando corresponden; no sustituye una revisión jurídica del flujo de Nexo.

`NEXT_PUBLIC_SITE_URL` y el dominio canónico de producción deben ser confirmados por el propietario. Los fallbacks locales/host de preview no sirven como sustituto de esa configuración.

No se añadieron servicios externos, almacenamiento ni proveedores.
