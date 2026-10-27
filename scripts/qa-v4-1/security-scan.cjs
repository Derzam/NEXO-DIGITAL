const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const candidates = tracked.filter(file => /\.(?:[cm]?js|tsx?|json|ya?ml|toml|env|md)$/i.test(file) && !file.endsWith('package-lock.json'));
const patterns = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['aws-access-id', /\bAKIA[0-9A-Z]{16}\b/],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/],
  ['stripe-live-key', /\bsk_live_[A-Za-z0-9]{20,}\b/],
  ['openai-key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/],
];
const findings = [];
for (const file of candidates) {
  const content = fs.readFileSync(file, 'utf8');
  for (const [rule, pattern] of patterns) if (pattern.test(content)) findings.push({ file, rule });
}
const source = tracked.filter(file => file.startsWith('src/') && /\.(?:[cm]?js|tsx?)$/i.test(file));
const persistenceApis = [];
for (const file of source) {
  const content = fs.readFileSync(file, 'utf8');
  if (/\b(?:localStorage|sessionStorage|indexedDB)\b/.test(content)) persistenceApis.push(file);
}
const envFiles = tracked.filter(file => /^\.env(?:\.|$)/.test(file));
const report = {
  scannedTrackedTextFiles: candidates.length,
  secretScanRules: patterns.map(([id]) => id),
  findings,
  trackedEnvironmentFiles: envFiles,
  browserPersistenceApiFiles: persistenceApis,
  applicationRequestsApiUse: source.some(file => /\b(?:fetch\s*\(|XMLHttpRequest|sendBeacon\s*\()/.test(fs.readFileSync(file, 'utf8'))),
};
console.log(JSON.stringify(report, null, 2));
if (findings.length) process.exitCode = 1;
