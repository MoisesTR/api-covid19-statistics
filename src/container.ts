import { getExtensionModulesDI } from '@utils/utils';
import { asClass, createContainer, Lifetime } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import { Express } from 'express';
import path from 'path';

const container = createContainer({
    injectionMode: 'CLASSIC',
});

function loadContainer(app: Express): void {
    const extension = getExtensionModulesDI();
    container.loadModules(
        [
            [path.join(__dirname, `services/*${extension}`)],
            [path.join(__dirname, `db/repositories/impl/*${extension}`)],
        ],
        {
            formatName: 'camelCase',
            resolverOptions: {
                // We can give these auto-loaded modules
                // the deal of a lifetime!
                // By default it's `TRANSIENT`.
                lifetime: Lifetime.SCOPED,
                // We can tell Awilix what to register everything as,
                // instead of guessing. If omitted, will inspect the
                // module to determinw what to register as.
                register: asClass,
            },
        },
    );

    app.use(scopePerRequest(container));
}

export { container, loadContainer };
