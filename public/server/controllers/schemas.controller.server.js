const fs = require('fs-extra')
const refParser = require('json-schema-ref-parser')
const constants = require('../common/constants')
let firmwareStats = {}
let schemas = []
const homedir = require('os').homedir();
const utils = require('../common/utils');
const {UPLOAD_PATH, FIRMWARE_PATH, SCHEMAS_PATH} = require('../common/paths')

module.exports = (app, upload) => {
    const fetchSchemaFileNameArrayForFirmware = (req, res) => {
        const firmware = req.params.firmware
        const path = utils.schemasDir(firmware)
        fs.stat(`${path}`, (err, newStats) => {
            console.log(newStats)
            // if files in directory have changed, recreate schema array
            const oldStats = firmwareStats[req.params.firmware]
            if(!oldStats || oldStats && oldStats.mtime !== newStats.mtime) {
                let schemas = [];
                let schemaFiles = []
                try {
                    schemaFiles = fs.readdirSync(`${path}`)
                      .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined')
                } catch (e) {
                    res.json([])
                    return
                }
                schemaFiles.forEach(schemaFile => {
                    const schemaFileContent = fs.readFileSync(`${path}/${schemaFile}`).toString()
                    const schemaFileContentJson = JSON.parse(schemaFileContent)
                    // console.log(schemaFileContentJson)
                    const title = schemaFileContentJson.title
                    const schema = {
                        title: title,
                        file: schemaFile,
                        firmware: req.params.firmware
                    }
                    schemas.push(schema)
                })
                firmwareStats[req.params.firmware] = schemas
            }
            res.send(firmwareStats[req.params.firmware])
        })
    }
    const fetchSchemaFilesWithContent = (req, res) => {
        const firmware = req.params.firmware
        const path = utils.schemasDir(firmware)
        if(fs.existsSync(path)) {
            fs.stat(`${path}`, (err, newStats) => {
                // if files in directory have changed, recreate schema array
                const oldStats = firmwareStats[req.params.firmware]
                if(!oldStats || oldStats && oldStats.mtime !== newStats.mtime) {
                    let schemas = []
                    let schemaFiles = []
                    try {
                        schemaFiles = fs.readdirSync(`${path}`)
                          .filter(schema =>
                            typeof constants.SCHEMA_IGNORE[schema] === 'undefined' && schema !== '.DS_Store')
                        schemaFiles.forEach(schemaFile => {
                            const schemaFileContent = fs.readFileSync(`${path}/${schemaFile}`).toString()
                            let schemaFileContentJson = {}
                            try {
                                schemaFileContentJson = JSON.parse(schemaFileContent)
                            } catch (e) {

                            }
                            const title = schemaFileContentJson.title
                            const schema = {
                                title: title,
                                file: schemaFile,
                                firmware: req.params.firmware,
                                content: schemaFileContentJson
                            }
                            schemas.push(schema)
                        })
                    } catch (e) {

                    }
                    firmwareStats[req.params.firmware] = schemas
                }
                res.send(firmwareStats[req.params.firmware])
            })
        } else {
            res.json([])
        }
    }
    const fetchSchemaFileContent = (req, res) => {
        if(fs.existsSync(`${utils.schemasDir(req.params.firmware)}/${req.params.schema}`)) {
            refParser.dereference(`${utils.schemasDir(req.params.firmware)}/${req.params.schema}`)
              .then(schema => res.status(200).json(schema))
        } else {
            res.json(null)
        }
    }

    const uploadSchema = (req, res) => {
        upload(req, res, function (err, ddd) {
            const files = utils.readDirectoryContent(`${UPLOAD_PATH}`)
            files.forEach(schemaFileName =>
            {
                const firmware = req.params.firmware
                const schemaPath = SCHEMAS_PATH(firmware)
                try {
                    fs.moveSync(
                      `${UPLOAD_PATH}/${schemaFileName}`,
                      `${SCHEMAS_PATH(firmware)}/${schemaFileName}`)
                } catch (e) {
                    // ignore
                }
            })
            utils.cleanFolders()

            utils.removeTimestampFiles(`${SCHEMAS_PATH(req.params.firmware)}`)
            utils.writeTimestampFile(`${SCHEMAS_PATH(req.params.firmware)}`, '__IGNORE__')

            res.sendStatus(200)
        })
    }

    const deleteSchema = (req, res) => {
        const firmware = req.params.firmware;
        const schema   = req.params.schema;
        fs.removeSync(`${SCHEMAS_PATH(firmware)}/${schema}`)
        res.sendStatus(200)
    }

    app.get('/api/firmwares/:firmware/schemas', fetchSchemaFileNameArrayForFirmware)
    app.get('/api/firmwares/:firmware/schemas-with-content', fetchSchemaFilesWithContent)
    app.get('/api/firmwares/:firmware/schemas/:schema', fetchSchemaFileContent)
    app.post('/api/firmwares/:firmware/schemas', upload, uploadSchema)
    app.delete('/api/firmwares/:firmware/schemas/:schema', upload, deleteSchema)
}
