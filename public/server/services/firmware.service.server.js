const fs = require('fs-extra')
const homedir = require('os').homedir()
const utils = require('../common/utils')
const aesService = require('../services/aes.service.server')
const settingsService = require('../services/settings.service.server')
const jsonDiff = require('json-diff')

const {
  CONFIGURATOR_PATH,
  UNPACKED_PATH,
  FIRMWARE_PATH,
  CONFIGS_PATH,
  SCHEMAS_PATH} = require('../common/paths')

const readFirmwareList = () =>
  // TODO: use UNPACKED_PATH
  fs.readdirSync(`${homedir}/mks/configurator/unpacked`)
    .filter(file => !file.startsWith('.'))

const readDetailedFirmwareList = (callback) => {
  const settings = settingsService.loadSettings()
  let details = []
  // TODO: use UNPACKED_PATH
  fs.readdir(`${homedir}/mks/configurator/unpacked`, function(err, firmwareFileNames) {
    if (err) {
      console.log("Error getting directory information.")
    } else {
      firmwareFileNames.forEach(function(firmwareFileName) {
        const allowSchemaUpload =
          (settings.firmwares[firmwareFileName] &&
           settings.firmwares[firmwareFileName].allowSchemaUpload === true) ||
          false
        if(!firmwareFileName.startsWith('.')) {
          // TODO: use UNPACKED_PATH
          const stat = fs.statSync(`${homedir}/mks/configurator/unpacked/${firmwareFileName}`)
          stat.fileName = firmwareFileName
          let configurationFileNames = [], schemaFileNames = []
          try {
            const configPath = CONFIGS_PATH(firmwareFileName)
            configurationFileNames = fs.readdirSync(configPath)
              .filter(configurationFileName => configurationFileName.endsWith('.json'))
              .sort((a, b) => a > b)
          } catch (e) {
            // ignore
          }
          try {
            schemaFileNames = fs.readdirSync(SCHEMAS_PATH(firmwareFileName))
              .filter(schemaFileName => schemaFileName.endsWith('.json'))
              .sort((a, b) => a > b)
          } catch (e) {
            // ignore
          }
          stat.configurations = configurationFileNames
          stat.schemas = schemaFileNames
          stat.differences = jsonDiff.diff(configurationFileNames, schemaFileNames)
          stat.allowSchemaUpload = allowSchemaUpload

          if(stat.schemas.length === 0) {
            settings.firmwares[firmwareFileName] = {}
            settings.firmwares[firmwareFileName].allowSchemaUpload = true
            stat.allowSchemaUpload = true
          }
          details.push(stat)
        }
      })
      settingsService.saveSettings(settings)
      callback(details)
    }
  })
}

const decryptAndUnzipAes = (aesFileName) => {
  // TODO: use FIRMWARE_PATH & TMP_PATH
  const AES_FILE = `${homedir}/mks/configurator/firmwares/${aesFileName}`
  let   ZIP_FILE = `${homedir}/mks/configurator/tmp/${aesFileName}`
  ZIP_FILE = ZIP_FILE.replace('.zip.aes', '.zip')
  let   UNZIPPED_FILE = ZIP_FILE.replace('.zip', '')
  utils.openSslDecrypt(AES_FILE, ZIP_FILE)
  utils.unzipAesFile(ZIP_FILE, UNZIPPED_FILE)
}

const uploadAes = (firmwareName) => {
  // TODO: use FIRMWARE_PATH & TMP_PATH
  let ZIP_FILE = `${homedir}/mks/configurator/tmp/${firmwareName}`
  ZIP_FILE = ZIP_FILE.replace('.zip.aes', '.zip')
  let UNZIPPED_FILE = ZIP_FILE.replace('.zip', '')

  // decrypt AES file and unzip
  decryptAndUnzipAes(firmwareName)

  // TODO: use CONFIGURATIONS_PATH, SCHEMAS_PATH, & TMP_PATH
  utils.copyFilesRecursively(
    `${UNZIPPED_FILE}/Configs/Permanent`,
    `${homedir}/mks/configurator/configurations/${firmwareName}`)
    .then(() => utils.copyFilesRecursively(
      `${UNZIPPED_FILE}/Schemas`,
      `${homedir}/mks/configurator/schemas/${firmwareName}`)
    )
    .then(() => fs.emptyDirSync(`${homedir}/mks/configurator/tmp`))
    .catch(e => fs.emptyDirSync(`${homedir}/mks/configurator/tmp`))
}

