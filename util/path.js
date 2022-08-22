import Path from 'path';
import Url from 'url';
import { globby as Globby } from 'globby';

function fromUrl (url = {}) {
    return Url.fileURLToPath(url);
}

function toUrl (path = '') {
    return Url.pathToFileURL(path);
}

function resolve (...args) {
    return Path.resolve(...args);
}

function relative (base = '', path = '') {
    return Path.relative(base, path);
}

async function glob (pattern = '') {
    pattern = pattern || '';
    pattern = pattern.replace(/\\/g, '/');

    return Globby(pattern);
}

export default {
    fromUrl,
    toUrl,
    resolve,
    relative,
    glob
};
