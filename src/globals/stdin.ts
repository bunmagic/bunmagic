/**
 * Read all data from stdin as a string.
 * Useful for piping data into Bunmagic scripts.
 * 
 * @returns Promise that resolves to the complete stdin content as a string
 * 
 * @example
 * ```ts
 * // Read piped input
 * const input = await $stdin()
 * console.log(`Received: ${input}`)
 * ```
 * 
 * @example
 * ```bash
 * # Pipe data into your script
 * echo "Hello, World!" | bunmagic run my-script
 * cat data.txt | bunmagic run process-data
 * ```
 */
export async function $stdin(): Promise<string> {
	let stdin = '';
	for await (const chunk of Bun.stdin.stream()) {
		stdin += Buffer.from(chunk).toString();
	}
	return stdin;
}