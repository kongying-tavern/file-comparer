import Path from 'path'
import { globby as Globby } from 'globby'

function resolve(...args) {
    return Path.resolve(...args)
}

function relative(base = '', path = '') {
    return Path.relative(base, path)
}

async function glob(pattern = '') {
    pattern = pattern || ''
    pattern = pattern.replace(/\\/g, '/')

    return Globby(pattern)
}

export default {
    resolve,
    relative,
    glob
}
