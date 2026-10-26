# Nexo Digital Studio

Sitio corporativo multipágina de Nexo Digital Studio, preparado para Vercel.

## Stack

Next.js 16 (App Router), React 19, TypeScript, CSS responsive y Lucide React.

## Desarrollo

Requisitos: Node.js 20.9 o posterior.

1. Instalar dependencias con npm install.
2. Iniciar el servidor con npm run dev.
3. Abrir http://localhost:3000.
4. Comprobar tipos con npm run typecheck.
5. Compilar con npm run build.

## Vercel

Importar Derzam/NEXO-DIGITAL, seleccionar Next.js y conectar la raíz del repositorio. Configurar NEXT_PUBLIC_SITE_URL con el dominio real cuando esté disponible, sin barra final. Las ramas de desarrollo deben usar Preview y main queda reservada para producción después de las pruebas.

## Estado de implementación

- Inicio, catálogo de nueve servicios con rutas individuales, soluciones por industria, portafolio, acerca de, blog y contacto.
- Menú móvil, SEO básico, sitemap y robots.
- El formulario prepara un mensaje para enviar desde WhatsApp; no envía automáticamente ni almacena los datos.
- Portafolio y blog no contienen proyectos o publicaciones inventadas.

## Pendientes antes de publicar

Integrar el logotipo original, revisar textos comerciales, ejecutar instalación/build/typecheck, verificar recorridos responsive (incluyendo 390 px), formularios y links; habilitar pruebas E2E, comprobar accesibilidad y aprobar cualquier política legal necesaria. No fusionar sin QA.
