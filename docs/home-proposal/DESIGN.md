# Nexo — Home con Tailwind y shadcn/ui

Base: c5c0e857984a0ecea3c4f41735a64a6c19ca6e28. Rama: codex/home-shadcn-proposal. La rama feat/nexo-website-v1 permanece en la V2.

## Concepto: El siguiente umbral

Un umbral arquitectónico iluminado en un paisaje espacial reemplaza el núcleo orbital. La luz se convierte en una metáfora de avanzar desde una idea hacia un producto. La imagen es una ilustración conceptual original generada para el estudio; no representa una obra, un cliente o un resultado real.

La escena cinematográfica acompaña un titular breve y una propuesta explícita de software, diseño e IA. El recorrido alterna una portada abierta, un bento de servicios asimétrico, un espacio editorial para los futuros casos, una metodología interactiva y preguntas frecuentes.

Se mantiene la lectura vertical en móvil y el estado final de todas las animaciones bajo movimiento reducido. El producto se entiende sin animación. No se añaden métricas, clientes ni testimonios.

## Alcance y sistema

Solo se desarrolla la Home. Header y footer nuevos se activan en esa ruta; las páginas interiores conservan su V2. Los componentes existentes no se sobrescriben: shadcn se aloja en src/components/shadcn.

Tailwind v4 usa el plugin oficial PostCSS. Se omite Preflight para conservar la base existente y se usa el prefijo tw para evitar colisiones con clases como container. Las utilidades se ordenan después de la capa legacy, con tokens semánticos propios. La configuración de shadcn se inicializa manualmente según su guía para proyectos existentes y los componentes se obtienen del CLI oficial.

Componentes necesarios: Button (acciones), Card (bento), Navigation Menu (escritorio), Sheet (menú móvil), Tabs (familias de servicios), Accordion (metodología y FAQ). Input, Select y Dialog se reservan para futuras interacciones justificadas; no se migra el formulario de Contacto en esta fase.

## Dirección y decisiones

Se conservan Manrope y DM Sans servidas localmente, pero cambian escala, jerarquía, composición y relación entre texto e imagen. Fondo azul noche, superficies casi negras y un acento eléctrico. La escena lleva la iluminación; las tarjetas no repiten resplandores o degradados.

TasteSkill propone dense-tiles: se toma su variación de anchos en el bento, adaptando el marco a espacios amplios y la portada cinematográfica expresamente solicitada. Se mantienen visibles las divergencias de la rúbrica estética, sin desactivar reglas.

## Documentación consultada

- https://tailwindcss.com/docs/installation/framework-guides/nextjs
- https://tailwindcss.com/docs/preflight
- https://ui.shadcn.com/docs/installation/next
- https://ui.shadcn.com/docs/installation/manual
- https://ui.shadcn.com/docs/components-json
- https://ui.shadcn.com/docs/cli

La migración de las páginas interiores requiere aprobación visual de esta propuesta.

## Sistema aplicado

Tailwind CSS y su plugin PostCSS: 4.3.3. Radix: 1.8.1. Los seis componentes shadcn se personalizan en el repositorio; no se introduce otra biblioteca de animación o un motor 3D.

| Rol                | Decisión                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Fondo / superficie | `#070e1c` / `#0d1a2c`                                                                                |
| Texto / secundario | `#eef4ff` / `#a9bad0`                                                                                |
| Acción / foco      | `#2164e8` / `#83cfff`                                                                                |
| Tipografía         | Manrope para títulos; DM Sans para lectura y controles; variables de `next/font`                     |
| Escala             | Hero 98/58/56 px; títulos de sección fluidos; cuerpo 16–19 px; controles y datos auxiliares 13–16 px |
| Radios             | Token base 12 px; bento 16 px; CTA 24 px; acciones principales redondas                              |
| Espacio            | Unidad Tailwind de 4 px; secciones 112/88/72 px; márgenes 80/32/20 px según resolución y contenedor  |

La recomendación automática de UI/UX Pro Max devolvió una variante brutalista, monocroma y con cambios instantáneos. Se adoptaron su asimetría, espacio y comprobaciones de accesibilidad; se descartó esa piel porque contradice la dirección azul noche, cinematográfica y suave solicitada.

TasteSkill: dirección `dense-tiles`, **The well-kept board**, semilla **1057675573**, sin redibujos. El bento conserva la variación de proporciones; el resto del recorrido evita convertirse en una cuadrícula continua.

## Relación con las referencias del propietario

| Referencia                           | Interpretación propia                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Horizonte azul luminoso              | Atmósfera oscura, escala monumental y luz azul en el umbral; se abandona el planeta/orbita de V2.                              |
| Esfera de conexiones                 | Conexión entre productos y procesos en el bento; no se reutiliza el globo de la referencia.                                    |
| Sección con onda y tarjetas violetas | Asimetría y contraste de masas; superficies azules planas y contenido editorial en lugar de copiar la onda o el color violeta. |

## Recursos y límites

`public/images/nexo-threshold.webp`: ilustración conceptual original generada mediante imagegen para esta propuesta, 1600×900 px, **105.014 bytes**. No es una fotografía, una instalación real ni un proyecto de un cliente. Su uso es atmosférico y su alternativa es vacía porque el contenido informativo está en el texto HTML.

El bento y la carpeta editorial son dibujos CSS originales. La carpeta anuncia casos de estudio pendientes; no contiene nombres, resultados, capturas de productos o testimonios inventados. No se descargaron fotografías o videos de terceros y no hay créditos de bancos de imágenes que atribuir.

La Home nueva utiliza Tabs para explorar familias de servicios, acordeones para revelar información y Sheet para la navegación compacta. Todos tienen estados de teclado y foco. La animación de entrada de la escena y los estados de hover se anulan con movimiento reducido; no hay contenido dependiente de un efecto de scroll.

Se conservan las divergencias estrictas de TasteSkill y su puntuación limitada en [QA.md](QA.md). La aprobación pendiente es la del propietario sobre esta dirección visual; no implica autorización de migrar las páginas interiores o publicar producción.
