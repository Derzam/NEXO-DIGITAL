# V4.1 — Motion Enhancement

## Estado del trabajo

**Diagnóstico previo a las correcciones, realizado contra `main` en `52e678d3653728e07542d70deb59123e0af2e928`.** En este punto todavía no se han modificado componentes ni estilos de producto para V4.1. Se conservaron capturas y datos de Chromium en [`docs/evidence/v4-1-motion-enhancement/baseline/`](evidence/v4-1-motion-enhancement/baseline/).

## 1. Diagnóstico técnico previo

### Causa raíz confirmada

El scroll reveal de V4 **no ejecuta una transición CSS real**. La regla de transición solo existe mientras el atributo está en `data-motion="pending"`:

```css
main section[data-motion="pending"] {
  opacity: 0.96;
  transform: translate3d(0, 20px, 0);
  transition: opacity 560ms var(--ease), transform 560ms var(--ease);
}
```

Cuando `IntersectionObserver` cambia el atributo a `data-motion="visible"`, esa regla deja de coincidir. La regla visible declara los valores finales, pero no conserva `transition`. Chromium confirmó el salto: el estado previo reportó la transición de 560 ms, el nuevo estado calculado pasó a `transition: all` (regla subyacente), **no emitió `transitionrun`, `transitionstart` ni `transitionend` y no creó objetos de animación**. Una reproducción CSS mínima confirmó el mismo comportamiento. Por tanto, el reveal se aplica de inmediato, sin interpolación, y su cambio de solo 20 px / 4 % de opacidad resulta además poco perceptible.

### Hero y microinteracciones

Las animaciones del hero sí están conectadas: Chromium resolvió `--ease` a `cubic-bezier(0.16, 1, 0.3, 1)` y encontró los keyframes `motion-hero-rise` y `motion-hero-fade` en ejecución. No se observó una anulación del cascade ni errores JavaScript. La causa de su baja presencia visual es de intensidad y duración: el ascenso actual es de 18 px y dura entre 450 y 650 ms en los elementos principales; la secuencia acaba rápidamente y no existe una capa ambiental animada en el hero. El indicador de 350 ms y el pie de 450 ms solo hacen fade.

Al fijar la animación real del título en el 50 % de su duración mediante la API Web Animations, Chromium calculó opacidad `0.971779` y solo `0.508 px` restantes desde su posición final, frente a los `18 px` de inicio. La curva global es válida, pero tan front-loaded que gran parte del cambio visual ocurre al comienzo y casi no hay progresión perceptible en la mitad restante. V4.1 usará una curva de movimiento local al sistema Motion, sin alterar `--ease` global ni otras páginas.

La tarjeta de servicios comprobada se eleva **3 px** al pasar el puntero. El efecto funciona, pero queda por debajo de la profundidad visual solicitada. El selector global antiguo basado en `animation-timeline: view()` está soportado por Chromium, pero sus selectores `.home-service-grid > a` / `.section-topline > *` no coinciden con el Home actual, por lo que no causan el fallo observado.

### Cascada, carga y runtime

- `src/styles/app.css` importa `globals.css` en `legacy` y, después, `refinement.css`, `interiors.css` y `motion.css` en `components`; la hoja Motion se carga realmente. No se encontró una colisión que invalide las reglas del hero.
- `--ease` sí está definido en `:root` en `src/app/globals.css` y su valor calculado es válido.
- `MotionEnhancer` crea un observer por montaje/`pathname`, desconecta el observer y listeners al cambiar de ruta, y tiene rutas explícitas para foco, puntero y cambio dinámico a reduced motion. La navegación con Next.js Link actualizó los estados en `/servicios` y `/blog`; no aparecieron errores de página.
- `/admin` redirigió a `/admin/login` y tuvo cero nodos con `data-motion` o clases del hero.
- Con JavaScript deshabilitado, el título, CTA y secciones permanecieron visibles y no se añadió ningún atributo Motion.
- Al cambiar una sesión de `no-preference` a `reduce`, las secciones pendientes quedaron visibles, con opacidad 1 y sin transformación. Al volver a `no-preference`, no se volvieron a ocultar ni reanimar.

### Línea base y evidencia

`npm run lint`, `npm run typecheck` y `npm run build` pasan en `main` antes de modificar Motion. Chromium no registró errores de página. El JSON con estilos computados, progreso de animación, estados de reduced motion y resultados sin JavaScript está en [`baseline-computed-styles.json`](evidence/v4-1-motion-enhancement/baseline/baseline-computed-styles.json).

- Fotogramas del hero de las animaciones CSS existentes, muestreados al inicio, mitad y final: [inicio](evidence/v4-1-motion-enhancement/baseline/hero-initial-baseline.png), [mitad](evidence/v4-1-motion-enhancement/baseline/hero-middle-baseline.png), [final](evidence/v4-1-motion-enhancement/baseline/hero-final-baseline.png).
- Tarjeta antes y durante hover: [reposo](evidence/v4-1-motion-enhancement/baseline/card-before-baseline.png), [hover](evidence/v4-1-motion-enhancement/baseline/card-hover-baseline.png).
- Estado posterior a intersección, donde V4 cambia sin transición: [evidencia](evidence/v4-1-motion-enhancement/baseline/scroll-after-intersection-no-transition.png).

## 2. Conclusión antes de corregir

La prioridad no es solo aumentar valores: primero hay que hacer que la transición del reveal sobreviva al cambio de estado y demostrar que el navegador interpola los valores. Después se reforzarán, con moderación, los recorridos del hero, el ambiente visual, el stagger de grupos seleccionados y la profundidad de tarjetas/CTA. Se conservarán el diseño en reposo, el contenido visible sin JavaScript, los estados de foco, la navegación y reduced motion.

**Alcance protegido:** hasta este punto no se modificaron `/admin/**`, `/api/**`, autenticación, Supabase, reseñas, base de datos, formularios, middleware, SEO, sitemap, robots, WhatsApp, credenciales ni integraciones externas.

---

## 3. Implementación y validación final

*Se completará esta sección después de aplicar las correcciones, ejecutar las pruebas de movimiento real y comparar rendimiento contra el mismo `main`.*
