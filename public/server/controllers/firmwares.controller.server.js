const fs = require('fs-extra')
const utils = require('../common/utils')
const homedir = require('os').homedir();
const firmwareService = require('../services/firmware.service.server')

module.exports = (app, upload) => {

    app.get('/api/firmwares/details', (req, res) => {
        firmwareService.readDetailedFirmwareList(
          details => res.send(details)
        )
    })

    app.get('/api/firmwares/:firmware', (req, res) =>
      res.sendFile(`${homedir}/mks/configurator/downloads/${req.params.firmware}`))

    app.get('/api/firmwares', (req, res) =>
        res.send(firmwareService.readFirmwareList()))

    app.delete('/api/firmwares/:firmwareName', function (req, res) {

        const firmwareName = req.params.firmwareName
        fs.removeSync(`${homedir}/mks/configurator/uploads/${firmwareName}`)
        fs.removeSync(`${homedir}/mks/configurator/unpacked/${firmwareName}`)

        res.sendStatus(200)
    })

    app.get('/api/firmwares/:firmware/package', (req, res) => {
        if(req.params.firmware.endsWith('.zcz')) {
            // firmwareService.downloadFirmware(req.params.firmware)
            firmwareService.repackageZczFile(req.params.firmware)
              .then(() => res.sendStatus(200))
        } else if(req.params.firmware.endsWith('.zip.aes')) {
            firmwareService.downloadAes(req.params.firmware)
        }
    })

    app.post('/api/firmwares', upload, function (req, res, next) {
        console.log('post firmware')

        // fs.emptyDirSync(`${homedir}/mks/configurator/downloads`)
        // fs.emptyDirSync(`${homedir}/mks/configurator/tmp`)

        upload(req, res, function (err, ddd) {

            let firmwareName = 'UNDEFINED'

            const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/upload`)
            firmwareName = filesInTmp[0]
            fs.moveSync(
                `${homedir}/mks/configurator/upload/${firmwareName}`,
                `${homedir}/mks/configurator/uploads/${firmwareName}`)

            fs.removeSync(`${homedir}/mks/configurator/upload/${firmwareName}`)

            // utils.copyFilesRecursively(
            //   `${homedir}/mks/configurator/uploads`,
            //   `${homedir}/mks/configurator/firmwares`)
            //   .then(() => {
                  // fs.emptyDirSync(`${homedir}/mks/configurator/uploads`)

                  // create directories for configurations and schemas
                  // utils.createDirectory(`${homedir}/mks/configurator/configurations/${firmwareName}`)
                  // utils.createDirectory(`${homedir}/mks/configurator/schemas/${firmwareName}`)

                  // if (err) {
                  //     return res.end(err)
                  // } else {
                      if(firmwareName.endsWith('zcz')) {
                          // firmwareService.uploadFirmware(firmwareName);
                          firmwareService.unpackZczFile(firmwareName)
                          return res.sendStatus(200)
                      } else if(firmwareName.endsWith('aes')) {
                          firmwareService.uploadAes(firmwareName)
                          return res.sendStatus(200)
                      }
                  // }
              // })
              // .catch(e => console.log(e))
        })
    })
}
