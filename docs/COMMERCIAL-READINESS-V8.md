# Preparación comercial y de privacidad — V8

**Interno, pendiente de revisión y aprobación.** Base revisada: `07f31157032841369cd4e4dd89e98ad1f9128d5d` (main; PR #11 fusionado). Al consultar Vercel, se observó un despliegue de producción READY asociado a ese mismo SHA. Esta observación no verifica todas las opciones del proyecto, el dominio definitivo ni el cumplimiento legal.

## Modelo de operación confirmado (decisión del propietario, 2026-10-28)

**Decisión posterior de 29/10/2026:** Nexo Digital Studio operará temporalmente bajo **LlevaKí S.A.S.**, como marca comercial. Esta decisión reemplaza la opción de persona natural elegida el 28/10/2026. El nombre Nexo no es persona jurídica independiente. No existe plazo automático de cambio, ni se ha verificado el RUC y los requisitos habilitantes para facturar bajo la sociedad.

**Pendiente de verificar antes de operar y facturar:** razón social y representante legal de LlevaKí S.A.S., estado de su RUC, actividades y nombre comercial registrados, situación societaria y contable, obligaciones, emisión de comprobantes, contratos y tratamiento de datos. No insertar contraseñas, identificaciones privadas ni documentos fiscales internos en este repositorio. Ver [verificación societaria y tributaria](RUC-SOCIEDAD-LLEVAKI-V8.md). El objeto social aportado contempla software y web, pero no sustituye las comprobaciones ante SRI y Supercias.

## Inventario de operaciones y evidencia

| Operación | Evidencia en el repositorio | Límites y decisiones |
| --- | --- | --- |
| Formulario | `src/components/contact-form.tsx`: nombre, correo, servicio y descripción obligatorios; presupuesto opcional. Validación y `FormData` en cliente; mensaje y URL en estado local. | No se encontró backend de recepción en este flujo. El navegador y el sistema operativo pueden conservar información por sus propias funciones. Confirmar tratamientos posteriores. |
| Apertura | `src/lib/content.ts`: `wa.me/593984447960` con `encodeURIComponent`; el formulario abre una ventana y mantiene enlace de recuperación. | La URL contiene datos del mensaje; abrir no envía el mensaje de chat. Confirmar titularidad, manejo, acceso, copias y conservación. No colocar datos reales en pruebas. |
| Analítica | `src/app/layout.tsx` incorpora `<Analytics />`; no se encontró llamada `track()` en `src`. | Vistas de página según [Vercel](https://vercel.com/docs/analytics/privacy-policy); configuración real, parámetros, conservación y permisos por verificar. No se han incorporado eventos de conversión. |
| Infraestructura | El despliegue de producción observado está en Vercel. | Las solicitudes y sistemas de seguridad pueden tratar IP y otros metadatos. Revisar configuración, registros, terceros, ubicación y contratos; la documentación de producto no demuestra configuración particular. |
| Contenido | ORVENTI y LlevaKí constan como referencias con leyendas de demostración; Blog sigue visible y en preparación. | Confirmar formalmente derechos de materiales y decisión sobre Blog. No describir proyectos como casos de clientes externos sin evidencia. |

## Dominio: comparación preliminar

| Opción | Ventajas | Riesgos y pasos sujetos a autorización |
| --- | --- | --- |
| Mantener temporalmente `nexo-digital-mu.vercel.app` | Ya existe y evita una adquisición o cambio inmediato. | Dirección dependiente del proveedor y menos propia de la marca; revisar continuidad, canales de contacto y configuración de indexación antes de cualquier decisión. |
| Dominio comercial propio | Identidad de marca y control del nombre, sujeto a disponibilidad y titularidad. | Registro y renovación pueden tener costes; elegir titular, registrar, configurar DNS/TLS y verificar efectos en canonical, Search Console y enlaces requeriría autorización y trabajo posterior. No se ha comprobado disponibilidad ni comprado dominio. |

Recomendación preliminar: mantener la dirección actual mientras el propietario decide marca, titular y presupuesto; planificar por separado cualquier migración. No se ha modificado DNS, configuración, facturación ni indexación. La marca no acredita una razón social o propiedad jurídica concreta.

## Decisiones y riesgos

La [matriz de aceptación](ACCEPTANCE.md) recoge responsable, dominio, privacidad, número, materiales y textos como pendientes. El [borrador interno](PRIVACY-DRAFT-V8.md) identifica los campos jurídicos que deben completarse. Revisar la base jurídica por operación, los roles de proveedores, medidas, derechos, transferencias y conservación con asesoría ecuatoriana; no presumir consentimientos ni protección contractual. Revisar si se necesita registro u otras obligaciones de la SPDP, según las operaciones concretas.

No se propone implementar seguimiento adicional en esta fase. Los eventos de intención potenciales no demostrarían envío ni recepción, y requerirían aprobación previa y revisión de privacidad.

## Verificaciones V8

Inspección estática de formulario, función WhatsApp, layout y referencias de Analytics; consulta de estado del PR #11 y despliegue de producción; revisión documental de fuentes oficiales. `git diff --check`, revisión de alcance, enlaces internos y búsqueda de patrones evidentes de secretos se ejecutan antes del commit. La revisión por patrón no garantiza ausencia absoluta de secretos. Las pruebas de V7 se conservan como evidencia histórica en la matriz; esta fase documental no ejecuta npm, build ni E2E y no modifica interfaz. No se ha auditado el panel completo de Vercel ni hecho validación legal profesional.
