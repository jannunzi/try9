import settingsService from "../services/settings.service.client"

const FIND_ALL_SETTINGS = "FIND_ALL_SETTINGS"
export const findAllSettings = (dispatch) =>
  settingsService.findAllSettings()
    .then(settings => {
      dispatch({
        type: FIND_ALL_SETTINGS,
        settings
      })
    })
