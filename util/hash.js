import MD5 from 'md5'
import FsExtra from 'fs-extra'

function getHash (path = '', opts = {}) {
  const offset = +opts.offset || 50
  const limit = +opts.limit || 102400
  const fd = FsExtra.openSync(path, 'r')
  const fstat = FsExtra.fstatSync(fd)
  const bufSize = fstat.size - offset > limit ? limit : fstat.size - offset
  const buf = Buffer.alloc(bufSize)
  FsExtra.readSync(fd, buf, 0, bufSize, offset)
  FsExtra.closeSync(fd)
  const md5 = MD5(buf)

  return md5
}

export default {
  getHash
}
