const fs = require('fs')
const refParser = require('json-schema-ref-parser')
const constants = require('../common/constants')
let firmwareStats = {}
let schemas = []
const homedir = require('os').homedir();

module.exports = (app) => {
    const fetchSchemaFileNameArrayForFirmware = (req, res) => {
        const firmware = req.params.firmware
        fs.stat(`${homedir}/mks/configurator/unpacked/${firmware}/Schema`, (err, newStats) => {
            console.log(newStats)
            // if files in directory have changed, recreate schema array
            const oldStats = firmwareStats[req.params.firmware]
            if(!oldStats || oldStats && oldStats.mtime !== newStats.mtime) {
                let schemas = []
                const schemaFiles = fs.readdirSync(`${homedir}/mks/configurator/unpacked/${firmware}/Schema`)
                  .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined')
                schemaFiles.forEach(schemaFile => {
                    const schemaFileContent = fs.readFileSync(`${homedir}/mks/configurator/unpacked/${firmware}/Schema/${schemaFile}`).toString()
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
        fs.stat(`${homedir}/mks/configurator/unpacked/${firmware}/Schema`, (err, newStats) => {
            console.log(newStats)
            // if files in directory have changed, recreate schema array
            const oldStats = firmwareStats[req.params.firmware]
            if(!oldStats || oldStats && oldStats.mtime !== newStats.mtime) {
                let schemas = []
                const schemaFiles = fs.readdirSync(`${homedir}/mks/configurator/unpacked/${firmware}/Schema`)
                  .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined')
                schemaFiles.forEach(schemaFile => {
                    const schemaFileContent = fs.readFileSync(`${homedir}/mks/configurator/unpacked/${firmware}/Schema/${schemaFile}`).toString()
                    const schemaFileContentJson = JSON.parse(schemaFileContent)
                    // console.log(schemaFileContentJson)
                    const title = schemaFileContentJson.title
                    const schema = {
                        title: title,
                        file: schemaFile,
                        firmware: req.params.firmware,
                        content: schemaFileContentJson
                    }
                    schemas.push(schema)
                })
                firmwareStats[req.params.firmware] = schemas
            }
            res.send(firmwareStats[req.params.firmware])
        })
    }
    const fetchSchemaFileContent = (req, res) =>
        refParser.dereference(`${homedir}/mks/configurator/unpacked/${req.params.firmware}/Schema/${req.params.schema}`)
            .then(schema => res.status(200).json(schema))
    
    app.get('/api/firmwares/:firmware/schemas', fetchSchemaFileNameArrayForFirmware)
    app.get('/api/firmwares/:firmware/schemas-with-content', fetchSchemaFilesWithContent)
    app.get('/api/firmwares/:firmware/schemas/:schema', fetchSchemaFileContent)
}
