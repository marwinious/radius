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
    }
})