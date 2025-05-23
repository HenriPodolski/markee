import Fastify from 'fastify';
import FastifyStatic from '@fastify/static';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
    logger: true,
});

fastify.register(FastifyStatic, {
    root: join(__dirname, '../dist'),
    constraints: {
        // eslint-disable-next-line no-undef
        ...(process.env.NODE_ENV === 'production' && {
            host: 'markee-notes.com',
        }),
    },
});

const start = async () => {
    try {
        await fastify.listen({ port: 3200 });
    } catch (err) {
        fastify.log.error(err);
        // eslint-disable-next-line no-undef
        process.exit(1);
    }
};

start();
