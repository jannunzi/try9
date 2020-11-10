import {API_BASE_URL} from "../config";
import firmwareService from "../services/firmware.service.client"
import {difference} from "underscore";
import schemaService from "../services/schema.service.client";
import configurationService from "../services/configuration.service.client";

export const FETCH_FIRMWARES = "FETCH_FIRMWARES"
export const FETCH_ALL_FIRMWARES = "FETCH_ALL_FIRMWARES"
export const UPLOAD_CONFIGURATION_FOLDER = "UPLOAD_CONFIGURATION_FOLDER"
export const UPLOAD_FIRMWARE_FILE = "UPLOAD_FIRMWARE_FILE"
export const UPDATE_FIRMWARE = "UPDATE_FIRMWARE"
export const SHOW_DOWNLOADING = "SHOW_DOWNLOADING"
export const DELETE_FIRMWARE = "DELETE_FIRMWARE"
export const SELECT_FIRMWARE = "SELECT_FIRMWARE"
export const UPDATE_SCHEMA_FILE = "UPDATE_SCHEMA_FILE"
export const FETCH_SCHEMA_FILES_WITH_CONTENT = "FETCH_SCHEMA_FILES_WITH_CONTENT"
export const FETCH_CONFIGURATION_FILES_WITH_CONTENT = "FETCH_CONFIGURATION_FILES_WITH_CONTENT"
export const FETCH_CONFIGURATION_AND_SCHEMA_FILES_WITH_CONTENT = "FETCH_CONFIGURATION_AND_SCHEMA_FILES_WITH_CONTENT"

export const fetchConfigurationAndSchemaFilesWithContent =
  (dispatch, firmware, firmwareIndex, leftOrRight) => {

    let nextState = {}
    //   firmwareLeft: {},
    //   firmwareRight: {}
    // }

    schemaService.fetchSchemaFilesWithContent(firmware)
      .then(schemaFiles => {
          // debugger
          nextState[leftOrRight] = {}
          nextState[leftOrRight].schemaFiles = schemaFiles
          nextState[leftOrRight].firmware = firmware
          nextState[leftOrRight].index = firmwareIndex
          nextState.configurationFilesDiffs = []
          nextState.schemaFilesDiffs = []
          nextState.diff = null
          nextState.selectedJsonFile = null
          // dispatch({
          //   type: FETCH_SCHEMA_FILES_WITH_CONTENT,
          //   ...nextState
          // })
        return configurationService.fetchConfigurationFilesWithContent(firmware)
          .then(configurationFiles => {
            // debugger
            nextState[leftOrRight].configurationFiles = configurationFiles
            nextState[leftOrRight].firmware = firmware
            nextState[leftOrRight].index = firmwareIndex
            dispatch({
              type: FETCH_CONFIGURATION_AND_SCHEMA_FILES_WITH_CONTENT,
              ...nextState
            })
          })
        })
}

export const fetchAllFirmwares = (dispatch) =>
  firmwareService.fetchAllFirmwares()
    .then(firmwares => dispatch({
      type: FETCH_ALL_FIRMWARES,
      firmwares
    }))

export const uploadSchemaFile = (dispatch, event, firmware, selectedFirmwareFileName) => {
  var formData = new FormData();

  const files = [...event.target.files]

  for (let i = 0; i < event.target.files.length; i++) {
    formData.append("config", files[i]);
  }

  dispatch({
    type: UPDATE_SCHEMA_FILE,
    uploadingSchemaFileName: files[0].name
  })

  event.target.value = null;

  fetch(`${API_BASE_URL}/api/firmwares/${selectedFirmwareFileName}/schemas`, {
    method: "POST",
    body: formData
  }).then(() => {
    setTimeout(() =>
        fetchFirmwares(dispatch, firmware),
      500)
  })
}

export const selectFirmware = (dispatch, firmware) =>
  dispatch({
    type: SELECT_FIRMWARE,
    selectedFirmware: firmware
  })

export const uploadConfigurationFolder = (dispatch, event) => {
  const files = [...event.target.files]
  let path = ""

  let shortestPath = 1000
  for (var x = 0; x < event.target.files.length; x++) {
    const candidatePath = files[x].path
    const candidatePathLength = candidatePath.length
    if(candidatePath.endsWith(".json") && candidatePathLength < shortestPath) {
      path = candidatePath
      shortestPath = candidatePathLength
    }
  }

  let pathParts = []
  let joinOn = "/"
  if(path.indexOf("\\") > 1) {
    joinOn = "\\"
  }
  pathParts =  path.split(joinOn)
  path = pathParts.slice(0, -1).join(joinOn)
  path = path.replace(/\\/g,'+')
  path = path.replace(/\//g,'+')

  dispatch({
    type: UPLOAD_CONFIGURATION_FOLDER,
    path
  })

  fetch(`${API_BASE_URL}/api/folders/${path}`, {
    method: "POST",
  }).then(response => {
    setTimeout(() => {
      fetchFirmwares(dispatch, path)
    }, 2000)
  })
}

export const uploadFirmwareFile = (dispatch, event, fileName) => {
  var formData = new FormData();

  const files = [...event.target.files]
  const filesJson = JSON.stringify(files)

  let uploads = {}
  for (let i = 0; i < event.target.files.length; i++) {
    formData.append("config", files[i]);
    const file = files[i]

    for (let attribute in file) {
      uploads[attribute] = file[attribute];
    }
  }

  dispatch({
    type: UPLOAD_FIRMWARE_FILE,
    files, uploads
  })

  event.target.value = null;

  fetch(`${API_BASE_URL}/api/firmwares`, {
    method: "POST",
    body: formData
  }).then(response => {
    setTimeout(() =>
        fetchFirmwares(dispatch, fileName),
      2000  )
  })
}

export const deleteFirmware = (dispatch, firmwareName) =>
  firmwareService.deleteFirmware(firmwareName).then(status => dispatch({
    type: DELETE_FIRMWARE, firmwareName
  }))

export const showDownloading = (dispatch, firmwareName, downloading) =>
  dispatch({
    type: SHOW_DOWNLOADING, firmwareName, downloading
  })

export const updateFirmware = (dispatch, firmware) =>
  dispatch({
    type: UPDATE_FIRMWARE, firmware
  })

export const fetchFirmwares = (dispatch, fileNameParameter) =>
  firmwareService.fetchFirmwareFileDetails()
    .then(firmwares => dispatch({
      type: FETCH_FIRMWARES, firmwares, fileNameParameter
    }))

export default {
  fetchFirmwares,
  fetchAllFirmwares,
  showDownloading,
  uploadSchemaFile,
  selectFirmware,
  uploadConfigurationFolder,
  uploadFirmwareFile,
  deleteFirmware,
  updateFirmware,
  fetchConfigurationAndSchemaFilesWithContent
}
