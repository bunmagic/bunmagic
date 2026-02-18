export async function readJsonFile<T = unknown>(filePath: string): Promise<T | undefined> {
	try {
		return (await Bun.file(filePath).json()) as T;
	} catch {
		return undefined;
	}
}
