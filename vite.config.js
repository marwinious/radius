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
            filename: "radius",
            formats: ['es'], // Ensure it is an ES module format
        },
        sourcemap: true,
        target: 'esnext',
        minify: false,
        // minify: terser, // Enable minification using Terser (default minifier)
        rollupOptions: {
            output: {
                // You can further customize how the file is named
                // For example, if you want to ensure it's myModule.js:
                entryFileNames: 'radius_state_manager.js', // Output filename
                chunkFileNames: '[name].js', // Name for any code-split chunks
                assetFileNames: '[name][extname]', // Asset filenames
                // Ensure that minification is applied
                /* plugins: [
                    // Use Terser plugin for minification
                    terser
                ], */
            }
        }
    }
})