import { Liquid } from 'https://esm.sh/liquidjs@9.41.0';

export function getLiquidEngine() {
	const currentDirectory = Deno.cwd();
	const layoutPath = `${currentDirectory}/layouts/`;
	const includePath = `${currentDirectory}/includes/`;
	const pagePath = `${currentDirectory}/pages/`;

	return new Liquid({
		root: [layoutPath, includePath, pagePath],
		extname: '.html'
	});
}
