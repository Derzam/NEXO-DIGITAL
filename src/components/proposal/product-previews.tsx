import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCheck,
  Circle,
  FileText,
  Link2,
  MessageSquare,
  Send,
} from "lucide-react";

type Family = "web" | "software" | "ia";

function ScreenBar({ title }: { title: string }) {
  return (
    <div className="screen-bar">
      <span className="screen-brand">Nexo</span>
      <span>{title}</span>
      <span className="screen-demo">Demo</span>
    </div>
  );
}

// These are static interface specimens, never presented as working client products.
export function ProductPreview({ family }: { family: Family }) {
  return (
    <div className="product-window" data-ui aria-hidden="true">
      <ScreenBar
        title={
          family === "web"
            ? "Portal de servicios"
            : family === "software"
              ? "Espacio de trabajo"
              : "Editor de flujos"
        }
      />
      {family === "web" ? (
        <div className="web-specimen">
          <aside className="screen-sidebar">
            <span>Tu espacio digital</span>
            <span className="screen-current">Presentación</span>
            <span>Servicios</span>
            <span>Contacto</span>
          </aside>
          <div className="screen-content">
            <div className="screen-kicker">Diseño que conecta</div>
            <h4>
              Tu negocio,
              <br />
              bien conectado.
            </h4>
            <p>Una experiencia clara, desde la primera visita.</p>
            <div className="screen-offer">
              <span>Sitio corporativo</span>
              <ArrowRight size={16} />
            </div>
            <div className="screen-offer">
              <span>Experiencia móvil</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      ) : family === "software" ? (
        <div className="screen-content workspace-specimen">
          <div className="screen-view-title">
            <h4>Solicitudes</h4>
            <span>Vista de equipo</span>
          </div>
          <div className="request-row">
            <span>
              <FileText size={16} /> Sitio corporativo
            </span>
            <span className="screen-status">En revisión</span>
          </div>
          <div className="request-row">
            <span>
              <FileText size={16} /> Agenda de servicios
            </span>
            <span className="screen-state">Por definir</span>
          </div>
          <div className="request-row">
            <span>
              <FileText size={16} /> Flujo de atención
            </span>
            <span className="screen-state">Borrador</span>
          </div>
          <p className="screen-note">
            Cada solicitud, con contexto y un siguiente paso.
          </p>
        </div>
      ) : (
        <div className="workflow-specimen">
          <div className="workflow-node">
            <MessageSquare size={18} />
            <div>
              <strong>Recibir una consulta</strong>
              <span>Desde el canal de contacto</span>
            </div>
          </div>
          <ArrowDown size={18} />
          <div className="workflow-node">
            <Link2 size={18} />
            <div>
              <strong>Organizar la información</strong>
              <span>Aplicar las reglas del proceso</span>
            </div>
          </div>
          <ArrowDown size={18} />
          <div className="workflow-node">
            <Send size={18} />
            <div>
              <strong>Preparar una respuesta</strong>
              <span>Con revisión humana cuando haga falta</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CompanionPreview({ family }: { family: Family }) {
  return (
    <div className="companion-preview" data-ui aria-hidden="true">
      {family === "web" ? (
        <>
          <div className="companion-title">
            Agenda de servicios <span>Vista móvil</span>
          </div>
          <div className="appointment-row">
            <span className="appointment-mark" />
            <div>
              <strong>Consulta inicial</strong>
              <span>Elige cómo empezar</span>
            </div>
            <span className="screen-status">Disponible</span>
          </div>
          <div className="appointment-foot">
            <span>Tu servicio, a un toque.</span>
            <ArrowRight size={18} />
          </div>
        </>
      ) : family === "software" ? (
        <>
          <div className="companion-title">Conexiones con sentido</div>
          <div className="integration-path">
            <span>Formulario</span>
            <ArrowRight size={18} />
            <span>Sistema</span>
            <ArrowRight size={18} />
            <span>Aviso</span>
          </div>
          <div className="appointment-foot">
            <CheckCheck size={16} />
            <span>Información que sigue su recorrido.</span>
          </div>
        </>
      ) : (
        <>
          <div className="companion-title">
            Asistente de atención <span>Ejemplo</span>
          </div>
          <div className="chat-line">Quiero organizar mis consultas.</div>
          <div className="chat-line chat-response">
            Empecemos por tu flujo de atención.
          </div>
        </>
      )}
    </div>
  );
}

export function DeliveryPreview({ family }: { family: Family }) {
  const labels =
    family === "web"
      ? ["Una oferta clara", "Contacto directo"]
      : family === "software"
        ? ["Recorridos probados", "Entrega documentada"]
        : ["Estructura técnica", "Experiencia ágil"];
  return (
    <div className="delivery-preview" aria-hidden="true">
      {labels.map((label) => (
        <span key={label}>
          <Check size={16} />
          {label}
        </span>
      ))}
    </div>
  );
}

export function PortfolioPreview() {
  return (
    <div className="portfolio-preview" data-ui aria-hidden="true">
      <ScreenBar title="Portal de proyectos" />
      <div className="portfolio-screen-body">
        <div className="portfolio-screen-main">
          <div className="screen-kicker">De una consulta a un proyecto</div>
          <h4>
            Todo empieza
            <br />
            por entender.
          </h4>
          <p>Un espacio para reunir el contexto y definir lo que sigue.</p>
          <div className="project-brief">
            <span>Solicitud de ejemplo</span>
            <strong>Una web para presentar servicios</strong>
            <div>
              <span>Objetivo</span>
              <span>Facilitar el contacto</span>
            </div>
            <div>
              <span>Alcance</span>
              <span>Por conversar</span>
            </div>
          </div>
        </div>
        <aside className="portfolio-screen-rail">
          <span>Recorrido de la idea</span>
          <div>
            <Check size={16} />
            <span>Contexto</span>
          </div>
          <div>
            <Circle size={16} />
            <span>Propuesta</span>
          </div>
          <div>
            <Circle size={16} />
            <span>Construcción</span>
          </div>
          <div>
            <Circle size={16} />
            <span>Validación</span>
          </div>
          <p>Criterio en cada decisión.</p>
        </aside>
      </div>
    </div>
  );
}
