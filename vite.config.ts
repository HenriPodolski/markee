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
            IS_PREACT: 'true',
            NODE_ENV: process.env.NODE_ENV || 'development',
        }
    }
})
