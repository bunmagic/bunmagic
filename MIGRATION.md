# Migrating from Implicit to Explicit Imports

Starting with bunmagic v1.3.0, implicit globals are deprecated in favor of explicit imports. This change improves code clarity, helps LLMs understand your code better, and makes dependencies more explicit.

## What's Changing?

Previously, bunmagic scripts could use globals without importing them:

```typescript
// Old way - implicit globals (now shows deprecation warnings)
#!/usr/bin/env bunmagic

const files = await $`ls -la`.text();
console.log(ansis.green('Files listed!'));
```

Now you have two options:

### Option 1: Import All Globals (Quick Scripts)
For quick scripts and prototypes, you can explicitly opt-in to all globals with a single import:

```typescript
#!/usr/bin/env bunmagic
import "bunmagic/globals";

// All globals available, no deprecation warnings
const files = await $`ls -la`.text();
console.log(ansis.green('Files listed!'));
```

### Option 2: Import Only What You Need (Recommended)
For production code and better maintainability, import only what you need:

```typescript
#!/usr/bin/env bunmagic
import { $, ansis } from 'bunmagic';

const files = await $`ls -la`.text();
console.log(ansis.green('Files listed!'));
```

## Migration Steps

### 1. Choose Your Import Style

**For quick scripts**, add this single line:
```typescript
import "bunmagic/globals";
```

**For production code**, import only what you need:
```typescript
import { $, ansis, path, args, flags } from 'bunmagic';
```

### 2. Common Import Patterns

Here are the most commonly used imports:

```typescript
// Shell execution
import { $ } from 'bunmagic';

// CLI arguments
import { args, flags, argv } from 'bunmagic';

// User interaction
import { ack, ask, select, getPassword } from 'bunmagic';

// Filesystem utilities
import { isDirectory, ensureDirectory, glob, resolveTilde } from 'bunmagic';

// Terminal styling
import { ansis } from 'bunmagic';
// or if you prefer chalk API
import { chalk } from 'bunmagic';

// Path operations
import { path, cd, cwd } from 'bunmagic';

// Other utilities
import { $spinner, openEditor, slugify, copyToClipboard } from 'bunmagic';
```

### 3. Handling Deprecation Warnings

When you run scripts with implicit globals (no import statement), you'll see deprecation warnings:

```
bunmagic: Implicit globals are deprecated. Please use explicit imports instead.
  For quick scripts, add: import "bunmagic/globals";
  For production code, import only what you need.
  Use: import { $ } from 'bunmagic';
```

To temporarily disable warnings (not recommended for new code):

```bash
export BUNMAGIC_DISABLE_DEPRECATION_WARNINGS=true
```

## Backward Compatibility

Your existing scripts will continue to work! The deprecation warnings are informational only. However, we recommend updating your scripts to use explicit imports for better maintainability.

## Using the `bunmagic` Namespace

If you need to access all globals without deprecation warnings during migration, use the `bunmagic` namespace:

```typescript
#!/usr/bin/env bunmagic

// Access globals via bunmagic namespace (no warnings)
const files = await bunmagic.$`ls -la`.text();
console.log(bunmagic.ansis.green('Files listed!'));
```

## Benefits of Explicit Imports

1. **Better IDE Support**: Your editor knows exactly what's available
2. **LLM-Friendly**: AI assistants can better understand and help with your code
3. **Tree-Shaking**: Bundlers can optimize better with explicit imports
4. **Self-Documenting**: Clear dependencies at the top of each file
5. **Type Safety**: Better TypeScript inference and checking

## Full API Reference

All globals are available for explicit import from the main `bunmagic` module:

```typescript
import {
  // Shell & Process
  $,              // Bun's shell API
  $HOME,          // User home directory
  cwd,            // Current working directory
  cd,             // Change directory
  
  // CLI Arguments
  args,           // Non-flag arguments array
  flags,          // Flag arguments object
  argv,           // Combined arguments
  
  // User Interaction
  ack,            // Yes/no prompts
  ask,            // Text input
  select,         // Selection menu
  autoselect,     // Select with flag override
  getPassword,    // Password input
  
  // Filesystem
  isDirectory,    // Check if path is directory
  ensureDirectory,// Create directory with parents
  resolveTilde,   // Expand ~ in paths
  glob,           // File pattern matching
  SAF,            // Safe file handling
  
  // Utilities
  ansis,          // Terminal styling (also available as 'chalk')
  chalk,          // Alias for ansis
  path,           // Node.js path module
  os,             // Node.js os module
  Exit,           // Clean exit class
  die,            // Quick error exit
  $get,           // Run command and get output
  $spinner,       // Loading spinners
  openEditor,     // Open in editor
  slugify,        // URL-safe strings
  copyToClipboard,// Copy to clipboard
  notMinimist,    // Argument parser
} from 'bunmagic';
```