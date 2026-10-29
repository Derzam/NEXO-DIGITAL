# Verificación del sitemap y dominio oficial — Nexo Digital Studio

**Estado:** corrección preventiva y verificación propuestas en PR Draft. **No se ha demostrado que el sitemap actual esté roto.** Este documento no representa una auditoría pública PASS ni autoriza modificar producción.

## Configuración observada (29/10/2026)

- Dominio principal elegido: `https://nexodigitalstudio.net`.
- Vercel: `nexodigitalstudio.net` verificado y asignado a Production; `www.nexodigitalstudio.net` verificado con redirección **308** hacia el dominio sin www (confirmado mediante Vercel).
- Variable `NEXT_PUBLIC_SITE_URL` en Production: `https://nexodigitalstudio.net` (confirmado mediante Vercel, sin exponer secretos).
- Último despliegue de producción verificado antes de este PR: `main@a18a3096ebcf0a16f336b4caead40aac6b9ef53a`, `READY`.
- Código actual: `src/app/sitemap.ts` genera **14 URLs** (inicio, cuatro páginas generales y nueve servicios). `/blog` y `/portafolio` siguen en preparación, con `noindex, follow`, fuera del sitemap. `src/app/robots.ts` apunta a `/sitemap.xml`.
- Las solicitudes públicas realizadas desde este entorno de verificación fallaron en resolución DNS. **No demuestra HTTP 404, error de XML ni fallo SEO de la web.** El propietario mostró previamente el sitio funcionando con HTTPS.

## Qué cambia en este PR

- `src/app/sitemap.ts`: normaliza rutas absolutas con `new URL(path, siteUrl)`, sin ampliar la indexación.
- `src/app/robots.ts`: construye la directiva `Sitemap:` con el mismo origen.
- `tests/e2e/seo.spec.ts`: comprueba 14 URLs únicas, misma raíz que el canonical, listado completo, exclusión de páginas en preparación, `robots.txt` y canonical por ruta. Opcional `SEO_EXPECTED_ORIGIN` para exigir un dominio concreto.
- `scripts/qa/verify-live-seo.mjs`: comprobador **solo lectura** para sitemap, robots, canonical, index/noindex y redirección www → raíz en el sitio público.

No se cambian el diseño, los componentes comerciales, los datos de Nexo/LlevaKí, Meta, Vercel, Search Console, GitHub Actions ni las publicaciones de Metricool. **No ejecutar automáticamente una solicitud de indexación.**

## Comprobaciones antes de una fusión

En un PC con el repositorio y Node.js:

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://nexodigitalstudio.net"
$env:SEO_EXPECTED_ORIGIN="https://nexodigitalstudio.net"
npm ci
npm run lint
npm run typecheck
npm run build
npm run test:e2e -- tests/e2e/seo.spec.ts --project=mobile-390
```

El segundo comando `npm run typecheck` está separado del build deliberadamente. No ejecutar `build` con el dominio temporal si se pretende probar el origen final.

Después de un despliegue a producción, desde un equipo que resuelva el dominio:

```powershell
node scripts/qa/verify-live-seo.mjs https://nexodigitalstudio.net
```

El script debe informar **PASS: sitemap, robots, canonicals, pending noindex routes and www redirect**. Una falla DNS/no conexión se informa como *no verificable*; investigarla por separado. Un fallo de canonical/robots/URLs, en cambio, requiere corrección antes de afirmar que SEO está listo.

Revisión manual accesible sin scripts:

1. Abrir `https://nexodigitalstudio.net/sitemap.xml` en incógnito; debe devolver XML con **14** elementos `loc`, todos empezando por `https://nexodigitalstudio.net/`.
2. Abrir `https://nexodigitalstudio.net/robots.txt`; debe incluir `Sitemap: https://nexodigitalstudio.net/sitemap.xml`.
3. Abrir `https://www.nexodigitalstudio.net/`; la dirección final debe ser `https://nexodigitalstudio.net/`, sin bucles.
4. Inspeccionar el código fuente de la Home y `/servicios/landing-pages`; el `rel="canonical"` debe usar el dominio sin www.
5. Confirmar que `/blog` y `/portafolio` **no estén en el sitemap** y sí tengan `noindex` mientras continúen en preparación.

## Search Console (después de la verificación técnica)

Una vez confirmado el sitemap público, añadir o confirmar la propiedad del dominio en Google Search Console, verificar el control del dominio según el método oficial de Google, y enviar `https://nexodigitalstudio.net/sitemap.xml` en **Sitemaps**. La aceptación de un sitemap no implica indexación instantánea ni clasificación garantizada. El estado de la propiedad, del envío y de la indexación **no se ha comprobado** en este trabajo.

## Limitaciones y decisión

- GitHub Actions tenía un bloqueo de facturación en trabajos anteriores. Un check rojo sin pasos ejecutados no equivale a un fallo de tests, pero **tampoco cuenta como PASS**.
- Este PR puede abrirse como Draft para revisión, sin desplegar cambios deliberadamente. Si Vercel crea Preview automática de la rama, no es una validación de Production.
- La verificación pública independiente de este entorno sigue pendiente hasta que se ejecute desde una red con DNS funcional.
- Los borradores de Facebook continúan desactivados hasta corregir sus imágenes y enlaces con el dominio final.
