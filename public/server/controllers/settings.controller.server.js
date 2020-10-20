const settingsService = require("../services/settings.service.server")

const pjson = require('../../../package.json')
// console.log(pjson.version)

module.exports = (app) => {
  const loadSettings = (req, res) => {
    // let settings = JSON.parse(settingsService.loadSettings())
    const settings = {
      version: pjson.version
    }
    res.json(settings)
  }

  const saveSettings = (req, res) => {
    settingsService.saveSettings(req.body)
    res.sendStatus(200)
  }

  app.get("/api/settings", loadSettings)
  app.post("/api/settings", saveSettings)
}
