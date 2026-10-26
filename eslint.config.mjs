import nextConfig from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextConfig,
  { ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**', 'qa-artifacts/**'] },
];

export default config;
