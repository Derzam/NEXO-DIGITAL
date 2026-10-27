# Comparación visual — V4.1

Capturas del build de producción local en 390×844, 768×1024 y 1440×900. Se comparan las capturas existentes de V4.1 antes de los ajustes (`before/`) con el candidato auditado (`after/`). Las páginas capturadas devolvieron HTTP 200 y no presentaron overflow horizontal.

## Home aprobada

El hero y la página completa se compararon píxel a píxel con la Home aprobada de V3.1. Las seis comparaciones dieron cero píxeles diferentes: [detalle JSON](after/home-comparison.json).

| Ancho | Primer viewport | Página completa |
| --- | --- | --- |
| 390 px | [V3.1](../qa-v4/before/home-390-fold.png) · [V4.1](after/home-390-fold.png) | [V3.1](../qa-v4/before/home-390-full.png) · [V4.1](after/home-390-full.png) |
| 768 px | [V3.1](../qa-v4/before/home-768-fold.png) · [V4.1](after/home-768-fold.png) | [V3.1](../qa-v4/before/home-768-full.png) · [V4.1](after/home-768-full.png) |
| 1440 px | [V3.1](../qa-v4/before/home-1440-fold.png) · [V4.1](after/home-1440-fold.png) | [V3.1](../qa-v4/before/home-1440-full.png) · [V4.1](after/home-1440-full.png) |

## Interiores antes / después

El ajuste de Contacto conserva la composición. Solo cambia el margen de desplazamiento del campo al mostrar validación nativa bajo el header fijo y el contraste del botón mientras espera hidratación. Las capturas de 390, 768 y 1440 px permiten comprobar que no se introdujo desplazamiento visual.

| Página | 390 px | 768 px | 1440 px |
| --- | --- | --- | --- |
| Servicios | [antes](before/servicios-390-fold.png) · [después](after/servicios-390-fold.png) | [antes](before/servicios-768-fold.png) · [después](after/servicios-768-fold.png) | [antes](before/servicios-1440-fold.png) · [después](after/servicios-1440-fold.png) |
| Landing pages | [antes](before/servicios-landing-pages-390-fold.png) · [después](after/servicios-landing-pages-390-fold.png) | [antes](before/servicios-landing-pages-768-fold.png) · [después](after/servicios-landing-pages-768-fold.png) | [antes](before/servicios-landing-pages-1440-fold.png) · [después](after/servicios-landing-pages-1440-fold.png) |
| Sistemas web | [antes](before/servicios-sistemas-web-390-fold.png) · [después](after/servicios-sistemas-web-390-fold.png) | [antes](before/servicios-sistemas-web-768-fold.png) · [después](after/servicios-sistemas-web-768-fold.png) | [antes](before/servicios-sistemas-web-1440-fold.png) · [después](after/servicios-sistemas-web-1440-fold.png) |
| Aplicaciones móviles | [antes](before/servicios-aplicaciones-moviles-390-fold.png) · [después](after/servicios-aplicaciones-moviles-390-fold.png) | [antes](before/servicios-aplicaciones-moviles-768-fold.png) · [después](after/servicios-aplicaciones-moviles-768-fold.png) | [antes](before/servicios-aplicaciones-moviles-1440-fold.png) · [después](after/servicios-aplicaciones-moviles-1440-fold.png) |
| Contacto | [antes](before/contacto-390-fold.png) · [después](after/contacto-390-fold.png) | [antes](before/contacto-768-fold.png) · [después](after/contacto-768-fold.png) | [antes](before/contacto-1440-fold.png) · [después](after/contacto-1440-fold.png) |
| Soluciones | [antes](before/soluciones-390-fold.png) · [después](after/soluciones-390-fold.png) | [antes](before/soluciones-768-fold.png) · [después](after/soluciones-768-fold.png) | [antes](before/soluciones-1440-fold.png) · [después](after/soluciones-1440-fold.png) |
| Portafolio | [antes](before/portafolio-390-fold.png) · [después](after/portafolio-390-fold.png) | [antes](before/portafolio-768-fold.png) · [después](after/portafolio-768-fold.png) | [antes](before/portafolio-1440-fold.png) · [después](after/portafolio-1440-fold.png) |

## Observación visual

Se conserva la navegación, paleta nocturna, tipografía, ritmo editorial y vistas conceptuales de producto. En móvil, Servicios mide 4 971 px y Soluciones 5 833 px de alto; son recorridos largos y conviene evaluar su carga de lectura con usuarios en aceptación comercial. Los bloques de interfaz están identificados como demostraciones, no como proyectos de clientes.

Capturas completas de Home y Contacto: [Home 390 px](after/home-390-full.png) · [Home 768 px](after/home-768-full.png) · [Home 1440 px](after/home-1440-full.png) · [Contacto 390 px](after/contacto-390-full.png) · [Contacto 768 px](after/contacto-768-full.png) · [Contacto 1440 px](after/contacto-1440-full.png).
