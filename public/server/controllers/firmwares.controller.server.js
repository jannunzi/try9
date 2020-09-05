const {UPLOAD_PATH, FIRMWARE_PATH, SCHEMAS_PATH, UPLOADS_PATH, UNPACKED_PATH} = require('../common/paths')

const fs = require('fs-extra')
const utils = require('../common/utils')
const homedir = require('os').homedir();
const firmwareService = require('../services/firmware.service.server')
const settingsService = require('../services/settings.service.server')

module.exports = (app, upload) => {

    app.get('/api/firmwares/details', (req, res) => {
        firmwareService.readDetailedFirmwareList(
          details => res.send(details)
        )
    })

    app.get('/api/firmwares/:firmware', (req, res) => {
        res.sendFile(`${homedir}/mks/configurator/downloads/${req.params.firmware}`, () => {
            utils.cleanFolders()
        })
    })

    app.get('/api/firmwares', (req, res) => {
        res.send(firmwareService.readFirmwareList())
    })

    app.delete('/api/firmwares/:firmwareName', function (req, res) {
        const firmwareName = req.params.firmwareName
        fs.removeSync(`${homedir}/mks/configurator/uploads/${firmwareName}`)
        fs.removeSync(`${homedir}/mks/configurator/unpacked/${firmwareName}`)
        utils.cleanFolders()
        const settings = settingsService.loadSettings()
        delete settings.firmwares[firmwareName]
        settingsService.saveSettings(settings)

        res.sendStatus(200)
    })

    app.get('/api/firmwares/:firmware/package', (req, res) => {
        if(req.params.firmware.endsWith('.zcz')) {
            // firmwareService.downloadFirmware(req.params.firmware)
            firmwareService.repackageZczFile(req.params.firmware)
              .then(() => res.sendStatus(200))
        } else if(req.params.firmware.endsWith('.aes')) {
            firmwareService.downloadAes2(req.params.firmware, () => {
                res.sendStatus(200)
            })
        }
    })

    app.post('/api/folders/:path', (req, res) => {
        const path = req.params.path

        fs.ensureDirSync(`${UPLOADS_PATH}/TMP_FOLDER`)
        fs.renameSync(
          `${UPLOADS_PATH}/TMP_FOLDER`,
          `${UPLOADS_PATH}/${path}`)

        fs.ensureDirSync(`${UNPACKED_PATH}/TMP_FOLDER`)
        fs.ensureDirSync(`${UNPACKED_PATH}/TMP_FOLDER/Schemas`)
        fs.renameSync(
          `${UNPACKED_PATH}/TMP_FOLDER`,
          `${UNPACKED_PATH}/${path}`)

        res.send(req.params.path)
    })

    app.post('/api/firmwares', upload, (req, res, next) => {

        upload(req, res, function (err, ddd) {
            let firmwareName = 'UNDEFINED'

            const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/upload`)
            firmwareName = filesInTmp[0]
            fs.moveSync(
                `${homedir}/mks/configurator/upload/${firmwareName}`,
                `${homedir}/mks/configurator/uploads/${firmwareName}`)

            fs.emptyDirSync(UPLOAD_PATH)

            fs.removeSync(`${homedir}/mks/configurator/upload/${firmwareName}`)
            if(firmwareName.endsWith('zcz')) {
                // firmwareService.uploadFirmware(firmwareName);
                firmwareService.unpackZczFile(firmwareName)
                utils.cleanFolders()
                return res.sendStatus(200)
            } else if(firmwareName.endsWith('aes')) {
                firmwareService.unpackAesFile(firmwareName)
                utils.cleanFolders()
                return res.sendStatus(200)
            }
        })
    })
}
