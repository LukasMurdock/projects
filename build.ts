// deno run --allow-read --allow-env build.ts

import { getLiquidEngine } from './config.ts';

const engine = getLiquidEngine();

engine.renderFile('index', { title: 'First!' }).then(console.log);

// engine.parseAndRender('{{name | capitalize}}', { name: 'alice' }).then(console.log); // outputs 'Alice'
