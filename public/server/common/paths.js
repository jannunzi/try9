const homedir = require('os').homedir();
const fs = require('fs-extra')

const CONFIGURATOR_PATH = `${homedir}/mks/configurator`
const TMP_PATH = `${CONFIGURATOR_PATH}/tmp`
const UNPACKED_PATH = `${CONFIGURATOR_PATH}/unpacked`
const UPLOAD_PATH = `${CONFIGURATOR_PATH}/upload`
const UPLOADS_PATH = `${CONFIGURATOR_PATH}/uploads`
const DOWNLOADS_PATH = `${CONFIGURATOR_PATH}/downloads`
const FIRMWARE_PATH = (firmwareName) => {
  if(firmwareName.endsWith('zcz')) {
    return `${UNPACKED_PATH}/${firmwareName}`
  } else if(firmwareName.endsWith('aes')) {
    return `${UNPACKED_PATH}/${firmwareName}`
  } else {
    return firmwareName
  }
}
const CONFIGS_PATH = (firmwareName) => {
  if(firmwareName.endsWith('zcz')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Configs`
  } else if(firmwareName.endsWith('aes')) {
    // return `${homedir}/mks/configurator/unpacked/${firmwareName}/Configs/Permanent`
    if(fs.existsSync(`${homedir}/mks/configurator/unpacked/${firmwareName}/Configs/Apply`)) {
      return `${homedir}/mks/configurator/unpacked/${firmwareName}/Configs/Apply`
    } else if(fs.existsSync(`${homedir}/mks/configurator/unpacked/${firmwareName}/Configs/Apply`)) {
      return `${homedir}/mks/configurator/unpacked/${firmwareName}/Configs/Permanent`
    }
  } else {
    return firmwareName.replace(/\+/g,'/')
  }
}
const SCHEMAS_PATH = (firmwareName) => {
  if(firmwareName.endsWith('zcz')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Schema`
  } else if(firmwareName.endsWith('aes')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Schemas`
  } else {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Schemas`
  }
}

module.exports = {
  CONFIGURATOR_PATH,
  TMP_PATH,
  UNPACKED_PATH,
  UPLOAD_PATH,
  UPLOADS_PATH,
  DOWNLOADS_PATH,
  FIRMWARE_PATH,
  CONFIGS_PATH,
  SCHEMAS_PATH
}
