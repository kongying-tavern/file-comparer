import Yargs from 'yargs';

function getArgv () {
    const argv = Yargs(process.argv)
        .option('lhs', {
            alias: 'l',
            type: 'string',
            description: 'left-hand-side directory',
            required: true
        })
        .option('lhs-queue', {
            alias: 'n',
            type: 'number',
            description: 'left-hand-side queue size',
            default: 10
        })
        .option('rhs', {
            alias: 'r',
            type: 'string',
            description: 'right-hand-side directory',
            required: true
        })
        .option('rhs-queue', {
            alias: 'm',
            type: 'number',
            description: 'right-hand-side queue size',
            default: 10
        })
        .option('output', {
            alias: 'o',
            type: 'string',
            description: 'report output directory',
            required: true
        })
        .argv;

    return argv;
}

export default {
    getArgv
};
