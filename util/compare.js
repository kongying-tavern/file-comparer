import _ from 'lodash';
import StringNaturalCompare from 'string-natural-compare';
import UtilFs from './fs.js';
import UtilPath from './path.js';
import UtilHash from './hash.js';
import UtilProgress from './progress.js';

const currentPath = UtilPath.fromUrl(import.meta.url);

async function getFileSummary(base = '', paths = [], queue = null) {
    const countTotal = paths.length;
    const progress = UtilProgress.createProgressbar({ total: countTotal });
    const summary = [];

    _.each(paths, async path => {
        await queue.add(() => {
            const filename = UtilPath.resolve(base, path);
            const hashChunkConfig = UtilHash.getHashChunkPlots({
                name: 'distribution plots',
                file: filename,
                chunks: 10,
                offset: 0,
                limit: 100 * 1024
            });
            const md5 = UtilHash.getHashByChunks(path, {
                chunks: hashChunkConfig
            });

            const pack = {
                path,
                filename,
                md5
            };

            summary.push(pack);
            progress.tick();
        });
    });

    await queue.onIdle();

    return summary;
}

async function rehashFileSummary(files = [], queue = null) {
    const countTotal = files.length;
    const progress = UtilProgress.createProgressbar({ total: countTotal });
    const summary = [];

    _.each(files, async file => {
        await queue.add(() => {
            const path = file.path;
            const chunkConfig = UtilHash.getHashChunkPlots({
                name: 'distribution plots',
                file: path,
                chunks: 100,
                offset: 0,
                limit: 10 * 1024
            });
            const filename = file.filename;
            const md5 = UtilHash.getHashByChunks(path, {
                chunks: chunkConfig
            });

            const pack = {
                path,
                filename,
                md5
            };

            summary.push(pack);
            progress.tick();
        });
    });

    await queue.onIdle();

    return summary;
}

function getCompareSummary(lhs = [], rhs = []) {
    const lhsMap = _.groupBy(lhs, 'md5');
    const lhsHashes = _.keys(lhsMap);
    const rhsMap = _.groupBy(rhs, 'md5');
    const rhsHashes = _.keys(rhsMap);
    const unionHashes = _.uniq(_.union(lhsHashes, rhsHashes));

    const summary = [];

    _.each(unionHashes, hash => {
        const lhsItem = lhsMap[hash] || [];
        const rhsItem = rhsMap[hash] || [];
        let type = '';

        if (lhsItem.length <= 0 && rhsItem.length > 0) {
            type = 'add';
        } else if (lhsItem.length > 0 && rhsItem.length <= 0) {
            type = 'remove';
        } else {
            type = 'same';
        }

        const pack = {
            hash,
            type,
            lhs: lhsItem,
            rhs: rhsItem
        };

        summary.push(pack);
    });

    return summary;
}

async function revalidateCompareSummary(summary = [], lhsQueue = null, rhsQueue = null) {
    const summaryUnsame = _.filter(summary, v => v.type !== 'same');
    const summarySame = _.filter(summary, v => v.type === 'same');

    const lhs = _.chain(summarySame).map(v => v.lhs || []).flattenDeep().value();
    const lhsRehashed = await rehashFileSummary(lhs, lhsQueue);
    const rhs = _.chain(summarySame).map(v => v.rhs || []).flattenDeep().value();
    const rhsRehashed = await rehashFileSummary(rhs, rhsQueue);
    const summaryRehashed = getCompareSummary(lhsRehashed, rhsRehashed);

    const summaryNew = _.concat([], summaryUnsame, summaryRehashed);

    return summaryNew;
}

function resortCompareSummary(summary = []) {
    return _.map(summary, v => {
        const lhs = _.chain(v.lhs || []).flattenDeep().sortBy((a, b) => a && b && StringNaturalCompare(a.filename, b.filename)).value();
        const rhs = _.chain(v.rhs || []).flattenDeep().sortBy((a, b) => a && b && StringNaturalCompare(a.filename, b.filename)).value();
        v.lhs = lhs;
        v.rhs = rhs;
        return v;
    });
}

function getCompareReport(summary = []) {
    const templatePath = UtilPath.resolve(currentPath, '../../template/compare.summary.vue');
    const template = UtilFs.readFile(templatePath);
    const renderer = _.template(template, {
        interpolate: /\{\{__([\s\S]+?)__\}\}/g
    });

    return renderer({ summary: JSON.stringify(summary) });
}

export default {
    getFileSummary,
    rehashFileSummary,
    getCompareSummary,
    revalidateCompareSummary,
    resortCompareSummary,
    getCompareReport
};
