// Simple Node.js starter script that bypasses NODE_ENV issues on Windows
process.env.NODE_ENV = 'development';
import('./server/index.ts');