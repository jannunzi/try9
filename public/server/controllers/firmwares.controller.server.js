const {UPLOAD_PATH, FIRMWARE_PATH, SCHEMAS_PATH, UPLOADS_PATH, UNPACKED_PATH} = require('../common/paths')

const fs = require('fs-extra')
const utils = require('../common/utils')
const homedir = require('os').homedir();
const firmwareService = require('../services/firmware.service.server')
const settingsService = require('../services/settings.service.server')

module.exports = (app, upload) => {

    const findFirmwareDetails = (req, res) =>
        firmwareService.readDetailedFirmwareList(
          details => res.send(details))

    const downloadFirmware = (req, res) =>
        res.sendFile(`${homedir}/mks/configurator/downloads/${req.params.firmware}`, () => {
            utils.cleanFolders()
        })

    const findFirmwareList = (req, res) =>
        res.send(firmwareService.readFirmwareList())

    const deleteFirmware = (req, res) => {
        const firmwareName = req.params.firmwareName
        fs.removeSync(`${homedir}/mks/configurator/uploads/${firmwareName}`)
        fs.removeSync(`${homedir}/mks/configurator/unpacked/${firmwareName}`)
        utils.cleanFolders()
        const settings = settingsService.loadSettings()
        delete settings.firmwares[firmwareName]
        settingsService.saveSettings(settings)

        res.sendStatus(200)
    }

    const packageFirmware = (req, res) => {
        if(req.params.firmware.endsWith('.zcz')) {
            // firmwareService.downloadFirmware(req.params.firmware)
            firmwareService.repackageZczFile(req.params.firmware)
              .then(() => res.sendStatus(200))
        } else if(req.params.firmware.endsWith('.aes')) {
            firmwareService.downloadAes2(req.params.firmware, () => {
                res.sendStatus(200)
            })
        }
    }

    const uploadPath = (req, res) => {
        const ESCAPED_PATH = req.params.path.replace("C:", "")
        const ORIGINAL_PATH = process.platform === 'win32' ?
          ESCAPED_PATH.replace(/\+/g, '\\') : ESCAPED_PATH.replace(/\+/g, '\/')

        const NOW = Date.now()
        const TIME_STAMP_FILE = `__IGNORE__${NOW}.txt`

        fs.ensureDirSync(`${UPLOADS_PATH}/${ESCAPED_PATH}`)
        fs.ensureDirSync(`${UNPACKED_PATH}/${ESCAPED_PATH}`)
        fs.ensureDirSync(`${UNPACKED_PATH}/${ESCAPED_PATH}/Schemas`)

        utils.removeTimestampFiles(`${ORIGINAL_PATH}`)
        utils.removeTimestampFiles(`${UNPACKED_PATH}/${ESCAPED_PATH}/Schemas`)
        fs.writeFileSync(`${ORIGINAL_PATH}/${TIME_STAMP_FILE}`, NOW)
        fs.writeFileSync(`${UNPACKED_PATH}/${ESCAPED_PATH}/Schemas/${TIME_STAMP_FILE}`, NOW)

        res.send(req.params.path)
    }

    const uploadFirmware = (req, res, next) => {
        upload(req, res, function (err, ddd) {
            let firmwareName = 'UNDEFINED'

            const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/upload`)
            firmwareName = filesInTmp[0]

            if(fs.existsSync(`${homedir}/mks/configurator/uploads/${firmwareName}`)) {
                fs.removeSync(`${homedir}/mks/configurator/uploads/${firmwareName}`)
                fs.removeSync(`${homedir}/mks/configurator/unpacked/${firmwareName}`)
            }

            fs.moveSync(
                `${homedir}/mks/configurator/upload/${firmwareName}`,
                `${homedir}/mks/configurator/uploads/${firmwareName}`,
              { overwrite: true })

            fs.emptyDirSync(UPLOAD_PATH)

            fs.removeSync(`${homedir}/mks/configurator/upload/${firmwareName}`)
            if(firmwareName.endsWith('zcz')) {
                // firmwareService.uploadFirmware(firmwareName);
                firmwareService.unpackZczFile(firmwareName)
                utils.cleanFolders()
                return res.sendStatus(200)
            } else if(firmwareName.endsWith('aes')) {
                //jga
                firmwareService.unpackAesFile(firmwareName, () => {
                    utils.cleanFolders()
                    return res.sendStatus(200)
                })
            }
        })
    }

    app.delete('/api/firmwares/:firmwareName', deleteFirmware)
    app.get('/api/firmwares/:firmware/package', packageFirmware)
    app.get('/api/firmwares/details', findFirmwareDetails)
    app.get('/api/firmwares/:firmware', downloadFirmware)
    app.get('/api/firmwares', findFirmwareList)
    app.post('/api/firmwares', upload, uploadFirmware)
    app.post('/api/folders/:path', uploadPath)

}
