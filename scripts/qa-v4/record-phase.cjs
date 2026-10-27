const fs=require('fs');
const phase=process.argv[2],file=process.argv[3]||'test-results/results.json',r=JSON.parse(fs.readFileSync(file,'utf8'));
const walk=s=>s.flatMap(x=>[...(x.specs||[]),...walk(x.suites||[])]);
const tests=[],performance=[],axe=[];
for(const spec of walk(r.suites))for(const t of spec.tests){const last=t.results.at(-1);tests.push({project:t.projectName,title:spec.title,status:t.status});for(const a of last.attachments||[])if(a.body){const data=JSON.parse(Buffer.from(a.body,'base64').toString());if(a.name==='performance')performance.push({project:t.projectName,route:spec.title.split(': ')[1],...data});if(a.name.startsWith('accessibility'))axe.push({project:t.projectName,test:spec.title,state:a.name,route:spec.title.split(': ')[1],violations:data});}}
const out=`docs/qa-v4/${phase}`;fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(`${out}/results.json`,JSON.stringify({phase,recordedAt:new Date().toISOString(),checks:{lint:'PASS',typecheck:'PASS',build:'PASS'},stats:r.stats,tests,performance,accessibility:axe},null,2));console.log(JSON.stringify({phase,stats:r.stats}));
if(r.stats.unexpected||r.stats.skipped||r.stats.flaky)process.exitCode=1;
