import {FETCH_FIRMWARES} from "../components/actions/firwareActions";

const initialState = {
  test1: "test123"
}

const firmwareReducer = (
  state=initialState,
  action) => {
  switch (action.type) {
    case FETCH_FIRMWARES:
      return {
        ...state,
        firmwares: action.firmwares,
        uploadingSchemaFileName: "",
        selectedFirmware: action.fileNameParameter ?
          action.firmwares.find(firmware => firmware.fileName === action.fileNameParameter) : {}
      }
    default:
      return state
  }
}

export default firmwareReducer
