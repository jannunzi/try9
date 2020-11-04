import {COMPARE_CONFIGURATIONS} from "../actions/configurationActions";

const configurationReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPARE_CONFIGURATIONS:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default configurationReducer
