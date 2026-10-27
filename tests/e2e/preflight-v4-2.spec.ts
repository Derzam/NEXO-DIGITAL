import { expect, test } from "@playwright/test";

test("quotation is disabled before hydration and becomes available afterwards", async ({ page }) => {
  let releaseScripts!: () => void;
  const scriptsReady = new Promise<void>(resolve => { releaseScripts = resolve; });
  const synthetic = { nombre: "QANameSentinel", correo: "qa-sentinel@example.invalid", proyecto: "QAProjectSentinel" };
  const contactQueries: string[] = [];
  const requestsWithSentinels: string[] = [];
  page.on("request", request => {
    const url = new URL(request.url());
    if (url.pathname === "/contacto" && url.search) contactQueries.push(url.search);
    const transport = request.url() + "\n" + (request.postData() ?? "");
    if (Object.values(synthetic).some(value => transport.includes(value) || transport.includes(encodeURIComponent(value)))) {
      requestsWithSentinels.push(url.origin + url.pathname);
    }
  });
  await page.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, async route => {
    await scriptsReady;
    await route.continue();
  });

  try {
    await page.goto("/contacto", { waitUntil: "commit" });
    const fields = page.getByRole("group", { name: "Datos de cotización" });
    await expect(fields).toHaveAttribute("disabled", "");
    await expect(page.getByLabel("Nombre completo")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Preparar solicitud por WhatsApp" })).toBeDisabled();
    // Synthetic values simulate autofill or a script writing to disabled controls.
    await page.evaluate(values => {
      for (const [name, value] of Object.entries(values)) {
        (document.getElementById(name) as HTMLInputElement | HTMLTextAreaElement).value = value;
      }
    }, synthetic);
    const beforeHydration = await page.locator("form").evaluate(form => Array.from(new FormData(form as HTMLFormElement).entries()));
    expect(beforeHydration).toEqual([]);
    expect(contactQueries).toEqual([]);
    expect(requestsWithSentinels).toEqual([]);
  } finally {
    releaseScripts();
  }

  await page.waitForLoadState("load");
  await expect(page.getByLabel("Nombre completo")).toBeEnabled();
  await expect(page.getByRole("button", { name: "Preparar solicitud por WhatsApp" })).toBeEnabled();
  await page.waitForLoadState("networkidle");
  expect(requestsWithSentinels).toEqual([]);
  // Next can prefetch the current route after hydration using its internal RSC token.
  // No form field, or any other query parameter, may accompany that request.
  for (const query of contactQueries) {
    expect([...new URLSearchParams(query).keys()]).toEqual(["_rsc"]);
  }
});
