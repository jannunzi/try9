const fs = require('fs')
const utils = require('../common/utils')
const homedir = require('os').homedir();

module.exports = (app, upload) => {

    app.get('/api/firmwares', function (req, res) {
        // const savedConfigFiles = fs.readdirSync(`${homedir}/tmp/mks/configurator/firmwares`)
        const savedConfigFiles = fs.readdirSync(`${homedir}/tmp/mks/configurator/firmwares`)
        res.send(savedConfigFiles)
    })

    app.delete('/api/firmwares/:firmwareName', function (req, res) {
        const firmwareName = req.params.firmwareName
        fs.unlinkSync(`${homedir}/tmp/mks/configurator/firmwares/${firmwareName}`)
        fs.rmdir(`${homedir}/tmp/mks/configurator/configurations/${firmwareName}`, {recursive: true}, (err) => {
            console.log(err)
        })
        res.send(200)
    })

    app.post('/api/firmwares/:firmwareName/untar', function (req, res) {
        const firmwareName = req.params.firmwareName

        if (fs.existsSync(`${homedir}/tmp/mks/configurator/configurations/${firmwareName}`)){
            res.send(200)
            return
        }
        utils.removeFilesRecursively('server/tmp/*')
        utils.createDirectory(`${homedir}/tmp/mks/configurator/configurations/${firmwareName}`)
        utils.untar(
            `${homedir}/tmp/mks/configurator/firmwares/${firmwareName}`,
            `${homedir}/tmp/mks/configurator/tmp`)
        fs.readdir(`${homedir}/tmp/mks/configurator/tmp`, (err, filesInTmp) => {
            const configTarGz = `${homedir}/tmp/mks/configurator/tmp/${filesInTmp[0]}/Configs.tar.gz`
            utils.untar(configTarGz, `${homedir}/tmp/mks/configurator/configurations/${firmwareName}`)
            utils.removeFilesRecursively(`${homedir}/tmp/mks/configurator/tmp/*`)
            res.send(configTarGz)
        })
    })

    app.post('/api/firmwares', upload, function (req, res, next) {

        upload(req, res, function (err) {
            console.log(req.file)
            console.log(req.body)
            //deal with the error(s)
            if (err) {
                // An error occurred when uploading
                return res.end(err)
            } else {

                return res.end('File Upload Success');
            }
        })

        res.send(200)
    })
}
