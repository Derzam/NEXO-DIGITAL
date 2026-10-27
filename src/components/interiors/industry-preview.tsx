import { ArrowRight, Check, Circle } from "lucide-react";

const examples = [
  { title: "Catálogo digital", lead: "Tu oferta, fácil de encontrar.", rows: ["Explorar categorías", "Consultar disponibilidad", "Preparar un pedido"] },
  { title: "Reserva de trayectos", lead: "Cada viaje comienza con un plan.", rows: ["Punto de salida", "Destino y horario", "Revisión del operador"] },
  { title: "Coordinación de pedidos", lead: "El contexto acompaña la entrega.", rows: ["Pedido recibido", "Preparación", "Coordinación de ruta"] },
  { title: "Agenda de servicios", lead: "De la consulta a la cita.", rows: ["Elegir un servicio", "Proponer una fecha", "Confirmar la atención"] },
  { title: "Espacio de equipo", lead: "La información sigue su recorrido.", rows: ["Recibir una solicitud", "Asignar una revisión", "Documentar la decisión"] },
  { title: "Primer alcance", lead: "Una idea que se puede validar.", rows: ["Necesidad del usuario", "Prototipo de la solución", "Aprendizajes y siguientes pasos"] },
];

export function IndustryPreview({ index }: { index: number }) {
  const example = examples[index];
  return (
    <figure className="interior-demo">
      <div className={"industry-specimen industry-specimen-" + index} data-ui aria-hidden="true">
        <div className="screen-bar"><span className="screen-brand">Nexo</span><span>{example.title}</span><span className="screen-demo">Demo</span></div>
        <div className="industry-specimen-body">
          <p className="industry-specimen-lead">{example.lead}</p>
          <div className="industry-specimen-rows">{example.rows.map((row, i) => <div key={row}>{i === 0 ? <Check size={18} /> : <Circle size={18} />}<span>{row}</span><ArrowRight size={17} /></div>)}</div>
        </div>
      </div>
      <figcaption className="interior-note">Concepto de interfaz. Ejemplo de un posible recorrido, sujeto al alcance de cada proyecto.</figcaption>
    </figure>
  );
}
