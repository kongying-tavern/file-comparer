import Yargs from 'yargs'

function getArgv () {
  const argv = Yargs(process.argv)
    .option('lhs', {
      alias: 'l',
      type: 'string',
      description: 'left-hand-side directory',
      required: true
    })
    .option('lhs-queue', {
      alias: 'p',
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
      alias: 'q',
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
    .option('queue-number', {
      alias: 'n',
      type: 'number',
      default: 10,
      description: 'queue number'
    })
    .argv

  return argv
}

export default {
  getArgv
}
