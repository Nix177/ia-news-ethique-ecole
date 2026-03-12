import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
  const reactDom = require('react-dom');
  console.log('React-DOM found:', reactDom.version || 'unknown version');
  const reactDomClient = require('react-dom/client');
  console.log('React-DOM/client found');
} catch (e) {
  console.error('Resolution failed:', e.message);
}
