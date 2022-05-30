import _ from 'lodash'
import MD5 from 'md5'
import FsExtra from 'fs-extra'

function getHashByChunks (path = '', opts = {}) {
  const fd = FsExtra.openSync(path, 'r')
  const fstat = FsExtra.fstatSync(fd)

  const chunks = opts.chunks || []
  const chunksBuf = _
    .chain(chunks)
    .map(chunk => {
      const bufOffset = +chunk.offset || 0
      const bufLimit = +chunk.limit || 40960
      const bufSize = Math.max(Math.min(bufLimit, fstat.size - bufOffset), 0)
      const buf = Buffer.alloc(bufSize)
      FsExtra.readSync(fd, buf, 0, bufSize, bufOffset)

      return buf
    })
    .value()
  const mergedBuf = Buffer.concat(chunksBuf)
  FsExtra.closeSync(fd)
  const md5 = MD5(mergedBuf)

  return md5
}

function getHashChunkPlots (opts = {}) {
  let plots = []
  const name = opts.name || []

  if (name === 'single plot') {
    const offset = opts.offset
    const limit = opts.limit
    plots.push({ offset, limit })
  } else if (name === 'distribution plots') {
    const path = opts.file
    const chunks = opts.chunks
    const offset = opts.offset
    const limit = opts.limit
    const fd = FsExtra.openSync(path, 'r')
    const fstat = FsExtra.fstatSync(fd)
    const fsize = fstat.size

    plots = _.map(_.times(10), v => {
      const plotStart = Math.floor(v * fsize / chunks)
      const plotOffset = plotStart + offset

      return { offset: plotOffset, limit }
    })
    FsExtra.closeSync(fd)
  }

  return plots
}

export default {
  getHashByChunks,
  getHashChunkPlots
}
