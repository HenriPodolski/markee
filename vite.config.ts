import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [preact()],
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
