import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        
    ],
    build: {
        format: 'es',
        outDir: 'dist',
        lib: {
            entry: resolve(__dirname, 'main.js'),
            name: "Radius",
            type: "module",
        },
        sourcemap: true,
        target: 'esnext'
        /* lib: {
            entry: resolve(__dirname, 'main.js'),
            name: 'Radius',
            // the proper extensions will be added
            fileName: 'radius.min.js',
            type: 'module'
        },
        rollupOptions: {
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                format: 'esm',
                sourcemap: false,
                // entryFileNames: `[name].js`,
                entryFileNames: `radius.min.js`,
                chunkFileNames: `[name].js`,
                // assetFileNames: `assets/[name].[ext]`,
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'index.css') return 'bundled.css';
                    return assetInfo.name;
                },
                plugins: [],
            },
        }, */
        /* rollupOptions: {
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                format: 'esm',
                sourcemap: false,
                // entryFileNames: `[name].js`,
                entryFileNames: `radius.min.js`,
                chunkFileNames: `[name].js`,
                // assetFileNames: `assets/[name].[ext]`,
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'index.css') return 'bundled.css';
                    return assetInfo.name;
                },
                plugins: [],
            },
        }, */
    }
})