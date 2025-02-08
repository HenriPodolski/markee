import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from "path"

export default defineConfig({
    plugins: [
      preact()
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    define: {
        'process.env': {
            ...process.env,
            IS_PREACT: 'true',
            NODE_ENV: process.env.NODE_ENV || 'development',
            APP_VERSION: JSON.stringify(process.env.npm_package_version),
        }
    },
    esbuild: {
        supported: {
            'top-level-await': true //browsers can handle top-level-await features
        },
    }
})
