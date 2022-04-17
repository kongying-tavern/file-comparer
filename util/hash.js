import MD5 from 'md5'
import FsExtra from 'fs-extra'

function getHash(path = '', opts = {}) {
    let offset = +opts.offset | 50
    let limit = +opts.limit | 102400
    let fd = FsExtra.openSync(path, 'r')
    let buf = Buffer.alloc(limit);
    FsExtra.readSync(fd, buf, 0, limit, offset)
    FsExtra.closeSync(fd)
    let md5 = MD5(buf)

    return md5
}

export default {
    getHash
}
