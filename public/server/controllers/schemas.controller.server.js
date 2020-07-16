const fs = require('fs')
const refParser = require('json-schema-ref-parser')
const constants = require('../common/constants')
let firmwareStats = {}
let schemas = []
module.exports = (app) => {
    const fetchSchemaFileNameArrayForFirmware = (req, res) => {
        fs.stat(`${__dirname}/../schemas/${req.params.firmware}`, (err, newStats) => {
            console.log(newStats)
            // if files in directory have changed, recreate schema array
            const oldStats = firmwareStats[req.params.firmware]
            if(!oldStats || oldStats && oldStats.mtime !== newStats.mtime) {
                let schemas = []
                const schemaFiles = fs.readdirSync(`${__dirname}/../schemas/${req.params.firmware}`)
                  .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined')
                schemaFiles.forEach(schemaFile => {
                    const schemaFileContent = fs.readFileSync(`${__dirname}/../schemas/${req.params.firmware}/${schemaFile}`).toString()
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
            // else {
            //
            // }
            // res.send(fs.readdirSync(`${__dirname}/../schemas/${req.params.firmware}`)
            //     .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined'))
        })
    }
    const fetchSchemaFilesWithContent = (req, res) => {
        fs.stat(`${__dirname}/../schemas/${req.params.firmware}`, (err, newStats) => {
            console.log(newStats)
            // if files in directory have changed, recreate schema array
            const oldStats = firmwareStats[req.params.firmware]
            if(!oldStats || oldStats && oldStats.mtime !== newStats.mtime) {
                let schemas = []
                const schemaFiles = fs.readdirSync(`${__dirname}/../schemas/${req.params.firmware}`)
                  .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined')
                schemaFiles.forEach(schemaFile => {
                    const schemaFileContent = fs.readFileSync(`${__dirname}/../schemas/${req.params.firmware}/${schemaFile}`).toString()
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
            // else {
            //
            // }
            // res.send(fs.readdirSync(`${__dirname}/../schemas/${req.params.firmware}`)
            //     .filter(schema => typeof constants.SCHEMA_IGNORE[schema] === 'undefined'))
        })
    }
    const fetchSchemaFileContent = (req, res) =>
        refParser.dereference(`${__dirname}/../schemas/${req.params.firmware}/${req.params.schema}`)
            .then(schema => res.status(200).json(schema))
    app.get('/api/firmwares/:firmware/schemas', fetchSchemaFileNameArrayForFirmware)
    app.get('/api/firmwares/:firmware/schemas-with-content', fetchSchemaFilesWithContent)
    app.get('/api/firmwares/:firmware/schemas/:schema', fetchSchemaFileContent)
}
