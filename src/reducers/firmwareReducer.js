import {
  DELETE_FIRMWARE,
  FETCH_FIRMWARES,
  SELECT_FIRMWARE,
  SHOW_DOWNLOADING,
  UPDATE_FIRMWARE,
  UPLOAD_FIRMWARE_FILE,
  UPLOAD_CONFIGURATION_FOLDER,
  FETCH_ALL_FIRMWARES,
  FETCH_SCHEMA_FILES_WITH_CONTENT,
  FETCH_CONFIGURATION_FILES_WITH_CONTENT,
  FETCH_CONFIGURATION_AND_SCHEMA_FILES_WITH_CONTENT
} from "../actions/firwareActions";

const firmwareReducer = (
  state={selectedFirmware: {}, downloading: {}},
  action) => {
  switch (action.type) {
    case SELECT_FIRMWARE:
      const firmware = state.firmwares.find(firmware =>
        firmware.fileName === action.selectedFirmware)
      return {
        ...state,
        selectedFirmware: firmware
      }
    case UPLOAD_CONFIGURATION_FOLDER:
      return {
        ...state,
        firmwares: [
          {
            fileName: action.path,
            uploading: true,
          },
          ...state.firmwares
        ],
        selectedFirmware: {
          fileName: ""
        },
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
        uploads: [action.uploads]
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
    case FETCH_ALL_FIRMWARES:
      return {
        ...state,
        firmwares: action.firmwares
      }
    case FETCH_CONFIGURATION_AND_SCHEMA_FILES_WITH_CONTENT:
      return {
        ...state,
        ...action
      }
    default:
      return state
  }
}

export default firmwareReducer
