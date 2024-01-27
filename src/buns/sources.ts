import { PATHS, get, update } from "./config";


type Script = {
	slug: string;
	bin: string;
	file: string;
	filename: string;
	directory: string;
}

export function scriptInfo(file: string): Script {
	const slug = path.parse(file).name;
	const filename = path.parse(file).base;
	const bin = `${PATHS.bins}/${slug}`;
	const directory = path.dirname(file);
	return {
		slug,
		bin,
		file,
		filename,
		directory
	};
}



export async function binfo(): Promise<Script[]> {
	return (await getScriptSources()).map(scriptInfo)
}


export async function search(slug: string): Promise<Script | undefined> {
	const bins = await binfo();
	return bins.find(bin => bin.slug === slug);

}


export async function getScripts(directory: string) {
	return await globby(`${directory}/*.mjs`);
}


export async function getScriptSources() {
	const sources = [...getSourceDirectories()];
	const scripts = await Promise.all(sources.map(getScripts))
	return scripts.flat();
}


export function getSourceDirectories(): Set<string> {

	const sources = get("sources");
	if (!sources) {
		return new Set([]);
	}

	return new Set(sources.filter(Boolean));
}


export async function addSourceDirectory(pathToAdd: string | false = false) {

	const sources = await getSourceDirectories();
	const defaultSource = `${PATHS.bunshell}/default`;

	if (pathToAdd === false) {
		const sourcePath = `Enter full path to source directory:\n${chalk.gray(
			`Default: ${defaultSource}`
		)}\n> `;
		pathToAdd = (await prompt(sourcePath)) || defaultSource;
	}

	pathToAdd = path.resolve(pathToAdd);
	sources.add(pathToAdd);
	fs.ensureDirSync(pathToAdd)

	update("sources", [...sources]);
}