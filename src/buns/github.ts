
async function fetchJSON(url) {
	const response = await fetch(url)
	return await response.json()
}

export async function version() {
	const latest = await fetchJSON("https://api.github.com/repos/pyronaur/bunshell/releases/latest")
	return latest["tag_name"]
}