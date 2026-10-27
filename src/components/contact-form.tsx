"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { Textarea } from "@/components/shadcn/textarea";
import { services, whatsappUrl } from "@/lib/content";

type Errors = Partial<Record<string, string>>;

export function ContactForm() {
  const [preparedUrl, setPreparedUrl] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    for (const field of ["nombre", "proyecto"]) {
      const input = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
      input.value = input.value.trim();
      input.setCustomValidity(input.value.length < (field === "proyecto" ? 15 : 2)
        ? (field === "proyecto" ? "Describe tu proyecto con al menos 15 caracteres sin espacios al inicio o final." : "Ingresa tu nombre con al menos 2 caracteres.")
        : "");
    }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const get = (field: string) => String(data.get(field) || "").trim();
    const message = [
      "Hola, quisiera solicitar una cotización a Nexo Digital Studio.",
      "Nombre: " + get("nombre"), "Correo: " + get("correo"),
      "Servicio: " + get("servicio"), "Proyecto: " + get("proyecto"),
      get("presupuesto") ? "Presupuesto orientativo: " + get("presupuesto") : "",
    ].filter(Boolean).join("\n");
    const url = whatsappUrl(message);
    setPreparedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleInvalid(event: FormEvent<HTMLFormElement>) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) return;
    const message = input.validity.customError ? input.validationMessage
      : input.validity.typeMismatch ? "Ingresa un correo electrónico válido."
      : input.validity.tooShort ? "Describe tu proyecto con al menos 15 caracteres."
      : input.name === "servicio" ? "Selecciona un servicio o solicita asesoría."
      : "Completa este campo.";
    setErrors(current => ({ ...current, [input.name]: message }));
    setPreparedUrl("");
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    const input = event.target;
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
      input.setCustomValidity("");
      setErrors(current => ({ ...current, [input.name]: undefined }));
    }
    setPreparedUrl("");
  }

  const validationProps = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? name + "-error" : undefined,
  });
  const errorMessage = (name: string) => errors[name]
    ? <p id={name + "-error"} className="interior-field-error" role="alert">{errors[name]}</p> : null;

  return <form className="interior-contact-form" onSubmit={handleSubmit} onInput={handleInput} onInvalid={handleInvalid}>
    <p className="interior-note">Los campos con * son obligatorios. El presupuesto es opcional.</p>
    <div className="interior-field-grid">
      <div className="interior-field"><label htmlFor="nombre">Nombre completo *</label><Input id="nombre" name="nombre" autoComplete="name" placeholder="Tu nombre" required maxLength={100} {...validationProps("nombre")} />{errorMessage("nombre")}</div>
      <div className="interior-field"><label htmlFor="correo">Correo electrónico *</label><Input id="correo" name="correo" type="email" autoComplete="email" placeholder="nombre@empresa.com" required maxLength={254} {...validationProps("correo")} />{errorMessage("correo")}</div>
    </div>
    <div className="interior-field-grid">
      <div className="interior-field"><label htmlFor="servicio">Servicio que necesitas *</label>
        <NativeSelect id="servicio" name="servicio" required defaultValue="" {...validationProps("servicio")}><NativeSelectOption value="" disabled>Selecciona una opción</NativeSelectOption>{services.map(s => <NativeSelectOption key={s.slug} value={s.title}>{s.title}</NativeSelectOption>)}<NativeSelectOption value="No estoy seguro">Necesito asesoría</NativeSelectOption></NativeSelect>
        {errorMessage("servicio")}
      </div>
      <div className="interior-field"><label htmlFor="presupuesto">Presupuesto estimado</label>
        <NativeSelect id="presupuesto" name="presupuesto" defaultValue=""><NativeSelectOption value="">Prefiero conversar</NativeSelectOption><NativeSelectOption value="Menos de USD 500">Menos de USD 500</NativeSelectOption><NativeSelectOption value="USD 500–1.500">USD 500–1.500</NativeSelectOption><NativeSelectOption value="USD 1.500–5.000">USD 1.500–5.000</NativeSelectOption><NativeSelectOption value="Más de USD 5.000">Más de USD 5.000</NativeSelectOption></NativeSelect>
      </div>
    </div>
    <div className="interior-field"><label htmlFor="proyecto">Cuéntanos sobre tu proyecto *</label><Textarea id="proyecto" name="proyecto" required minLength={15} maxLength={3000} placeholder="¿Qué deseas crear? ¿Qué problema debe resolver?" {...validationProps("proyecto")} />{errorMessage("proyecto")}</div>
    <Button className="tw:h-auto tw:min-h-13 tw:justify-self-start tw:rounded-full tw:px-5 tw:py-4 tw:text-[16px] tw:whitespace-normal tw:text-left" type="submit">Preparar solicitud por WhatsApp <ArrowUpRight size={18} aria-hidden="true" /></Button>
    {preparedUrl ? <p className="interior-note" role="status">Solicitud preparada. Si WhatsApp no se abrió, <a href={preparedUrl} target="_blank" rel="noopener noreferrer">abrir la solicitud en WhatsApp</a>.</p> : null}
    <p className="interior-note">Al continuar se abrirá WhatsApp con el mensaje preparado. Revisa el contenido y pulsa enviar allí. Este formulario no almacena tus datos ni envía correos automáticamente.</p>
  </form>;
}
