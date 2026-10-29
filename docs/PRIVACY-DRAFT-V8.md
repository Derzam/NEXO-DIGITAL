# Borrador interno de privacidad — V8

**BORRADOR PARA REVISIÓN. No es una política aprobada ni debe publicarse como tal.** Este archivo está en el repositorio y puede ser visible para quienes tengan acceso a él; no incluir datos privados en sus campos pendientes. Requiere revisión por asesoría competente en Ecuador y confirmación de operaciones y contratos efectivos antes de cualquier publicación. No determina por sí solo cumplimiento legal.

## Responsable y contacto

- **Modalidad comercial más reciente (29/10/2026):** el propietario decidió que **Nexo Digital Studio operará temporalmente como línea/marca de LlevaKí S.A.S.** La decisión del 28/10 de persona natural quedó sustituida. La empresa, no la marca comercial, sería responsable de los tratamientos que efectivamente controle, sujeto a verificación y revisión jurídica.
- **Identidad del responsable del tratamiento:** **[RAZÓN SOCIAL, RUC, REPRESENTANTE Y DATOS DE CONTACTO DE LA SOCIEDAD — PENDIENTES DE VERIFICACIÓN Y AUTORIZACIÓN PARA PUBLICACIÓN]**. No afirmar que el RUC esté activo o que el nombre comercial ya conste registrado.
- Domicilio legal y correo de contacto: **[PENDIENTES]**.
- Canal para ejercer derechos y, si aplica, datos del delegado: **[PENDIENTES DE DEFINIR Y VERIFICAR]**.
- No existe transferencia automática futura ni plazo de operación jurídicamente definido; la decisión posterior de cambiar nuevamente el operador exigirá actualización de contratos y avisos. No publicar este borrador con campos pendientes.

El artículo 12 de la LOPDP requiere información verificable del responsable (incluidos domicilio legal, teléfono y correo de contacto), entre otros extremos. **No publicar** un aviso que conserve estos campos vacíos; considerar un canal comercial de contacto adecuado sin revelar un domicilio privado innecesariamente, sujeto a asesoría competente.

## Datos y finalidades que deben confirmarse

La interfaz solicita nombre, correo electrónico, servicio y descripción del proyecto; el presupuesto es opcional. Estos datos sirven para preparar una consulta comercial. El visitante podría escribir información adicional en texto libre: debe evitar introducir datos sensibles o de terceros que no sean necesarios. La finalidad, el alcance y las posteriores operaciones de atención de solicitudes requieren confirmación del responsable.

En el navegador, el formulario valida los campos y crea un enlace `wa.me` con el mensaje codificado en el parámetro `text`. El código revisado no implementa almacenamiento en una base de datos del sitio ni envío del formulario a un backend propio; mantiene el enlace preparado en el estado de la página para recuperarlo si la ventana no se abre. La codificación de URL **no es cifrado**: el contenido puede quedar expuesto en la dirección y en el entorno del navegador o del destinatario. Deben revisarse las prácticas de esos entornos. Antes de la hidratación se deshabilitan los campos; sin JavaScript se ofrece un enlace general sin datos del formulario.

Al abrir el enlace se transmite la solicitud de apertura a WhatsApp con el texto en la URL. Preparar o abrir el mensaje no equivale a enviarlo: el visitante decide si lo envía dentro de WhatsApp. Una vez enviado, su tratamiento depende de WhatsApp y de las prácticas reales de quien atiende el número; no se han verificado la cuenta, sus dispositivos, copias de seguridad ni conservación. Consultar la [política de privacidad de WhatsApp](https://www.whatsapp.com/legal/privacy-policy) aplicable y revisar la relación entre las partes. No garantizar recepción o eliminación.

El sitio utiliza alojamiento e infraestructura Vercel. Las solicitudes pueden implicar dirección IP, metadatos de red, fecha, ruta, referidor y agente de usuario, según la función y configuración. La documentación de Vercel contempla registros técnicos y tratamiento de IP para seguridad; **no se han confirmado las funciones activadas, ubicaciones, destinatarios, accesos ni retenciones concretas de este proyecto**. Ver [registros](https://vercel.com/docs/logs/runtime) y [tratamiento de IP para seguridad](https://vercel.com/docs/query/monitoring). La ausencia de base de datos del formulario no elimina el tratamiento técnico de datos personales.

El layout integra una instancia de Vercel Web Analytics; el código revisado no incorpora eventos personalizados de conversión. Según [Vercel: privacidad de Web Analytics](https://vercel.com/docs/analytics/privacy-policy), el servicio registra vistas y usa un identificador hash temporal sin cookies de terceros; pueden incluirse ruta, referidor, parámetros filtrados, zona aproximada, navegador y dispositivo. Esto describe el producto según el proveedor, no una garantía independiente sobre toda la infraestructura. Vercel advierte que rutas o parámetros podrían contener datos personales; revisar configuración real y evitar incorporarlos en URL del sitio. Véase [redacción de datos sensibles](https://vercel.com/docs/analytics/redacting-sensitive-data). La activación efectiva y configuraciones del proyecto en producción deben confirmarse por separado.

## Información legal pendiente de completar

- **Finalidades y bases jurídicas por operación:** [PENDIENTE DE ANÁLISIS]; no se presume consentimiento ni se selecciona otra base sin análisis.
- **Plazos de conservación y criterios de eliminación:** [PENDIENTES], incluidos mensajes, copias, registros y analítica; no se fijan cifras sin evidencia.
- **Destinatarios y encargados:** [PENDIENTE DE IDENTIFICAR], incluyendo roles y contratos reales con proveedores.
- **Transferencias nacionales o internacionales, países, mecanismos y garantías:** [PENDIENTES DE VERIFICAR], incluida la configuración de proveedores y normativa secundaria aplicable.
- **Derechos y procedimiento:** [PENDIENTE DE REVISIÓN LEGAL]. Informar los derechos aplicables de acceso, rectificación y actualización, eliminación, oposición y demás derechos previstos por la LOPDP, las condiciones y un canal verificable. Incluir cómo acudir ante la autoridad competente sin prometer resultados.
- **Seguridad, incidentes y medidas organizativas:** [PENDIENTE DE VERIFICACIÓN]; no se declaran certificaciones ni garantías no acreditadas.
- **Fecha y responsable de aprobación del texto:** [PENDIENTES].

## Fuentes oficiales para revisión

- [LOPDP, texto publicado por la SPDP](https://spdp.gob.ec/wp-content/uploads/2024/12/03.pdf.pdf); [registro de aprobación de la Asamblea Nacional](https://www.asambleanacional.gob.ec/es/leyes-aprobadas?fecha=&leyes-aprobadas=768&title=datos+personales).
- [Reglamento general, Decreto 904](https://spdp.gob.ec/wp-content/uploads/2024/12/04.pdf.pdf) y [normativa de la SPDP](https://www.spdp.gob.ec/docs/proteccion-de-datos-personales/general/normativa/).
- [Resoluciones de la SPDP](https://www.spdp.gob.ec/resoluciones/), incluidas normas secundarias sobre transferencias; comprobar vigencia y aplicabilidad antes de publicar.
- [Vercel Web Analytics: privacidad](https://vercel.com/docs/analytics/privacy-policy) y [registros de ejecución](https://vercel.com/docs/logs/runtime).

Fuentes consultadas el 28 de octubre de 2026. El análisis no sustituye la revisión del texto vigente, reformas ni asesoría jurídica.
