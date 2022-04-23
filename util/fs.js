import FsExtra from 'fs-extra'

function writeFile (file, content) {
  if (!file) {
    return
  }

  FsExtra.outputFileSync(file, content, 'utf-8')
}

function writeJson (file, content) {
  if (!file) {
    return
  }

  FsExtra.outputJsonSync(file, content, 'utf-8')
}

export default {
  writeFile,
  writeJson
}
