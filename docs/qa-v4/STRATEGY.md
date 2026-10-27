# Migración progresiva premium V4

Referencia aprobada: `881817b5e6a67cdda3d17807d95ff30c64a7ec22`. Rama: `codex/interiors-shadcn-migration`, creada desde esa referencia con el árbol limpio y sin rama de destino previa, local o remota.

El PR Draft de V4 se basa en `codex/home-v3-1-refinement` para mostrar únicamente la migración. V2, V3, V3.1 y main conservan sus referencias; no se fusiona ni despliega ninguna versión.

## Auditoría de fundamentos

- `app.css` mantiene el orden de capas y el prefijo `tw`. Se sigue omitiendo Preflight: introducir un reset global cambiaría la Home y las rutas heredadas.
- Los colores semánticos aprobados se extraen literalmente a `tokens.css`. Su alcance sigue siendo `.proposal-shell` y el portal de Sheet, conservando los valores de V3.1. Los nombres `--accent` y `--muted` no se trasladan a `:root`: en V2 significan otras cosas.
- Manrope, DM Sans, radios, foco y superficies se conservan. Se añaden alias de tipografía, radio de panel y espacio de sección para los interiores.
- `interiors.css` contiene clases propias; no redefine `html`, `body`, el hero ni las clases de composición de la Home. Reutiliza el contenedor y las superficies aprobados.
- `premium-routes.ts` permite activar el shell compartido por fase. Las rutas aún no migradas mantienen header, footer y componentes V2. Al terminar se unifica el shell, incluida la 404.
- La navegación premium reconoce la ruta actual y la sección de Servicios en sus páginas individuales. En Home conserva el mismo estado y markup visible.
- Los selectores antiguos de `.service-card`, formularios y metodología requieren cuidado al migrar. Se aíslan los componentes nuevos con clases propias y utilidades posteriores a la capa legacy; el CSS antiguo se conserva mientras haya consumidores.
- Los componentes shadcn existentes se reutilizan. Los únicos campos que se extenderán son los necesarios para Contacto, conservando controles nativos compatibles con validación y teclado.

## Puertas de calidad

Cada fase lleva un commit identificable y una actualización del PR Draft. Lint, TypeScript y build deben pasar antes de probar la interfaz. Los recorridos pertinentes y axe se ejecutan sobre el build de producción local, en 390×844, 768×1024 y 1440×900.

Se guarda una línea base de 16 rutas comerciales y 404. La Home se compara de forma exacta con esa referencia, tanto completa como en el primer viewport, en cada fase. Un fallo bloqueante detiene la fase siguiente hasta corregirse o documentarse como impedimento que requiera intervención.

Al cierre se ejecutan `npm ci`, lint, TypeScript, build, toda la suite E2E, axe, rendimiento local y TasteSkill. No se desactivan reglas o pruebas. La identidad aprobada prevalece cuando una preferencia estética automática entra en conflicto con el encargo; los hallazgos permanecen en el informe.

## Secuencia

1. Tokens, shell y primitivas de interiores, sin activar rutas nuevas.
2. Catálogo y nueve detalles de Servicios, con sus metadatos, slugs y cotizaciones intactos.
3. Soluciones y Portafolio, con categorías y estados editoriales honestos.
4. Nosotros y Blog, sin biografías, clientes o publicaciones ficticias.
5. Contacto y campos shadcn; misma preparación de WhatsApp, validación y alternativa de popup.
6. Shell global, 404, reproducibilidad, QA de todas las rutas, comparación de rendimiento y galería final.

El formulario no incorpora backend, almacenamiento o servicios externos. Las pruebas interceptan la entrega a WhatsApp y no envían mensajes reales. Las interfaces demostrativas se identifican como tales.
