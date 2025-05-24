import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const httpsOptions =
    process.env.NODE_ENV !== 'production'
        ? {
              key: fs.readFileSync(join(__dirname, 'certs/key.pem')),
              cert: fs.readFileSync(join(__dirname, 'certs/cert.pem')),
          }
        : undefined;

const fastify = Fastify({
    logger: true,
    ...(httpsOptions && { https: httpsOptions }),
});

fastify.register(FastifyStatic, {
    root: join(__dirname, '../dist'),
    prefix: '/',
});

fastify.setNotFoundHandler((request, reply) => {
    if (request.raw.url && request.raw.url.startsWith('/dist/')) {
        reply.code(404).send('Not Found');
    } else {
        reply.sendFile('index.html');
    }
});

if (httpsOptions) {
    console.log(
        'HTTPS is enabled in development mode using certificates from the certs directory.'
    );
}

const start = async () => {
    try {
        await fastify.listen({ port: 3200, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
