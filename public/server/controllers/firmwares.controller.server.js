const fs = require('fs')
const utils = require('../common/utils')

module.exports = (app, upload) => {

    app.get('/api/firmwares', function (req, res) {
        const savedConfigFiles = fs.readdirSync(`public/server/firmwares`)
        res.send(savedConfigFiles)
    })

    app.delete('/api/firmwares/:firmwareName', function (req, res) {
        const firmwareName = req.params.firmwareName
        fs.unlinkSync(`public/server/firmwares/${firmwareName}`)
        fs.rmdir(`public/server/configurations/${firmwareName}`, {recursive: true}, (err) => {
            console.log(err)
        })
        res.send(200)
    })

    app.post('/api/firmwares/:firmwareName/untar', function (req, res) {
        const firmwareName = req.params.firmwareName

        if (fs.existsSync(`public/server/configurations/${firmwareName}`)){
            res.send(200)
            return
        }
        utils.removeFilesRecursively('server/tmp/*')
        utils.createDirectory(`public/server/configurations/${firmwareName}`)
        utils.untar(
            `public/server/firmwares/${firmwareName}`,
            `public/server/tmp`)
        fs.readdir(`public/server/tmp`, (err, filesInTmp) => {
            const configTarGz = `public/server/tmp/${filesInTmp[0]}/Configs.tar.gz`
            utils.untar(configTarGz, `public/server/configurations/${firmwareName}`)
            utils.removeFilesRecursively(`public/server/tmp/*`)
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

        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        // console.log(req.file)
        // console.log(req.body)
        // res.redirect('/configurations')
        res.send(200)
    })
}
