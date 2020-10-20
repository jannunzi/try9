const initialState = {
  contrast: true,
  settings: {}
}

const applicationReducer = (state=initialState, action) => {
  switch (action.type) {
    case "FIND_ALL_SETTINGS":
      return {
        ...state,
        settings: action.settings
      }
    case "UPDATE_CONTRAST":
      return {
        ...state,
        contrast: action.contrast
      }
    default:
      return state
  }
}

export default applicationReducer
