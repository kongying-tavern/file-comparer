import PQueue from 'p-queue'

function createQueue (opts = {}) {
  return new PQueue(opts)
}

export default {
  createQueue
}
