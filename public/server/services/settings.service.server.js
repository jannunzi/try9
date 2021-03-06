const fs = require('fs-extra')
const homedir = require('os').homedir();
const defaultSettings = require('./defaultSettings')

const settingsAlreadyExist = () =>
  fs.existsSync(`${homedir}/mks/configurator/settings.json`)

const saveDefaultSettings = () =>
  saveSettings(defaultSettings)

const configuratorFolders = [
  'downloads',
  'unpacked',
  'uploads',
  'upload',
  'tmp'
]

const createConfiguratorFolderStructure = () => {
  try {
    if(!fs.existsSync(`${homedir}/mks/`))
      fs.mkdirSync(`${homedir}/mks/`)
  } catch (e) {

  }

  if(!fs.existsSync(`${homedir}/mks/configurator/`))
    fs.mkdirSync(`${homedir}/mks/configurator/`)

  if(!fs.existsSync(`${homedir}/mks/configurator/settings.json`))
    fs.writeFileSync(`${homedir}/mks/configurator/settings.json`, `{
      "firmwares": {}
    }`)

  configuratorFolders.forEach((folder) => {
    if(!fs.existsSync(`${homedir}/mks/configurator/${folder}`))
      fs.mkdirSync(`${homedir}/mks/configurator/${folder}`)
  })
}

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
  saveDefaultSettings,
  createConfiguratorFolder, createConfiguratorFolderStructure
}
