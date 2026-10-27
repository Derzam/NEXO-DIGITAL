const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const snapshots = process.argv.slice(2);
if (snapshots.length !== 2) throw new Error('Pass the V3.1 and V4 snapshot directories.');

function readMapForAsset(root, asset) {
  const jsFile = path.join(root, '.next', asset);
  if (!fs.existsSync(jsFile)) return null;
  const source = fs.readFileSync(jsFile, 'utf8');
  const match = source.match(/sourceMappingURL=([^\s]+)/);
  if (!match) return { asset, sizeBytes: Buffer.byteLength(source), sources: [] };
  const mapFile = path.resolve(path.dirname(jsFile), match[1]);
  if (!mapFile.startsWith(path.resolve(root, '.next') + path.sep) || !fs.existsSync(mapFile)) {
    throw new Error(`Invalid source map reference in ${asset}`);
  }
  const map = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  const sources = [];
  function visit(part) {
    for (const sourcePath of part.sources || []) {
      if (sourcePath.includes('/src/')) sources.push(sourcePath.split('/src/').pop().split('?')[0]);
    }
    for (const section of part.sections || []) visit(section.map);
  }
  visit(map);
  return {
    asset,
    bytes: fs.statSync(jsFile).size,
    gzipBytes: zlib.gzipSync(fs.readFileSync(jsFile)).length,
    sourceMap: path.relative(path.join(root, '.next'), mapFile).replaceAll('\\', '/'),
    sourceCount: sources.length,
    applicationModules: [...new Set(sources)].sort(),
  };
}

function browserApplicationAssets(root) {
  const directory = path.join(root, '.next', 'static', 'chunks');
  const files = [];
  function visit(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const absolute = path.join(folder, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (entry.name.endsWith('.js')) files.push(absolute);
    }
  }
  visit(directory);
  return files.map(absolute => {
    const relative = path.relative(path.join(root, '.next'), absolute).replaceAll('\\', '/');
    return readMapForAsset(root, relative);
  }).filter(asset => asset && asset.applicationModules?.length);
}

const report = snapshots.map((snapshot, index) => {
  const buildRoot = path.resolve(snapshot);
  const manifestPath = path.join(buildRoot, '.next', 'server', 'app', 'page', 'build-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const pageRootFiles = [...manifest.polyfillFiles, ...manifest.rootMainFiles];
  const rootAssets = pageRootFiles.map(asset => readMapForAsset(buildRoot, asset));
  const directory = path.join(buildRoot, '.next', 'server', 'app', 'page');
  const dynamicManifestPath = path.join(directory, 'react-loadable-manifest.json');
  const dynamicManifest = fs.existsSync(dynamicManifestPath)
    ? JSON.parse(fs.readFileSync(dynamicManifestPath, 'utf8'))
    : {};
  const dynamicAssets = [...new Set(Object.values(dynamicManifest).flatMap(entry => entry.files || []))]
    .filter(asset => asset.endsWith('.js'))
    .map(asset => readMapForAsset(buildRoot, asset));
  const applicationAssets = browserApplicationAssets(buildRoot);
  return {
    version: index === 0 ? 'V3.1' : 'V4',
    snapshotRoot: path.relative(process.cwd(), buildRoot).replaceAll('\\', '/'),
    mappingMethod: 'Production client JavaScript sourceMappingURL resolved back to source maps; root boot assets and route dynamic chunks are separated.',
    rootAssets,
    dynamicAssets,
    focusedApplicationAssets: applicationAssets.filter(asset => asset.applicationModules.some(module => /proposal\/(header|interactions|refined-sections)|site-header|contact-form|nexo-wordmark|shadcn\/(sheet|navigation-menu|button)/.test(module))),
    note: 'Byte sizes describe each emitted client asset. Source maps were enabled in isolated audit copies only; sizes and identifiers from those copies are not used as the network baseline.',
  };
});

console.log(JSON.stringify({ method: 'Next.js built-in Turbopack analyze partially ran but terminated with Windows native exit 0xC0000409 before modules.data/history export; source-map attribution is the compatible production-build fallback.', snapshots: report }, null, 2));