const downloadAes2 = (firmwareName, callback) => {
  fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)
  fs.emptyDirSync(`${homedir}/mks/configurator/downloads`)

  let modifiedConfigsFileName = firmwareName.replace('.zip.aes', '_modified_configs.zip.aes')

  // copy aes folder to downloads
  fs.copySync(
    `${homedir}/mks/configurator/unpacked/${firmwareName}`,
    `${homedir}/mks/configurator/tmp/${firmwareName}`)
  // copy configurations from Permanent to Temporary
  fs.copySync(
    `${homedir}/mks/configurator/tmp/${firmwareName}/Configs/Permanent`,
    `${homedir}/mks/configurator/tmp/${firmwareName}/Configs/Temporary`)
  aesService.packAes2(
    `${homedir}/mks/configurator/tmp/${firmwareName}`,
    `${homedir}/mks/configurator/downloads/${modifiedConfigsFileName}`)
  if(typeof callback === 'function')
    callback()
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
    `${homedir}/mks/configurator/configurations/${firmwareName}`,
    `${UNZIPPED_FILE}/Configs/Permanent`)
    .then(() => utils.copyFilesRecursively(
      `${homedir}/mks/configurator/schemas/${firmwareName}`,
      `${UNZIPPED_FILE}/Schemas`)
    )
    .then(() => {
      // const ZIP = 'cd /Users/jannunzi/mks/configurator/tmp/TEST2 && zip -r /Users/jannunzi/mks/configurator/downloads/TEST2.zip *'
      // const ZIP = 'cd INPUT_FOLDER && zip -r OUTPUT_ZIP *'
      // fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)
      utils.zipAesFile(
        `${homedir}/mks/configurator/tmp/${FIRMWARE_NAME}`,
        `${homedir}/mks/configurator/downloads/${FIRMWARE_NAME_ZIP}`)
        .then(() =>
          utils.openSslEncrypt(
            `${homedir}/mks/configurator/downloads/${FIRMWARE_NAME_ZIP}`,
            `${homedir}/mks/configurator/downloads/${firmwareName}`)
        )
    })
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

    fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)

}

const downloadFirmware = (firmware) => {
  // TODO: add timestamp
  // TODO: handle errors
  // Clean up directories TODO: move this to a function
  // TODO: all this works if Node has file permissions

  fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)
  fs.emptyDirSync(`${homedir}/mks/configurator/downloads`)
  // fs.emptyDirSync(`${homedir}/mks/configurator/uploads`)

  utils.untar(
    `${homedir}/mks/configurator/firmwares/${firmware}`,
    `${homedir}/mks/configurator/tmp`)
  // utils.copyFilesRecursively(`${homedir}/mks/configurator/firmwares/${firmware}`, `${homedir}/mks/configurator/downloads/${firmware}`)
  const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/tmp`)
  const temporaryFolder = filesInTmp[0]
  // remove old Config
  fs.removeSync(`${homedir}/mks/configurator/tmp/${temporaryFolder}/Configs.tar.gz`)
  // remove old Schema
  fs.removeSync(`${homedir}/mks/configurator/tmp/${temporaryFolder}/Schema.tar.gz`)
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
  fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)
}

const repackageZczFile = (firmware) =>
  utils.repackageZczFile(`${homedir}/mks/configurator`, firmware)

const unpackZczFile = (firmware) =>
  utils.unpackZczFile2(`${homedir}/mks/configurator`, firmware)

const unpackAesFile = (firmwareFileName, callback) => {
  // jga
  aesService.unpackAes2(
    `${homedir}/mks/configurator/uploads/${firmwareFileName}`,
    `${homedir}/mks/configurator/unpacked/${firmwareFileName}`,
    callback)
}

const packAesFile = (firmwareFileName) => {
  aesService.packAes2(`${homedir}/mks/configurator/unpacked/${firmwareFileName}`,
    `${homedir}/mks/configurator/downloads/${firmwareFileName}`)
}

module.exports = {
  readDetailedFirmwareList,
  readFirmwareList,
  downloadFirmware,
  uploadFirmware,
  downloadAes2,
  downloadAes,
  uploadAes,

  unpackZczFile,
  repackageZczFile,

  unpackAesFile,
  packAesFile,
}
