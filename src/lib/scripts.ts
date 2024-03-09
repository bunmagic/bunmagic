import { parseHeader } from '@lib/parse-file-meta';
import { SUPPORTED_FILES } from '@lib/config';
import { Script } from '@lib/script';

async function describeScript(source: string, namespace?: string): Promise<Script | false> {
	const meta = await parseHeader.fromFile(source);
	return new Script({
		namespace,
		source,
		alias: meta?.alias,
		usage: meta?.usage,
		desc: meta?.description,
	});
}

export async function getPathScripts(target: string, namespace?: string): Promise<Map<string, Script >> {
	const glob = new Bun.Glob(`*.{${SUPPORTED_FILES.join(',')}}`);
	const scripts = new Map<string, Script>();
	const descriptions: Promise<Script | false>[] = [];
	for await (const fileName of glob.scan({ onlyFiles: true, absolute: false, cwd: target })) {
		if (fileName.startsWith('_')) {
			if (argv.debug) {
				console.log(`Ignoring: ${fileName}`);
			}

			continue;
		}

		descriptions.push(describeScript(path.join(target, fileName), namespace));
	}

	for await (const script of descriptions) {
		if (!script) {
			continue;
		}

		if (scripts.has(script.slug)) {
			console.warn(`Warning: Duplicate command slug '${script.slug}' detected. Skipping.`);
		} else {
			scripts.set(script.slug, script);
		}

		for (const alias of script.alias) {
			if (scripts.has(alias)) {
				console.warn(`Warning: Alias '${alias}' conflicts with an existing command or alias. Skipping.`);
			} else {
				scripts.set(alias, script);
			}
		}
	}



	return scripts;
}
