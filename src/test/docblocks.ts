/**
 * List n8n workflows
 * @autohelp
 * @usage n8 list [options]
 * @flag -a, --active Show only active workflows
 * @flag -l, --limit <n> Number of workflows to show (default: 10)
 * @flag -j, --json Output full JSON response
 * @example n8 list
 * @example n8 list --active --limit 20
 * @example n8 list -a -l 5
 */
console.log('test');
console.log('The first argument is: ', args[0]);
console.log('The flag is: ', flags.flag);
