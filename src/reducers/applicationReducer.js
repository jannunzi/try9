const initialState = {
  contrast: true
}

const applicationReducer = (state=initialState, action) => {
  switch (action.type) {
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
