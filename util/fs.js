import FsExtra from 'fs-extra';

function readFile(file, encoding) {
    if (!file) {
        return;
    }

    return FsExtra.readFileSync(file, encoding);
}

function writeFile (file, content) {
    if (!file) {
        return;
    }

    FsExtra.outputFileSync(file, content, 'utf-8');
}

function readJson(file) {
    if (!file) {
        return;
    }

    return FsExtra.readJsonSync(file, { throws: false });
}

function writeJson (file, content) {
    if (!file) {
        return;
    }

    FsExtra.outputJsonSync(file, content, 'utf-8');
}

export default {
    readFile,
    writeFile,
    readJson,
    writeJson
};
