import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        preact(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Markee Notes',
                short_name: 'Markee',
                description: 'A modern markdown note-taking app.',
                start_url: '.',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#2563eb',
                icons: [
                    {
                        src: '/markee.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                    },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: ({ request }) =>
                            request.destination === 'document' ||
                            request.destination === 'script' ||
                            request.destination === 'style' ||
                            request.destination === 'image' ||
                            request.destination === 'font',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'markee-runtime-cache',
                            expiration: {
                                maxEntries: 200,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                            },
                        },
                    },
                ],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
            },
        }),
    ],
    css: {
        postcss: './postcss.config.js',
    },
    resolve: {
        alias: {
            react: 'preact/compat',
            'react-dom/client': 'preact/compat/client',
            'react-dom': 'preact/compat',
            '@': resolve(__dirname, './src'),
        },
    },
    define: {
        'process.env': {
            IS_PREACT: 'true',
            NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
            APP_VERSION: JSON.stringify(process.env.npm_package_version),
            FEATURE_FLAGS:
                process.env.NODE_ENV === 'development'
                    ? JSON.stringify({
                          tools: true,
                          exports: true,
                          docs: true,
                      })
                    : JSON.stringify({
                          tools: false,
                          exports: false,
                          docs: false,
                      }),
        },
    },
    esbuild: {
        supported: {
            'top-level-await': true, //browsers can handle top-level-await features
        },
    },
});
