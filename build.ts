// deno run --allow-read --allow-env --allow-write build.ts

import { copySync } from 'https://deno.land/std@0.153.0/fs/copy.ts';

import { getLiquidEngine } from './config.ts';

const engine = getLiquidEngine();

const currentDirectory = Deno.cwd();

const siteFolder = `${currentDirectory}/site`;
const assetFolder = `${currentDirectory}/assets`;

// Remove site folder if exists
if (await exists(siteFolder)) {
	Deno.removeSync(siteFolder, { recursive: true });
}

// Copy assets into site folder
copySync(assetFolder, `${siteFolder}/assets`);

const pages = Deno.readDirSync('./pages');
// Render pages
for (const page of pages) {
	if (page.isFile) {
		console.log('name: ' + page.name);
		const text = await engine.renderFile(page.name);
		Deno.writeTextFile(`${siteFolder}/${page.name}`, text);
	}
}

export async function exists(filePath: string) {
	try {
		await Deno.lstat(filePath);
		return true;
	} catch (err) {
		if (err instanceof Deno.errors.NotFound) {
			return false;
		}

		throw err;
	}
}
