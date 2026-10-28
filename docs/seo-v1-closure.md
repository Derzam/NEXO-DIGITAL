# Cierre SEO V1

Base verificada: main `047fd9ff56612fa0cd0323f97ad4d83729112da0` y PR #7 `b6a49df7e17c8f81051777b28d8b0cf20d89045a` antes de esta modificación.

- Production: Blog y Portafolio `noindex, follow`; las otras 14 rutas `index, follow`. Sitemap: 14 URLs; las páginas excluidas siguen navegables.
- Preview: `noindex, nofollow` en las 16 rutas, incluidas las dos páginas pendientes. Build simulado: 16/16 canonical, Open Graph y Twitter usan el dominio de producción; detalles en `seo-closure-preview-local.json`.
- Dominio verificado en Vercel: `https://nexo-digital-mu.vercel.app`. La variable `NEXT_PUBLIC_SITE_URL` está configurada para Production y coincide con ese dominio. No hay una variable de proyecto con ese nombre para Preview. En el preview del SHA base, el canonical observado fue el dominio de producción, lo que es consistente con la disponibilidad del fallback de Vercel; la exposición efectiva de variables de sistema no se verificó directamente.
- Google Rich Results Test, modo código: se pegó el JSON-LD de Organization y BreadcrumbList obtenido del servicio Landing pages en el preview del SHA base. Google informó [un BreadcrumbList válido](https://search.google.com/test/rich-results/result?id=hwXY5Sa12rXR_b9NwiBjbg). Una [prueba independiente de Organization](https://search.google.com/test/rich-results/result?id=s_SmAsXY83PQj-Yk1FIWBw) indicó que no detectó ningún resultado enriquecido; no confirma validez ni invalidez de Organization. Los resultados de código no comprueban acceso de Google al preview protegido ni garantizan resultados enriquecidos.
- La herramienta conectada de Vercel devolvió 403 al intentar leer el preview protegido; la sesión autenticada del propietario en Chrome sí permitió inspeccionarlo. El preview nuevo debe comprobarse por separado cuando GitHub/Vercel termine su compilación automática.
- Validación local con el dominio real configurado: lint, typecheck, build y 117/117 pruebas Playwright PASS en Chromium a tres tamaños. No se modificaron GitHub Actions, Analytics ni configuración de facturación.

No se solicitó indexación. La CI remota y la validación de Organization con una herramienta oficial son condiciones pendientes antes de recomendar fusión.
