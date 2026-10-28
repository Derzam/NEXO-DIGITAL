# Auditoría SEO V1

Base: `047fd9ff56612fa0cd0323f97ad4d83729112da0`. Los archivos `seo-v1-baseline.json`, `seo-v1-after.json` y `seo-v1-html-comparison.md` documentan el HTML de las 16 rutas antes y después de los cambios. Son builds locales: sus URLs `localhost` no representan el dominio público.

## Hallazgos y cambios

- Las 16 rutas tenían título, descripción y canonical, pero heredaban el mismo Open Graph y carecían de imagen social propia. Ahora tienen title, descripción, Open Graph y Twitter Card por ruta; se reutiliza la imagen existente `nexo-threshold.webp` (1600 × 900).
- Las 16 rutas conservan sus H1/H2 y enlaces internos en la comparación HTML. Las pruebas existentes revisan un H1 por ruta, enlaces, navegación, accesibilidad y ausencia de desbordamiento.
- Se incorporan Organization con nombre, URL y logotipo existentes y BreadcrumbList para los nueve servicios, coherente con su navegación visible. Las pruebas validan la estructura y URLs; la herramienta pública de resultados enriquecidos de Google queda pendiente.
- El fallback anterior usaba `VERCEL_URL`, que puede ser un dominio temporal. Se prioriza `NEXT_PUBLIC_SITE_URL` y luego `VERCEL_PROJECT_PRODUCTION_URL`. En Vercel producción, el build falla si falta un origen HTTPS. El dominio definitivo y los valores efectivos del proyecto siguen pendientes de confirmación; también debe estar habilitada la exposición de variables de sistema si se usa el fallback de Vercel.
- En un build local simulado con `VERCEL_ENV=preview` y `VERCEL_PROJECT_PRODUCTION_URL=example.test`, 16/16 páginas generaron `noindex, nofollow` y canonical hacia `example.test`. Esta prueba no confirma la configuración del proyecto remoto.

## Indexación aprobada para esta rama

Por solicitud del propietario, Blog y Portafolio pasan a `noindex, follow` y se excluyen del sitemap mientras estén en preparación; se conservan las páginas y los enlaces. Restaurar indexación y entradas cuando exista contenido definitivo. En Preview todas las rutas usan `noindex, nofollow`. No bloquear esas páginas mediante robots.txt mientras se use noindex: los rastreadores necesitan leer la directiva. Los archivos `seo-v1-after.json` y `seo-v1-html-comparison.md` representan el snapshot anterior al cierre; véase `seo-v1-closure.md` para la política actual.

## Rendimiento y contenido

Mediciones puntuales de Playwright sobre build local, sin limitar CPU o red; no son métricas de usuarios ni comparables con Core Web Vitals de campo:

| Ruta | Viewport | LCP local | CLS local | JS codificado |
|---|---:|---:|---:|---:|
| / | 390 | 204 ms | 0 | 245.941 B |
| /contacto | 390 | 132 ms | 0 | 251.423 B |
| / | 1440 | 216 ms | 0,000040 | 252.718 B |
| /contacto | 1440 | 188 ms | 0,000027 | 253.042 B |

El hero conserva su WebP y la carga existente; el build usa `next/font` y la prueba local no observó solicitudes externas de fuentes. INP real **no verificado**: requiere interacciones de usuarios reales y datos de campo; no se infiere de estas muestras. No se alteraron efectos ni se atribuye mejora de ranking o rendimiento a estos cambios.

Como mejoras editoriales futuras, considerar enlaces contextuales desde cada solución de industria hacia servicios pertinentes y desde cada detalle de servicio a soluciones relacionadas, con textos revisados por el propietario. El catálogo ya ofrece navegación general y servicios relacionados; no se añadieron afirmaciones comerciales.

## Validación y pendientes

- `npm ci`, lint, typecheck y build: PASS. `npm run test` (alias de Playwright): 117/117 PASS en Chromium a 390, 768 y 1440 px. Después se ampliaron aserciones de robots, Twitter y Organization: prueba SEO específica 3/3 PASS.
- La comprobación del módulo de configuración con `VERCEL_ENV=production` y sin origen configurado rechazó la ejecución como se esperaba; no sustituye una comprobación del build de Vercel con la configuración real.
- Confirmar dominio canónico y configuración efectiva en Vercel; verificar canonical, imagen social y robots en el despliegue autorizado.
- Validar JSON-LD con herramientas de Google tras un despliegue accesible y comprobar datos de campo de LCP, CLS e INP. La presencia de marcado no garantiza resultados enriquecidos.
- GitHub Actions y preview se informarán en el PR según su estado real. No se activó Search Console ni se solicitó indexación.
