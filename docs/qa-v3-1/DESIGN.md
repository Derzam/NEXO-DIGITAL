# Nexo Digital Studio — refinamiento V3.1

Rama: `codex/home-v3-1-refinement`. Base: `b924631446a88f983bb5fbeef2a903b7fd652d38`, que incorpora el wordmark aprobado sobre la Home V3 `4b119c71c61d09a22239eb755e9268d66cfd9fed`. La rama V3 original permanece disponible para comparación.

## Dirección conservada

El portal arquitectónico, la imagen espacial, su encuadre, las luces, el titular, los botones, los tamaños y la composición del hero se conservan. El logo, header y footer tampoco se rediseñan. El HTML del hero y sus píxeles se comparan con la base en los tres anchos; véase [QA.md](QA.md).

## Qué cambia debajo del hero

- **Servicios:** el bento sustituye placas abstractas por ejemplos de portal web, solicitudes de equipo, agenda, integraciones y flujo de atención. Cada familia cambia la interfaz que se presenta. Las tarjetas mantienen el área completa del enlace al servicio; los ejemplos no introducen botones o formularios falsamente operables.
- **Portafolio:** una vista editorial contrapone el contexto del trabajo a un concepto de portal de proyectos. Se mantiene el aviso de casos en preparación y el enlace al portafolio real. No se presenta ese concepto como un encargo de un cliente.
- **Soluciones:** un explorador con Tabs permite recorrer Comercios, Profesionales y Equipos. El contenido describe necesidades y recorridos propuestos, y enlaza a la ruta existente de Soluciones.
- **Metodología y FAQ:** mantienen los cinco pasos y las cinco preguntas, con menos texto auxiliar, menor separación y controles legibles. Siguen disponibles las mismas respuestas y acciones por teclado.
- **Cierre:** reutiliza la imagen existente del portal, con otro recorte y un scrim para proteger el texto. La acción azul lleva a WhatsApp y el enlace secundario a Contacto. El titular se mantiene en dos líneas en móvil.

## Criterio de composición

El recorrido alterna bento, composición editorial, explorador por negocio, listas compactas y escena final. La luz se concentra en las imágenes de apertura y cierre. Los ejemplos de software usan superficies opacas con cambios de tono, sin añadir glows, glassmorphism o sombras decorativas. Se mantienen Manrope y DM Sans y la paleta aprobada.

Se reutilizan Button, Card, Tabs y Accordion de shadcn/ui, Tailwind con el prefijo existente y Lucide. No hay dependencias, imágenes, fuentes o motores de animación nuevos. Los estilos adicionales se limitan a las secciones nuevas y a los fragmentos demostrativos. `RefinedSections` mantiene la estructura estática en servidor; Tabs y acordeones usan el componente cliente existente.

## Interfaces demostrativas y contenido

Los ejemplos son HTML/CSS adaptables, con contenido legible y estados escritos. Representan solicitudes, agendas y pasos de un proceso; no contienen ingresos, métricas comerciales, clientes o testimonios inventados.

La Home muestra “Interfaces demostrativas. Datos de ejemplo.” y “Concepto de interfaz, sin datos de clientes.”. Dentro de las ventanas se identifica “Demo” o “Ejemplo”. Nombres como “Sitio corporativo”, “Consulta inicial”, “Borrador” y “Por conversar” forman parte de esos ejemplos. No se guardan ni envían datos desde ellos. Las ilustraciones de interfaz se excluyen del árbol accesible para evitar duplicar texto decorativo; los títulos, descripciones, avisos y enlaces reales permanecen accesibles.

## Herramientas de diseño

Se conserva la dirección TasteSkill `dense-tiles`, **The well-kept board**, semilla **1057675573**. No se vuelve a sortear la dirección aprobada.

Para las interfaces se obtuvo `Framed sheet`, `smb-admin`, semilla **1297791288**. Se toma su separación entre marco, hoja de trabajo y contenido. Se adapta su hoja clara a los tonos oscuros aprobados por el propietario; no se cambia la identidad del sitio para seguir una recomendación automática. Los atributos `data-ui` aparecen solo en los verdaderos fragmentos de interfaz. El inspector de la página no usa modo app ni exclusiones.

UI/UX Pro Max se consultó para navegación de pestañas, orden de foco y contenido no oculto por navegación fija. Las nuevas pestañas tienen objetivos de 44 px y una comprobación de regresión que impide que se superpongan al panel.

## Decisiones pendientes de aprobación

La dirección del hero ya está aprobada. Esta entrega presenta las secciones inferiores V3.1 para revisión visual. No autoriza migrar páginas interiores ni desplegar producción. La galería y el informe muestran también los compromisos de densidad y los resultados estéticos que permanecen en FAIL.
