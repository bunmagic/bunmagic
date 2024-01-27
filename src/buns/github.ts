
async function fetchJSON(url: string): Promise<any> {
	const response = await fetch(url)
	return await response.json()
}

export async function version(): Promise<string> {
	const latest = await fetchJSON("https://api.github.com/repos/pyronaur/bunshell/releases/latest")
	return latest["tag_name"]
}