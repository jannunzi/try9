const fs = require('fs')
const homedir = require('os').homedir()
const utils = require('../common/utils')

const readFirmwareList = () =>
  fs.readdirSync(`${homedir}/mks/configurator/firmwares`)
    .filter(firmwareFileName => firmwareFileName !== '.DS_Store')

const readDetailedFirmwareList = (callback) => {
  let details = []
  fs.readdir(`${homedir}/mks/configurator/firmwares`, function(err, files) {
    if (err) {
      console.log("Error getting directory information.")
    } else {
      files.forEach(function(file) {
        if(file !== '.DS_Store') {
          console.log(file)
          const stat = fs.statSync(`${homedir}/mks/configurator/firmwares/${file}`)
          stat.fileName = file
          details.push(stat)
        }
      })
      callback(details)
    }
  })
}

const decryptAndUnzipAes = (aesFileName) => {
  const AES_FILE = `${homedir}/mks/configurator/firmwares/${aesFileName}`
  let   ZIP_FILE = `${homedir}/mks/configurator/tmp/${aesFileName}`
  ZIP_FILE = ZIP_FILE.replace('.zip.aes', '.zip')
  let   UNZIPPED_FILE = ZIP_FILE.replace('.zip', '')
  utils.openSslDecrypt(AES_FILE, ZIP_FILE)
  utils.unzip(ZIP_FILE, UNZIPPED_FILE)
}

const uploadAes = (firmwareName) => {
  let ZIP_FILE = `${homedir}/mks/configurator/tmp/${firmwareName}`
  ZIP_FILE = ZIP_FILE.replace('.zip.aes', '.zip')
  let UNZIPPED_FILE = ZIP_FILE.replace('.zip', '')

  // decrypt AES file and unzip
  decryptAndUnzipAes(firmwareName)

  utils.copyFilesRecursively(
    `${UNZIPPED_FILE}/Configs/Permanent/*`,
    `${homedir}/mks/configurator/configurations/${firmwareName}`)
  utils.copyFilesRecursively(
    `${UNZIPPED_FILE}/Schemas/*`,
    `${homedir}/mks/configurator/schemas/${firmwareName}`)
  utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)
}

const downloadAes = (firmwareName) => {
  // TODO: add timestamp
  const FIRMWARE_NAME_ZIP = firmwareName.replace('.aes', '')
  const FIRMWARE_NAME = FIRMWARE_NAME_ZIP.replace('.zip', '')

  let ZIP_FILE = `${homedir}/mks/configurator/tmp/${firmwareName}`
  ZIP_FILE = ZIP_FILE.replace('.zip.aes', '.zip')
  let UNZIPPED_FILE = ZIP_FILE.replace('.zip', '')

  // decrypt AES file and unzip
  decryptAndUnzipAes(firmwareName)

  utils.copyFilesRecursively(
    `${homedir}/mks/configurator/configurations/${firmwareName}/*`,
    `${UNZIPPED_FILE}/Configs/Permanent/`)
  utils.copyFilesRecursively(
    `${homedir}/mks/configurator/schemas/${firmwareName}/*`,
    `${UNZIPPED_FILE}/Schemas/`)


  // const ZIP = 'cd /Users/jannunzi/mks/configurator/tmp/TEST2 && zip -r /Users/jannunzi/mks/configurator/downloads/TEST2.zip *'
  // const ZIP = 'cd INPUT_FOLDER && zip -r OUTPUT_ZIP *'

  utils.zip(
    `${homedir}/mks/configurator/tmp/${FIRMWARE_NAME}`,
    `${homedir}/mks/configurator/downloads/${FIRMWARE_NAME_ZIP}`)
  utils.openSslEncrypt(`${homedir}/mks/configurator/downloads/${FIRMWARE_NAME_ZIP}`, `${homedir}/mks/configurator/downloads/${firmwareName}`)

}

const uploadFirmware = (firmwareName) => {

    // TODO: make sure folders already exist: configurations, schemas, firmwares ... etc ...

    // untar the zcz file into tmp
    utils.untar(
      `${homedir}/mks/configurator/firmwares/${firmwareName}`,
      `${homedir}/mks/configurator/tmp`)

    const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/tmp`)

    const configTarGz = `${homedir}/mks/configurator/tmp/${filesInTmp[0]}/Configs.tar.gz`
    utils.untar(configTarGz, `${homedir}/mks/configurator/configurations/${firmwareName}`)

    const schemaTarGz = `${homedir}/mks/configurator/tmp/${filesInTmp[0]}/Schema.tar.gz`
    if (fs.existsSync(schemaTarGz)){
      utils.untar(schemaTarGz, `${homedir}/mks/configurator/schemas/${firmwareName}`)
    }

    utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)

}

const downloadFirmware = (firmware) => {
  // TODO: add timestamp
  // TODO: handle errors
  // Clean up directories TODO: move this to a function
  // TODO: all this works if Node has file permissions

  utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)
  utils.removeFilesRecursively(`${homedir}/mks/configurator/downloads/*`)
  utils.removeFilesRecursively(`${homedir}/mks/configurator/uploads/*`)

  utils.untar(
    `${homedir}/mks/configurator/firmwares/${firmware}`,
    `${homedir}/mks/configurator/tmp`)
  // utils.copyFilesRecursively(`${homedir}/mks/configurator/firmwares/${firmware}`, `${homedir}/mks/configurator/downloads/${firmware}`)
  const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/tmp`)
  const temporaryFolder = filesInTmp[0]
  // remove old Config
  utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/${temporaryFolder}/Configs.tar.gz`)
  // remove old Schema
  utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/${temporaryFolder}/Schema.tar.gz`)
  // package new Config
  utils.tar(
    `${homedir}/mks/configurator/configurations/${firmware}`,
    `${homedir}/mks/configurator/tmp/${temporaryFolder}/Configs.tar.gz`
  )
  // package new Schema
  utils.tar(
    `${homedir}/mks/configurator/schemas/${firmware}`,
    `${homedir}/mks/configurator/tmp/${temporaryFolder}/Schema.tar.gz`
  )
  // package the Whole thing into downloads
  utils.tar(
    `${homedir}/mks/configurator/tmp`,
    `${homedir}/mks/configurator/downloads/${firmware}`
  )
  // clean up tmp folder
  utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)
}

module.exports = {
  readDetailedFirmwareList,
  readFirmwareList,
  downloadFirmware,
  uploadFirmware,
  downloadAes,
  uploadAes
}
