const settingsService = require("../services/settings.service.server")

module.exports = (app) => {
  const loadSettings = (req, res) =>
    res.json(
      JSON.parse(
        settingsService.loadSettings()
      )
    )

  const saveSettings = (req, res) => {
    settingsService.saveSettings(req.body)
    res.sendStatus(200)
  }

  app.get("/api/settings", loadSettings)
  app.post("/api/settings", saveSettings)
}
