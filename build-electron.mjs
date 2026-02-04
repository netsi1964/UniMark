#!/usr/bin/env node
import * as esbuild from 'esbuild';
import { copyFile, mkdir, access } from 'fs/promises';

/**
 * Build script for Electron app using esbuild
 * 
 * This bundles the main and preload TypeScript files into JavaScript,
 * treating 'electron' as an external dependency (not bundled).
 * This solves the Electron v40 module loading issue.
 */

const commonConfig = {
  bundle: true,
  platform: 'node',
  target: 'node22',
  external: ['electron'], // Don't bundle electron - it's provided by the runtime
  sourcemap: true,
  minify: false, // Keep readable for debugging
};

async function build() {
  console.log('🔨 Building Electron app with esbuild...\n');

  try {
    // Ensure output directory exists
    await mkdir('dist-electron', { recursive: true });

    // Ensure web build exists (fail fast in CI)
    try {
      await access('dist/unimark-element.js');
    } catch {
      throw new Error(
        'Missing dist/unimark-element.js. Run web build before electron build.'
      );
    }

    // Build main process
    console.log('📦 Bundling main process...');
    await esbuild.build({
      ...commonConfig,
      entryPoints: ['src/electron/main.ts'],
      outfile: 'dist-electron/main.cjs',
      format: 'cjs', // CommonJS format for Electron main process
    });
    console.log('✅ Main process bundled\n');

    // Build preload script
    console.log('📦 Bundling preload script...');
    await esbuild.build({
      ...commonConfig,
      entryPoints: ['src/electron/preload.ts'],
      outfile: 'dist-electron/preload.cjs',
      format: 'cjs', // CommonJS format for preload
    });
    console.log('✅ Preload script bundled\n');

    // Build renderer script
    console.log('📦 Bundling renderer script...');
    await esbuild.build({
      ...commonConfig,
      entryPoints: ['src/electron/renderer.ts'],
      outfile: 'dist-electron/renderer.js',
      format: 'iife', // IIFE format for browser context
      platform: 'browser', // Renderer runs in browser context
      target: 'es2022',
    });
    console.log('✅ Renderer script bundled\n');

    // Copy renderer HTML
    console.log('📄 Copying renderer.html...');
    await copyFile('src/electron/renderer.html', 'dist-electron/renderer.html');
    console.log('✅ HTML copied\n');

    // Copy built web component
    console.log('📦 Copying unimark-element.js...');
    await copyFile('dist/unimark-element.js', 'dist-electron/unimark-element.js');
    console.log('✅ Web component copied\n');

    // Create package.json to force CommonJS
    console.log('📝 Creating package.json...');
    const packageJson = {
      type: 'commonjs'
    };
    const { writeFile } = await import('fs/promises');
    await writeFile('dist-electron/package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ package.json created\n');

    console.log('🎉 Build complete! Output in dist-electron/\n');
    console.log('Run with: npm run electron:dev');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
