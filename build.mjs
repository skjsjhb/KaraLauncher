import { build as esbuild } from 'esbuild';
import tomlPlugin from 'esbuild-plugin-toml';
import yamlPlugin from 'esbuild-plugin-yaml';
import { copy } from 'fs-extra';
import os from 'node:os';

await Promise.all([
    esbuild({
        entryPoints: ['src/main/Main.ts'],
        bundle: true,
        minify: process.env.NODE_ENV === 'production',
        platform: 'node',
        outfile: 'build/main.js',
        plugins: [yamlPlugin.yamlPlugin({}), tomlPlugin()],
        external: ['kara']

    }),
    copy('node_modules/kara/dist/client.js', 'build/client.js'),
    os.platform() === 'win32' ?
        copy('node_modules/kara/build/karac.exe', 'build/karac.exe') :
        copy('node_modules/kara/build/karac', 'build/karac'),
    copy('resources', 'build')
]);