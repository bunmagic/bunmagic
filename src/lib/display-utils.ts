import { Columns } from '@lib/columns';
import ansis from 'ansis';
import type { Script } from './script';

export function formatScriptDescription(script: Script): string {
	const extras: string[] = [];
	const aliasList = Array.from(new Set(script.alias));
	const globalList = Array.from(new Set(script.globalAliases));
	if (aliasList.length > 0) {
		extras.push(`alias: ${aliasList.join(', ')}`);
	}
	if (globalList.length > 0) {
		extras.push(`global: ${globalList.join(', ')}`);
	}

	const extraText = extras.length > 0 ? ansis.dim(`(${extras.join('; ')})`) : '';
	if (!script.desc) {
		return extraText;
	}
	if (!extraText) {
		return script.desc;
	}
	return `${script.desc} ${extraText}`;
}

export function displayScriptInfo(columns: Columns, script: Script, displaySlug?: string) {
	const description = formatScriptDescription(script);

	const slug = displaySlug ?? script.slug;
	columns.log([ansis.bold(slug), description]);

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
