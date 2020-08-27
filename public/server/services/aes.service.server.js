const fs = require('fs-extra')
const homedir = require('os').homedir()
const utils = require('../common/utils')
const gunzip = require('gunzip-file')

// TODO: move all constants to a single file
const openSslEncryptionCmd = (inputFile, outputFile) => `openssl aes-256-cbc    -salt -md md5 -k n0v1n@ -in ${inputFile} -out ${outputFile}`
const openSslDecryptionCmd = (inputFile, outputFile) => `openssl aes-256-cbc -d -salt -md md5 -k n0v1n@ -in ${inputFile} -out ${outputFile}`

const openSslEncrypt = (inputFile, outputFile, callback) => {
  const CMD = openSslEncryptionCmd(inputFile, outputFile)
  utils.execShellCommandCallback(CMD, callback)
}

const openSslDecrypt = (inputFile, outputFile, callback) => {
  const CMD = openSslDecryptionCmd(inputFile, outputFile)
  utils.execShellCommandCallback(CMD, callback)
}

const packageAes = (sourceFolderPath, callback) => {

  const sourceParentDirectory = sourceFolderPath.split('/').slice(0, -1).join('/')
  const sourceFolderName = sourceFolderPath.split('/').slice(-1)[0]

  return utils.tarNgzip(
    sourceParentDirectory,
    sourceFolderName,
    `${sourceParentDirectory}/${sourceFolderName}.tar.gz`)
    .then(() => {
      openSslEncrypt(
        `${sourceParentDirectory}/${sourceFolderName}.tar.gz`,
        `${sourceParentDirectory}/${sourceFolderName}.tar.gz.aes`)
      if(typeof callback === 'function')
        callback()
    }
  )
}

const unpackAes = (sourceAesFilePath) => {
  fs.emptyDirSync(`${homedir}/mks/configurator/downloads`)
  fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)

  const targetParentDirectory = sourceAesFilePath.split('/').slice(0, -1).join('/')
  const sourceFileName = sourceAesFilePath.split('/').slice(-1)[0]
  const gzFileName = sourceFileName.replace('.tar.gz.aes', '.tar.gz')
  const tarFileName = gzFileName.replace('.tar.gz', '.tar')
  const targetFolder = tarFileName.replace('.tar', '')

  openSslDecrypt(
    `${sourceAesFilePath}`,
    `${targetParentDirectory}/${gzFileName}`)

  gunzip(
    `${targetParentDirectory}/${gzFileName}`,
    `${targetParentDirectory}/${tarFileName}`,
    () => utils.untar2(
      `${targetParentDirectory}/${tarFileName}`,
      `${targetParentDirectory}`)
      .then(() => {
        fs.removeSync(`${targetParentDirectory}/${gzFileName}`)
        fs.removeSync(`${targetParentDirectory}/${tarFileName}`)
        fs.moveSync(
          `${targetParentDirectory}/${targetFolder}`,
          `${homedir}/mks/configurator/unpacked/${targetFolder}`)
        fs.renameSync(
          `${homedir}/mks/configurator/unpacked/${targetFolder}`,
          `${homedir}/mks/configurator/unpacked/${sourceFileName}`)

        const now = Date.now()
        const timeStampFile = `__IGNORE__${now}.txt`

        fs.writeFileSync(`${homedir}/mks/configurator/unpacked/${sourceFileName}/Configs/Permanent/${timeStampFile}`, now)
        fs.writeFileSync(`${homedir}/mks/configurator/unpacked/${sourceFileName}/Schemas/${timeStampFile}`, now)

      })
  )
}

module.exports = {
  unpackAes, packageAes
}
