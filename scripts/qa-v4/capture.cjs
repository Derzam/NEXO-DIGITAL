const {chromium}=require('@playwright/test'),fs=require('fs');
const routes=['/','/servicios',...['landing-pages','sitios-corporativos','sistemas-web','aplicaciones-moviles','inteligencia-artificial','automatizacion','auditoria-qa','seo','integraciones'].map(s=>'/servicios/'+s),'/soluciones','/portafolio','/nosotros','/blog','/contacto','/no-existe'];
(async()=>{
 const [out,selection]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
 const selected=selection?routes.filter(r=>selection.split(',').includes(r)):routes;
 const browser=await chromium.launch();const results=[];
 try {
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:width===768?1024:900},reducedMotion:'reduce'});
  for(const route of selected){
   const response=await page.goto('http://127.0.0.1:3120'+route);await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));await page.evaluate(()=>scrollTo(0,0));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const name=route==='/'?'home':route.slice(1).replaceAll('/','-');
   await page.screenshot({path:`${out}/${name}-${width}-fold.png`});await page.screenshot({path:`${out}/${name}-${width}-full.png`,fullPage:true});
   const containerFrames=await page.locator('.proposal-container').evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();const left=r.left,right=innerWidth-r.right;return {left,right,width:r.width,balanced:Math.abs(left-right)<=1};}));
   results.push({route,width,status:response.status(),height:await page.evaluate(()=>document.documentElement.scrollHeight),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),containerFrames});
   console.log(width,route,response.status());
  }
  await page.close();
 }
 } finally { await browser.close(); }
 fs.writeFileSync(`${out}/capture-results.json`,JSON.stringify(results,null,2));
 if(results.some(r=>r.overflow||r.status!==(r.route==='/no-existe'?404:200)||r.containerFrames.some(f=>!f.balanced)))process.exitCode=1;
})();
