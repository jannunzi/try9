const fs = require('fs')
const homedir = require('os').homedir();

const readFirmwareList = () =>
  fs.readdirSync(`${homedir}/mks/configurator/firmwares`)
    .filter(firmwareFileName => firmwareFileName !== '.DS_Store')

module.exports = {
  readFirmwareList
}
