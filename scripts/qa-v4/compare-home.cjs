const fs=require('fs'),sharp=require('sharp');
(async()=>{
 const out=process.argv[2],checks=[];
 for(const width of [390,768,1440])for(const kind of ['fold','full']){
  const name=`home-${width}-${kind}.png`;
  const a=await sharp(`docs/qa-v4/before/${name}`).ensureAlpha().raw().toBuffer({resolveWithObject:true}),b=await sharp(`${out}/${name}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const sameDimensions=a.info.width===b.info.width&&a.info.height===b.info.height;let changedPixels=null;
  if(sameDimensions){changedPixels=0;for(let i=0;i<a.data.length;i+=4)if(a.data.subarray(i,i+4).some((v,j)=>v!==b.data[i+j]))changedPixels++;}
  checks.push({width,kind,sameDimensions,changedPixels,pass:sameDimensions&&changedPixels===0});
 }
 fs.writeFileSync(`${out}/home-comparison.json`,JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));if(checks.some(c=>!c.pass))process.exitCode=1;
})();
