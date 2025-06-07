import { Columns } from '@lib/columns';
import ansis from 'ansis';
import type { Script } from './script';

export function displayScriptInfo(columns: Columns, script: Script) {
	let description = script.desc || '';
	if (script.alias.length > 0) {
		description += ` ${ansis.dim(`(alias: ${script.alias.join(', ')})`)}`;
	}

	columns.log([ansis.bold(script.slug), description]);

	if (script.usage?.name) {
		columns.log([`  ${ansis.dim(script.usage.name)}`, script.usage.description || '']);
	}

	if (script.meta) {
		for (const meta of Object.values(script.meta)) {
			for (const { name, description } of meta) {
				columns.log([`  ${ansis.dim(name)}`, ansis.dim(description)]);
			}
		}
	}
}

export function setupScriptColumns() {
	const columns = new Columns(2);
	columns.gap = 5;
	columns.buffer();
	return columns;
}
