// deno run --allow-net --allow-read --allow-env dev.ts

import { getLiquidEngine } from './config.ts';
import { serve } from 'https://deno.land/std@0.134.0/http/server.ts';
import * as fileServer from 'https://deno.land/std@0.153.0/http/file_server.ts';

const port = 8080;

const liquidEngine = getLiquidEngine();

async function handler(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const path = url.pathname;

	const extension = path.split('.')[1] ?? 'html';

	if (extension === 'html') {
		// return
		const body = await getFileBasedRoute(path);
		return new Response(new TextEncoder().encode(body), { status: 200 });
	} else {
		console.log({ path });
		// return file path
		return await fileServer.serveFile(request, `./assets/${path}`);
	}
}

async function getFileBasedRoute(pathname: string) {
	const extension = pathname.split('.')[1] ?? 'html';

	// if (extension !== 'html') {
	//     return fileServer.serveFile(pathname)
	// }

	if (pathname === '/' || pathname == '/index.html') {
		return await liquidEngine.renderFile('index', { title: 'First!' });
		// return await Deno.readFile('./pages/index.html');
	} else {
		const route = pathname.split('/');
		try {
			return await liquidEngine.renderFile(`/assets/${route[1]}`, { title: 'First!' });
		} catch {
			console.log(`404: pathname: ${pathname}`);
			return await liquidEngine.renderFile('404', { title: '404 | Page not found.' });
		}
	}
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
