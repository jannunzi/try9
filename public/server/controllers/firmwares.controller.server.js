const fs = require('fs')
const utils = require('../common/utils')

module.exports = (app, upload) => {

    app.get('/api/firmwares', function (req, res) {
        const savedConfigFiles = fs.readdirSync(`${__dirname}/../firmwares`)
        res.send(savedConfigFiles)
        // res.json(['qwe', 'wer', 'ert', __dirname])
    })

    app.delete('/api/firmwares/:firmwareName', function (req, res) {
        const firmwareName = req.params.firmwareName
        fs.unlinkSync(`${__dirname}/../firmwares/${firmwareName}`)
        fs.rmdir(`${__dirname}/../configurations/${firmwareName}`, {recursive: true}, (err) => {
            console.log(err)
        })
        res.send(200)
    })

    app.post('/api/firmwares/:firmwareName/untar', function (req, res) {
        const firmwareName = req.params.firmwareName

        if (fs.existsSync(`${__dirname}/../configurations/${firmwareName}`)){
            res.send(200)
            return
        }
        utils.removeFilesRecursively('server/tmp/*')
        utils.createDirectory(`${__dirname}/../configurations/${firmwareName}`)
        utils.untar(
            `${__dirname}/../firmwares/${firmwareName}`,
            `${__dirname}/../tmp`)
        fs.readdir(`${__dirname}/../tmp`, (err, filesInTmp) => {
            const configTarGz = `${__dirname}/../tmp/${filesInTmp[0]}/Configs.tar.gz`
            utils.untar(configTarGz, `${__dirname}/../configurations/${firmwareName}`)
            utils.removeFilesRecursively(`${__dirname}/../tmp/*`)
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
