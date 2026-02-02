# Using esbuild with Electron - Setup Guide

## What is esbuild?

esbuild is an extremely fast JavaScript bundler that we use to compile and bundle the Electron TypeScript code. It solves module compatibility issues by:

1. **Bundling TypeScript to JavaScript**: Compiles all `.ts` files to `.js` (or `.cjs`)
2. **Handling imports**: Resolves all `import` statements and bundles dependencies
3. **External dependencies**: Marks `electron` as external so it's not bundled (provided by runtime)
4. **Module format**: Outputs CommonJS format compatible with Electron

## Project Structure

```
UniMark/
├── src/electron/          # Electron source files (TypeScript)
│   ├── main.ts           # Main process
│   ├── preload.ts        # Preload script (IPC bridge)
│   ├── renderer.ts       # Renderer logic
│   ├── renderer.html     # HTML shell
│   └── types.ts          # TypeScript interfaces
├── dist-electron/        # Compiled output (generated)
│   ├── main.cjs          # Bundled main process
│   ├── preload.cjs       # Bundled preload
│   ├── renderer.js       # Bundled renderer (IIFE format)
│   └── renderer.html     # Copied HTML
├── build-electron.mjs    # esbuild build script
└── package.json          # npm scripts and dependencies
```

## Build Configuration

### build-electron.mjs

This script uses esbuild to bundle the Electron code:

**Key Configuration:**
- **Platform**: `node` for main/preload, `browser` for renderer
- **Target**: `node20` for main/preload, `es2020` for renderer
- **Format**: `cjs` (CommonJS) for main/preload, `iife` for renderer
- **External**: `['electron']` - don't bundle Electron, it's provided by runtime
- **Sourcemaps**: Enabled for debugging
- **Output**: `.cjs` extension for main/preload to force CommonJS treatment

### Why .cjs extension?

The root `package.json` has `"type": "module"`, which makes all `.js` files ES modules by default. Using `.cjs` extension forces Node.js to treat the files as CommonJS modules, which is required for Electron's module system.

## npm Scripts

### `npm run electron:build`
Runs the esbuild bundler to compile TypeScript to JavaScript.

```bash
npm run electron:build
```

**What it does:**
1. Bundles `src/electron/main.ts` → `dist-electron/main.cjs`
2. Bundles `src/electron/preload.ts` → `dist-electron/preload.cjs`
3. Bundles `src/electron/renderer.ts` → `dist-electron/renderer.js`
4. Copies `src/electron/renderer.html` → `dist-electron/renderer.html`

### `npm run electron:dev`
Builds the web component, bundles Electron code, and launches the app.

```bash
npm run electron:dev
```

**What it does:**
1. Runs `npm run build` (builds UniMark web component)
2. Runs `npm run electron:build` (bundles Electron code)
3. Runs `electron .` (launches the Electron app)

### `npm run electron:package`
Builds everything and creates distributable packages.

```bash
npm run electron:package
```

**What it does:**
1. Runs `npm run build`
2. Runs `npm run electron:build`
3. Runs `electron-builder` (creates installers for macOS/Windows/Linux)

## Development Workflow

### 1. Make changes to Electron code
Edit files in `src/electron/`:
- `main.ts` - Main process logic
- `preload.ts` - IPC bridge
- `renderer.ts` - Renderer logic
- `renderer.html` - UI structure

### 2. Build and test
```bash
npm run electron:dev
```

This rebuilds everything and launches the app.

### 3. Debug
- Check `dist-electron/` for compiled output
- Sourcemaps (`.map` files) enable debugging TypeScript in DevTools
- Use `console.log()` in main process (shows in terminal)
- Use `console.log()` in renderer (shows in DevTools - View > Toggle Developer Tools)

## Troubleshooting

### Build fails
- Check TypeScript errors in `src/electron/`
- Run `npm run electron:build` separately to see esbuild errors

### App doesn't launch
- Ensure `dist/unimark-element.js` exists (run `npm run build`)
- Check terminal for error messages
- Verify `dist-electron/main.cjs` exists

### Changes not reflected
- esbuild doesn't watch for changes automatically
- You must run `npm run electron:build` after each change
- Or use `npm run electron:dev` which rebuilds everything

### Module not found errors
- Ensure all imports use relative paths (e.g., `'./types.js'` not `'./types'`)
- Check that `electron` is in `package.json` devDependencies

## esbuild vs TypeScript Compiler (tsc)

| Feature | esbuild | tsc |
|---------|---------|-----|
| Speed | ⚡ Extremely fast (10-100x) | 🐌 Slower |
| Bundling | ✅ Built-in | ❌ Requires separate tool |
| Type checking | ❌ No | ✅ Yes |
| Sourcemaps | ✅ Yes | ✅ Yes |
| Watch mode | ✅ Yes | ✅ Yes |

**Why we use esbuild:**
- Faster builds (important for development)
- Handles bundling automatically
- Solves Electron v40 module compatibility issues
- Simpler configuration

**Note:** For production, you might want to run `tsc --noEmit` separately to check types without emitting files.

## File Size Comparison

esbuild produces smaller bundles:
- `main.cjs`: ~7KB (vs ~8.5KB with tsc)
- `preload.cjs`: ~640B (vs ~770B with tsc)

## Advanced Configuration

### Adding watch mode
Modify `build-electron.mjs` to add watch mode:

```javascript
const ctx = await esbuild.context({
  ...commonConfig,
  entryPoints: ['src/electron/main.ts'],
  outfile: 'dist-electron/main.cjs',
});

await ctx.watch();
console.log('Watching for changes...');
```

### Minification
For production builds, enable minification:

```javascript
const commonConfig = {
  // ...
  minify: process.env.NODE_ENV === 'production',
};
```

### Custom plugins
esbuild supports plugins for advanced transformations:

```javascript
import myPlugin from './my-plugin.mjs';

await esbuild.build({
  // ...
  plugins: [myPlugin],
});
```

## Summary

esbuild provides a fast, modern build system for the Electron app that:
- ✅ Compiles TypeScript to JavaScript
- ✅ Bundles dependencies
- ✅ Handles module formats correctly
- ✅ Generates sourcemaps for debugging
- ✅ Works with Electron's security model

The setup is production-ready and follows Electron best practices.
