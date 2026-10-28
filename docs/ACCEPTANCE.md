# Matriz de aceptación comercial

Todas las decisiones están **PENDIENTES**. El propietario debe registrar una decisión, responsable y fecha; no se han inventado datos ni modificado los textos comerciales.

| Decisión | Dato o confirmación necesaria | Estado |
| --- | --- | --- |
| Dominio definitivo | Dominio HTTPS autorizado y valor de `NEXT_PUBLIC_SITE_URL`; validar canonical, robots y sitemap después de configurarlo. | PENDIENTE |
| Responsable | Nombre o razón social verificable y datos de contacto del responsable del sitio. | PENDIENTE |
| Avisos legales y privacidad | Texto revisado, canal de contacto y tratamiento de datos y WhatsApp, con asesoría competente. | PENDIENTE |
| WhatsApp | Confirmar titularidad y disponibilidad comercial del número mostrado `+593 98 444 7960`. | PENDIENTE |
| Presupuesto | Rangos corregidos: menos de USD 500; desde USD 500 hasta menos de USD 1.500; desde USD 1.500 hasta menos de USD 5.000; USD 5.000 o más. Aceptación comercial final pendiente. | PENDIENTE |
| Proyectos y materiales | ORVENTI y LlevaKí se presentan como referencias con datos de demostración; verificar permisos y materiales para futuros casos de clientes. | PENDIENTE |
| Textos comerciales | Confirmar servicios, entregables, las seis industrias, alcances y mensajes de contacto. | PENDIENTE |

La aceptación requiere revisar Servicios y sus nueve detalles, Soluciones y sus seis industrias, Portafolio y Contacto. Probar WhatsApp con datos ficticios y no pulsar Enviar. La aprobación de producción corresponde al propietario.

El formulario prepara un enlace a WhatsApp; el usuario debe revisar y enviar el mensaje manualmente. El sitio no confirma su recepción. El Blog permanece visible y en preparación; su visibilidad requiere decisión del propietario.

La medición de clics con eventos personalizados de Vercel Analytics podría evaluarse en una fase posterior, sin datos personales: una interacción indicaría intención, no recepción ni venta. No se ha añadido seguimiento.

## Comprobaciones locales V7

`npm ci`, lint, typecheck y build: PASS. Playwright en Chromium a 375, 390, 768 y 1440 px: 130 PASS, 2 SKIP existentes, 0 FAIL; incluye axe y flujos simulados de WhatsApp. La entrega real en WhatsApp, dispositivos físicos y la aceptación comercial permanecen pendientes. Las capturas comparativas locales de Home y Servicios coincidieron píxel a píxel en esas cuatro resoluciones. CI y Preview se verifican por separado.
