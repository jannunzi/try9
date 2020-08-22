const fs = require('fs')
const utils = require('../common/utils')
const constants = require('../common/constants')
const homedir = require('os').homedir();

const SCHEMA2CONFIG = {
    'driveControllerGenesis.json': 'Drive Controller',
    'frequencyControllerEsc.json': 'ESC Tuner Configuration',
    'hardwareManager.json': 'Hardware Manager Configuration',
    'mainController.json': 'Main Controller Configuration',
    'meterConfig.json': 'Meter Configuration',
    'mainHilbertViSensor.json': 'Power Sensor Configuration',
    'pulseController.json': 'Pulsing Configuration',
    'railControllerPulse.json': 'Rail Controller',
    'timbersController.json': 'Timbers Configuration',
    'timbersController2.json': 'Timbers Configuration',
    'tlcConfig.json': 'TLC Communication Configuration'
}

module.exports = (app, upload) => {

    app.get('/api/firmwares/:firmware/configurations', function (req, res) {
        const firmware = req.params.firmware
        fs.readdir(utils.configurationsDirectory(firmware), (err, configurationFiles) => {
            res.send(configurationFiles)
        })
    })

    app.get('/api/firmwares/:firmware/configurations-with-content', function (req, res) {
        const firmware = req.params.firmware
        const path = utils.configurationsDirectory(firmware)
        let configurations = []
        const configurationFiles = fs.readdirSync(path)
          .filter(configuration => typeof constants.CONFIGURATION_IGNORE[configuration] === 'undefined')
        configurationFiles.forEach(configurationFile => {

            const stat = fs.statSync(`${path}/${configurationFile}`)
            if(!stat.isDirectory()) {
                const configurationFileContent = fs.readFileSync(`${path}/${configurationFile}`).toString()
                let configurationFileContentJson = {};
                try {
                    configurationFileContentJson = JSON.parse(configurationFileContent)
                } catch (e) {

                }
                // console.log(schemaFileContentJson)
                const title = configurationFileContentJson.title
                const configuration = {
                    title: title,
                    file: configurationFile,
                    firmware: req.params.firmware,
                    content: configurationFileContentJson
                }
                configurations.push(configuration)
            }
        })
        res.send(configurations)
    })

    app.get('/api/firmwares/:firmware/configurations/:configuration', function (req, res) {
        const firmware = req.params.firmware
        const configuration = req.params.configuration
        const path = utils.configurationsDirectory(firmware)

        let configurationFileContent = {}
        try {
            configurationFileContent = fs.readFileSync(`${path}/${configuration}`).toString()
        } catch (e) {
          // ignore
        }

        res.send(configurationFileContent)
    })

    app.get('/api/firmwares/:firmware/schemas/:schema/configuration', function (req, res) {
        const firmware = req.params.firmware
        const configuration = req.params.configuration

        const configurationFileContent = fs.readFileSync(`${utils.configurationsDirectory(firmware)}/${configuration}`).toString()

        res.send(configurationFileContent)
    })

    app.put('/api/firmwares/:firmware/configurations/:configuration', function (req, res) {
        const firmware = req.params.firmware
        const configuration = req.params.configuration
        const newConfigurationFileContent = JSON.stringify(req.body, null, 2)

        console.log(firmware)
        console.log(configuration)
        console.log(newConfigurationFileContent)

        fs.writeFileSync(`${utils.configurationsDirectory(firmware)}/${configuration}`, newConfigurationFileContent)

        res.send(200)
    })
}
