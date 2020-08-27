const homedir = require('os').homedir();

const CONFIGURATOR_PATH = `${homedir}/mks/configurator`
const UNPACKED_PATH = `${CONFIGURATOR_PATH}/unpacked`
const UPLOAD_PATH = `${CONFIGURATOR_PATH}/upload`
const UPLOADS_PATH = `${CONFIGURATOR_PATH}/uploads`
const FIRMWARE_PATH = (firmwareName) => `${UNPACKED_PATH}/${firmwareName}`
const CONFIGS_PATH = (firmwareName) => `${FIRMWARE_PATH(firmwareName)}/${firmwareName.endsWith('zcz')?'Configs':'Configs/Permanent'}`
const SCHEMAS_PATH = (firmwareName) => `${FIRMWARE_PATH(firmwareName)}/${firmwareName.endsWith('zcz')?'Schema':'Schemas'}`

module.exports = {
  CONFIGURATOR_PATH,
  UNPACKED_PATH,
  UPLOAD_PATH,
  UPLOADS_PATH,
  FIRMWARE_PATH,
  CONFIGS_PATH,
  SCHEMAS_PATH
}
