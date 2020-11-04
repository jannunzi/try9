import {COMPARE_SCHEMAS} from "../actions/schemaActions";

const schemaReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPARE_SCHEMAS:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default schemaReducer
