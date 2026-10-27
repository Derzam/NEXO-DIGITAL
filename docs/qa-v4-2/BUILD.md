# Reproducción del build — V4.2

Entorno local: Windows, Node 24.14.0, npm 11.9.0, Next 16.4.3 y dependencias instaladas. CI usa Ubuntu y Node 22; no se dispone de un entorno Linux funcional en este host. Ninguna ejecución local demuestra un resultado de CI o Vercel.

| Ensayo | Resultado | Evidencia |
| --- | --- | --- |
| Turbopack en checkout principal, con el script previo `next build` | **FAIL** | [Panic](turbopack-checkout-panic.log): el worker Node terminó antes de conectar durante PostCSS. No hubo salida diagnóstica del worker. |
| Turbopack limpio en copia física aislada del candidato | **PASS local** | [Log](build-turbopack-clean.log): sin `.next` ni caché de `node_modules` antes del ensayo; 20 páginas generadas. Los archivos de aplicación y prueba del candidato tenían hashes idénticos a los del checkout al realizarlo. |
| Webpack en copia aislada de V4.1 | **PASS local** | [Log](build-webpack-isolated.log): 20 páginas generadas. |
| Comando estándar V4.2 en checkout principal | **PASS local** | [Log final](build-webpack-final.log): `npm run build`, que ejecuta `next build --webpack`. [Ejecución anterior](build-webpack.log). |

El fallo previo no se reprodujo en la copia limpia, pero cambiaron ruta, disposición física de dependencias, estado de caché y condiciones de procesos. No hay evidencia suficiente para identificar la causa raíz ni para atribuirla a los estilos o al sistema operativo. El warning sobre un lockfile externo apareció en las copias y en el checkout. En los logs conservados se normalizaron finales de línea y espacios al final de línea.

## Configuración elegida

El script `build` usa explícitamente `next build --webpack`, que compiló en el checkout y en copia aislada. `npm run build:turbopack` conserva un comando explícito para investigar Turbopack; no se silencian sus errores. Next documenta `--webpack` como alternativa compatible en [la guía de actualización a Next 16](https://nextjs.org/docs/app/guides/upgrading/version-16) y en la [referencia de CLI](https://nextjs.org/docs/app/api-reference/cli/next).

Para la futura ejecución en CI y Vercel, instalar las dependencias desde el lockfile con `npm ci` y usar exactamente **`npm run build`**. El workflow actual ya usa ese comando; en Vercel hay que confirmar que ningún override lo sustituya. `next/font/google` necesita acceso a sus fuentes durante el build. La configuración efectiva, la versión Node y el resultado en ambos servicios son **NO VERIFICADOS** hasta poder ejecutar allí. No se hicieron despliegues ni reintentos de GitHub Actions.
