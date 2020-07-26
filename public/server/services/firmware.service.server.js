const fs = require('fs')
const homedir = require('os').homedir()
const utils = require('../common/utils')

const readFirmwareList = () =>
  fs.readdirSync(`${homedir}/mks/configurator/firmwares`)
    .filter(firmwareFileName => firmwareFileName !== '.DS_Store')

const downloadFirmware = (firmware) => {
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
  readFirmwareList,
  downloadFirmware
}
