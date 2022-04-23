import _ from 'lodash'
import Progress from 'progress'

function createProgressbar (opts = {}) {
  const tpl = opts.template || ':bar :current/:total'
  const optsDefault = {
    complete: '█',
    incomplete: '░'
  }
  const options = _.defaultsDeep({}, opts, optsDefault)

  return new Progress(tpl, options)
}

export default {
  createProgressbar
}
