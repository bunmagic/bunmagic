# Files API v2 Deprecation Plan

## Decision

Target: `bunmagic@2.0.0`

- Keep `glob()` public and supported.
- Deprecate all other `files.*` utilities in `1.5.x`.
- Remove deprecated `files.*` utilities in `2.0.0`.
- Remove `bunmagic/files` entrypoint in `2.0.0`.

## 1.5.x Actions

- Runtime warnings: one-time warning per deprecated `files.*` utility.
- Type warnings: `@deprecated` on deprecated APIs.
- Docs update: native Bun/Node FS recommended; `glob()` remains supported.
- Internal code refactor: stop relying on deprecated `files.*` wrappers.

## Internal Refactor Rule

Rule: helper stays internal only if used by internal non-test code in more than one place.

### Keep Internal (v2)

- `resolve`
- `pathExists`
- `writeFile`

Reason: reused by multiple internal callsites.

### Remove Entirely (v2)

- `stem`
- `isFile`
- `isDir`
- `ensureDir`
- `ensureFile`
- `emptyDir`
- `readFile`
- `readBytes`
- `outputFile`
- `editFile`
- `copy`
- `move`
- `remove`
- `ensureUniquePath`
- `writeFileSafe`
- `copySafe`
- `moveSafe`

Reason: no sustained internal reuse or superseded by direct native APIs.

## Migration Guidance

Preferred replacements:

- Existence/read/write: `Bun.file(path).exists()/text()/arrayBuffer()` and `Bun.write(...)`
- Directories and movement: `node:fs/promises` (`mkdir`, `cp`, `rename`, `rm`, `stat`, `access`)
- Globbing: keep using `glob()`

## v2 Removal Checklist

- Remove deprecated exports from `src/files.ts` and public barrel exports.
- Remove `./files` from `package.json` `exports`.
- Update docs/examples to remove `bunmagic/files` imports.
- Keep `glob()` available via main/global API.
- Confirm no internal non-test imports remain from deprecated utilities.
