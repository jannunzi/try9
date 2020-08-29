const utils = require('../common/utils')

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

module.exports = {
  openSslDecrypt, openSslEncrypt
}
