const fs = require('fs')
const utils = require('../common/utils')
const homedir = require('os').homedir();
const firmwareService = require('../services/firmware.service.server')

module.exports = (app, upload) => {

    app.get('/api/firmwares/:firmware', (req, res) =>
      res.sendFile(`${homedir}/mks/configurator/downloads/${req.params.firmware}`))

    app.get('/api/firmwares', (req, res) =>
        res.send(firmwareService.readFirmwareList()))

    app.delete('/api/firmwares/:firmwareName', function (req, res) {

        const firmwareName = req.params.firmwareName
        fs.unlinkSync(`${homedir}/mks/configurator/firmwares/${firmwareName}`)
        utils.removeFilesRecursively(`${homedir}/mks/configurator/configurations/${firmwareName}`)
        utils.removeFilesRecursively(`${homedir}/mks/configurator/schemas/${firmwareName}`)

        res.send(200)
    })

    // app.post('/api/firmwares/:firmwareName/untar', function (req, res) {
    //
    //     // TODO: make sure folders already exist: configurations, schemas, firmwares ... etc ...
    //
    //     console.log('UNTAR')
    //     const firmwareName = req.params.firmwareName
    //     console.log(firmwareName)
    //
    //     // if (fs.existsSync(`${homedir}/mks/configurator/configurations/${firmwareName}`)){
    //     //     res.send(200)
    //     //     return
    //     // }
    //     console.log(`Removing files from tmp ${homedir}/mks/configurator/tmp/*`)
    //     utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)
    //     console.log(`Creating directory: ${homedir}/mks/configurator/configurations/${firmwareName}`)
    //     // create directories for configurations and schemas
    //     utils.createDirectory(`${homedir}/mks/configurator/configurations/${firmwareName}`)
    //     // utils.createDirectory(`${homedir}/mks/configurator/schemas/${firmwareName}`)
    //
    //     // untar the zcz file into tmp
    //     utils.untar(
    //         `${homedir}/mks/configurator/firmwares/${firmwareName}`,
    //         `${homedir}/mks/configurator/tmp`)
    //
    //     //
    //     fs.readdirSync(`${homedir}/mks/configurator/tmp`, (err, filesInTmp) => {
    //         console.error(err)
    //         console.log(filesInTmp)
    //         const configTarGz = `${homedir}/mks/configurator/tmp/${filesInTmp[0]}/Configs.tar.gz`
    //         utils.untar(configTarGz, `${homedir}/mks/configurator/configurations/${firmwareName}`)
    //
    //         // const schemaTarGz = `${homedir}/mks/configurator/tmp/${filesInTmp[0]}/Schema.tar.gz`
    //         // utils.untar(schemaTarGz, `${homedir}/mks/configurator/schemas/${firmwareName}`)
    //
    //         // utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)
    //
    //         res.sendStatus(200)
    //     })
    // })

    app.get('/api/firmwares/:firmware/package', (req, res) => {
        firmwareService.downloadFirmware(req.params.firmware)
        res.sendStatus(200)
    })

    app.post('/api/firmwares', upload, function (req, res, next) {
        console.log('post firmware')
        upload(req, res, function (err, ddd) {

            let firmwareName = 'UNDEFINED'

            const filesInTmp = utils.readDirectoryContent(`${homedir}/mks/configurator/uploads`)
            firmwareName = filesInTmp[0]
            utils.copyFilesRecursively(`${homedir}/mks/configurator/uploads/*`, `${homedir}/mks/configurator/firmwares`)
            utils.removeFilesRecursively(`${homedir}/mks/configurator/uploads/*`)
            //deal with the error(s)
            if (err) {
                // An error occurred when uploading
                return res.end(err)
            } else {

                // TODO: make sure folders already exist: configurations, schemas, firmwares ... etc ...

                // if (fs.existsSync(`${homedir}/mks/configurator/configurations/${firmwareName}`)){
                //     res.send(200)
                //     return
                // }
                console.log(`Removing files from tmp ${homedir}/mks/configurator/tmp/*`)
                utils.removeFilesRecursively(`${homedir}/mks/configurator/tmp/*`)
                console.log(`Creating directory: ${homedir}/mks/configurator/configurations/${firmwareName}`)
                // create directories for configurations and schemas
                utils.createDirectory(`${homedir}/mks/configurator/configurations/${firmwareName}`)
                utils.createDirectory(`${homedir}/mks/configurator/schemas/${firmwareName}`)

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

                res.sendStatus(200)
            }
        })
    })
}
