import {
  DELETE_FIRMWARE,
  FETCH_FIRMWARES, SELECT_FIRMWARE,
  SHOW_DOWNLOADING,
  UPDATE_FIRMWARE, UPLOAD_FIRMWARE_FILE
} from "../actions/firwareActions";

const firmwareReducer = (
  state={selectedFirmware: {}, downloading: {}},
  action) => {
  switch (action.type) {
    case SELECT_FIRMWARE:
      const firmware = state.firmwares.find(firmware => firmware.fileName === action.selectedFirmware)
      return {
        ...state,
        selectedFirmware: firmware
      }
    case UPLOAD_FIRMWARE_FILE:
      return {
        ...state,
        firmwares: [
          {
            fileName: action.files[0].name,
            uploading: true,
          },
          ...state.firmwares
        ],
        selectedFirmware: {
          fileName: ""
        },
        configurations: [],
        schemas: [],
        uploads: [action.ff]
      }
    case SHOW_DOWNLOADING:
      let nextState = {...state}
      nextState.downloading[action.firmwareName] = action.downloading
      return nextState
    case DELETE_FIRMWARE:
      return {
        ...state,
        firmwares: state.firmwares.filter(firmware => firmware.fileName !== action.firmwareName),
        selectedFirmware: {
          fileName: ""
        },
        configurations: [],
        schemas: []
      }
    case UPDATE_FIRMWARE:
      return {
        ...state
      }
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
