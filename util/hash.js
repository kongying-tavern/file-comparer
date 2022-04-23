import _ from 'lodash'
import MD5 from 'md5'
import FsExtra from 'fs-extra'

function getHash (path = '', opts = {}) {
  const offset = +opts.offset
  const offsetVal = _.isFinite(offset) ? offset : 0
  const limit = +opts.limit
  const limitVal = _.isFinite(limit) ? limit : 102400
  const fd = FsExtra.openSync(path, 'r')
  const fstat = FsExtra.fstatSync(fd)
  const bufSize = fstat.size - offsetVal > limitVal ? limitVal : fstat.size - offsetVal
  const buf = Buffer.alloc(bufSize)
  FsExtra.readSync(fd, buf, 0, bufSize, offsetVal)
  FsExtra.closeSync(fd)
  const md5 = MD5(buf)

  return md5
}

export default {
  getHash
}
