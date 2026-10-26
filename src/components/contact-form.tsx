"use client";
import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { services, whatsappUrl } from "@/lib/content";
export function ContactForm(){
 function handleSubmit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
  const data=new FormData(form);const get=(field:string)=>String(data.get(field)||"").trim();
  const message=["Hola, quisiera solicitar una cotización a Nexo Digital Studio.","Nombre: "+get("nombre"),"Correo: "+get("correo"),"Servicio: "+get("servicio"),"Proyecto: "+get("proyecto"),get("presupuesto")?"Presupuesto orientativo: "+get("presupuesto"):""].filter(Boolean).join("\n");
  window.open(whatsappUrl(message),"_blank","noopener,noreferrer");
 }
 return <form className="contact-form" onSubmit={handleSubmit}>
  <div className="form-grid"><div className="form-field"><label htmlFor="nombre">Nombre completo *</label><input id="nombre" name="nombre" autoComplete="name" placeholder="Tu nombre" required maxLength={100}/></div><div className="form-field"><label htmlFor="correo">Correo electrónico *</label><input id="correo" name="correo" type="email" autoComplete="email" placeholder="nombre@empresa.com" required maxLength={254}/></div></div>
  <div className="form-grid"><div className="form-field"><label htmlFor="servicio">Servicio que necesitas *</label><select id="servicio" name="servicio" required defaultValue=""><option value="" disabled>Selecciona una opción</option>{services.map(s=><option key={s.slug} value={s.title}>{s.title}</option>)}<option value="No estoy seguro">Necesito asesoría</option></select></div><div className="form-field"><label htmlFor="presupuesto">Presupuesto estimado</label><select id="presupuesto" name="presupuesto" defaultValue=""><option value="">Prefiero conversar</option><option value="Menos de USD 500">Menos de USD 500</option><option value="USD 500–1.500">USD 500–1.500</option><option value="USD 1.500–5.000">USD 1.500–5.000</option><option value="Más de USD 5.000">Más de USD 5.000</option></select></div></div>
  <div className="form-field"><label htmlFor="proyecto">Cuéntanos sobre tu proyecto *</label><textarea id="proyecto" name="proyecto" required minLength={15} maxLength={3000} placeholder="¿Qué deseas crear? ¿Qué problema debe resolver?"/></div>
  <button className="button button-primary" type="submit">Preparar solicitud por WhatsApp <ArrowUpRight size={17}/></button><p className="form-note">Al continuar se abrirá WhatsApp con el mensaje preparado. Revisa el contenido y pulsa enviar allí. Este formulario no almacena tus datos ni envía correos automáticamente.</p>
 </form>;
}
