const homedir = require('os').homedir();

const CONFIGURATOR_PATH = `${homedir}/mks/configurator`
const TMP_PATH = `${CONFIGURATOR_PATH}/tmp`
const UNPACKED_PATH = `${CONFIGURATOR_PATH}/unpacked`
const UPLOAD_PATH = `${CONFIGURATOR_PATH}/upload`
const UPLOADS_PATH = `${CONFIGURATOR_PATH}/uploads`
const DOWNLOADS_PATH = `${CONFIGURATOR_PATH}/downloads`
const FIRMWARE_PATH = (firmwareName) => `${UNPACKED_PATH}/${firmwareName}`
const CONFIGS_PATH = (firmwareName) => {
  if(firmwareName.endsWith('zcz')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Configs`
  } else if(firmwareName.endsWith('aes')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Configs/Permanent`
  } else {
    return firmwareName.replace(/:/g, '/')
  }
}
const SCHEMAS_PATH = (firmwareName) => {
  if(firmwareName.endsWith('zcz')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Schema`
  } else if(firmwareName.endsWith('aes')) {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Schemas`
  } else {
    return `${homedir}/mks/configurator/unpacked/${firmwareName}/Schemas`//firmwareName.replace(/:/g, '/')
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
