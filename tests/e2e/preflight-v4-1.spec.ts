import { expect, test } from "@playwright/test";

test("quotation fails safely without JavaScript and explains the WhatsApp handoff", async ({ browser, page }, testInfo) => {
  const offlineClient = await browser.newContext({
    baseURL: String(testInfo.project.use.baseURL),
    viewport: page.viewportSize()!,
    javaScriptEnabled: false,
  });
  const requestsWithQuery: string[] = [];
  offlineClient.on("request", request => {
    const url = new URL(request.url());
    if (url.pathname === "/contacto" && url.search) requestsWithQuery.push(url.pathname + url.search);
  });
  try {
    const noJsPage = await offlineClient.newPage();
    await noJsPage.goto("/contacto");
    // Playwright's enabled-state matcher covers controls, not the fieldset itself.
    // Check the native attribute, then verify its effect on every descendant control.
    await expect(noJsPage.getByRole("group", { name: "Datos de cotización" })).toHaveAttribute("disabled", "");
    for (const name of ["Nombre completo", "Correo electrónico", "Servicio que necesitas", "Presupuesto estimado", "Cuéntanos sobre tu proyecto"]) {
      await expect(noJsPage.getByLabel(name)).toBeDisabled();
    }
    await expect(noJsPage.getByRole("button", { name: "Preparar solicitud por WhatsApp" })).toBeDisabled();
    const fallback = noJsPage.getByRole("link", { name: "conversa directamente por WhatsApp" });
    await expect(fallback).toBeVisible();
    const url = new URL((await fallback.getAttribute("href"))!);
    expect(url.origin + url.pathname).toBe("https://wa.me/593984447960");
    expect(url.searchParams.get("text")).toBe("Hola, quiero información sobre los servicios de Nexo Digital Studio.");
    await expect(fallback).toHaveAttribute("rel", "noopener noreferrer");
    await offlineClient.route("https://wa.me/**", route => route.fulfill({ status: 200, body: "Synthetic QA handoff; no message sent" }));
    const popupPromise = noJsPage.waitForEvent("popup");
    await fallback.click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(popup.url()).toBe(url.href);
    expect(requestsWithQuery).toEqual([]);
    await testInfo.attach("no-js-security", { body: JSON.stringify({ disabled: true, requestsWithQuery, fallback: url.href }), contentType: "application/json" });
  } finally {
    await offlineClient.close();
  }

  await page.goto("/contacto");
  await expect(page.getByRole("group", { name: "Datos de cotización" })).not.toHaveAttribute("disabled");
  await expect(page.getByLabel("Nombre completo")).toBeEnabled();
  await expect(page.getByText("Al continuar, compartirás los datos del mensaje con WhatsApp mediante el enlace.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "conversa directamente por WhatsApp" })).not.toBeVisible();
});
