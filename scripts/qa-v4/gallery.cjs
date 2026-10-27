const fs = require('node:fs');
const sharp = require('sharp');

// Compose QA screenshots only; no product imagery is modified.
const routes = ['home', 'servicios', ...['landing-pages', 'sitios-corporativos', 'sistemas-web', 'aplicaciones-moviles', 'inteligencia-artificial', 'automatizacion', 'auditoria-qa', 'seo', 'integraciones'].map(s => 'servicios-' + s), 'soluciones', 'portafolio', 'nosotros', 'blog', 'contacto', 'no-existe'];
const root = 'docs/qa-v4';
const after = 'phase-6-final';

(async () => {
  fs.mkdirSync(root + '/comparisons', { recursive: true });
  const rows = [];
  for (const route of routes) {
    const cells = [];
    for (const width of [390, 768, 1440]) {
      const file = route + '-' + width;
      const beforePath = 'before/' + file + '-fold.png';
      const afterPath = after + '/' + file + '-fold.png';
      for (const path of [beforePath, afterPath]) if (!fs.existsSync(root + '/' + path)) throw new Error('Missing capture: ' + path);
      const a = await sharp(root + '/' + beforePath).resize({ width: 480 }).toBuffer();
      const b = await sharp(root + '/' + afterPath).resize({ width: 480 }).toBuffer();
      const height = (await sharp(a).metadata()).height;
      const label = Buffer.from('<svg width="984" height="56"><rect width="984" height="56" fill="#0b1525"/><text x="18" y="33" fill="#e9f3ff" font-family="Arial" font-size="18">V3.1 · ' + route + ' · ' + width + ' px</text><text x="510" y="33" fill="#a8d6ff" font-family="Arial" font-size="18">V4 · ' + route + ' · ' + width + ' px</text></svg>');
      await sharp({ create: { width: 984, height: height + 68, channels: 3, background: '#0b1525' } }).composite([{ input: label, left: 0, top: 0 }, { input: a, left: 0, top: 56 }, { input: b, left: 504, top: 56 }]).jpeg({ quality: 86 }).toFile(root + '/comparisons/' + file + '.jpg');
      cells.push('[Comparar](comparisons/' + file + '.jpg) · [antes](before/' + file + '-full.png) · [después](' + after + '/' + file + '-full.png)');
    }
    rows.push('| ' + route + ' | ' + cells.join(' | ') + ' |');
  }
  fs.writeFileSync(root + '/GALLERY.md', '# Comparación V3.1 → V4\n\nCapturas del build local de producción en 390×844, 768×1024 y 1440×900. Las comparativas muestran el primer viewport; los enlaces antes/después contienen cada página completa. Home se conserva con comparación exacta de píxeles.\n\n[Galería con selector de ruta y tamaño](gallery.html) · [Prueba de Home intacta](phase-6-final/home-comparison.json) · [Geometría y HTTP](phase-6-final/capture-results.json).\n\n| Ruta | 390 px | 768 px | 1440 px |\n| --- | --- | --- | --- |\n' + rows.join('\n') + '\n');
  fs.writeFileSync(root + '/gallery.html', '<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Nexo · Comparación V3.1 / V4</title><style>body{margin:0;padding:24px;background:#070e1c;color:#eef4ff;font:16px/1.6 system-ui}h1{font-size:28px}label{display:inline-block;margin:0 20px 20px 0}select{display:block;min-height:44px;font:inherit;background:#14253d;color:inherit;border:1px solid #8bbaf0;padding:8px}main{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}figure{margin:0;min-width:0}img{display:block;width:100%;height:auto}a{color:#b0daff}figcaption{margin-bottom:14px}@media(max-width:650px){main{grid-template-columns:1fr}}</style><h1>Nexo Digital Studio · V3.1 / V4</h1><p>Antes y después del mismo recorrido. Capturas locales; no es una publicación del sitio.</p><label>Ruta<select id="route">' + routes.map(r => '<option>' + r + '</option>').join('') + '</select></label><label>Ancho<select id="width"><option>390</option><option>768</option><option selected>1440</option></select></label><main><figure><figcaption>V3.1 · Antes · <a id="before-link">Abrir imagen</a></figcaption><img id="before" alt="Página anterior completa"></figure><figure><figcaption>V4 · Después · <a id="after-link">Abrir imagen</a></figcaption><img id="after" alt="Página migrada completa"></figure></main><script>const route=document.getElementById("route"),width=document.getElementById("width");function update(){const file=route.value+"-"+width.value+"-full.png";for(const [id,folder] of [["before","before"],["after","' + after + '"]]){document.getElementById(id).src=folder+"/"+file;document.getElementById(id+"-link").href=folder+"/"+file;}}route.onchange=width.onchange=update;update();</script></html>');
  console.log('Created 51 comparisons and gallery for 17 routes.');
})();
