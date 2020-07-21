const fs = require('fs')
const homedir = require('os').homedir();
const defaultSettings = require('./defaultSettings')

const settingsAlreadyExist = () =>
  fs.existsSync(`${homedir}/mks/configurator/settings.json`)

const saveDefaultSettings = () =>
  saveSettings(defaultSettings)

const createConfiguratorFolder = () =>
  !fs.existsSync(`${homedir}/mks/configurator/`) ?
    fs.mkdirSync(`${homedir}/mks/configurator/`) :
    false

const loadSettings = () =>
  JSON.parse(
    fs.readFileSync(
      `${homedir}/mks/configurator/settings.json`
    ).toString()
  )

const saveSettings = (newSettings) =>
  fs.writeFileSync(
    `${homedir}/mks/configurator/settings.json`,
    JSON.stringify(newSettings, null, 2)
  )

module.exports = {
  loadSettings, saveSettings, settingsAlreadyExist,
  saveDefaultSettings, createConfiguratorFolder
}
