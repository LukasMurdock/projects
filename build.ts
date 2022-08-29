// deno run --allow-read --allow-env --allow-write build.ts

import { copySync } from 'https://deno.land/std@0.153.0/fs/copy.ts';
import { relative } from 'https://deno.land/std@0.153.0/path/win32.ts';

import { getLiquidEngine } from './config.ts';

const engine = getLiquidEngine();
const currentDirectory = Deno.cwd();
const pageDirectory = '/pages';
const siteFolder = `${currentDirectory}/site`;
const assetFolder = `${currentDirectory}/assets`;

// Remove site folder if exists
if (await exists(siteFolder)) {
	Deno.removeSync(siteFolder, { recursive: true });
}

// Copy assets into site folder
copySync(assetFolder, `${siteFolder}`);

// Render pages
render();

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

/**
 * A recursive directory render.
 */
function render(relativeDirectory = pageDirectory) {
	const directoryPath = currentDirectory + relativeDirectory;
	const pages = Deno.readDirSync(directoryPath);

	for (const page of pages) {
		if (page.isFile) {
			const sourcePath = `${directoryPath}/${page.name}`;
			const destinationPath = `${siteFolder + relativeDirectory.replace(pageDirectory, '')}/${
				page.name
			}`;

			console.log(page.name);
			// console.group();
			// console.log(`source: ${sourcePath}`);
			// console.log(`destination: ${destinationPath}`);
			// console.groupEnd();
			engine
				.renderFile(sourcePath, { title: 'Lukas Murdock' })
				.then((text) => Deno.writeTextFile(destinationPath, text));
		} else if (page.isDirectory) {
			// Recursive directory render
			const directoryBuildPath =
				siteFolder + relativeDirectory.replace(pageDirectory, '') + `/${page.name}`;
			const directoryPath = `${relativeDirectory}/${page.name}`;
			Deno.mkdir(directoryBuildPath).then(() => render(directoryPath));
		}
	}
}
