import {API_BASE_URL} from "../config";
import firmwareService from "../services/firmware.service.client"

export const FETCH_FIRMWARES = "FETCH_FIRMWARES"
export const UPLOAD_FIRMWARE_FILE = "UPLOAD_FIRMWARE_FILE"
export const UPDATE_FIRMWARE = "UPDATE_FIRMWARE"
export const SHOW_DOWNLOADING = "SHOW_DOWNLOADING"
export const DELETE_FIRMWARE = "DELETE_FIRMWARE"
export const SELECT_FIRMWARE = "SELECT_FIRMWARE"
export const UPDATE_SCHEMA_FILE = "UPDATE_SCHEMA_FILE"

export const uploadSchemaFile = (dispatch, e, firmware, selectedFirmwareFileName) => {
  var fd = new FormData();

  const files = [...e.target.files]

  for (var x = 0; x < e.target.files.length; x++) {
    fd.append("config", files[x]);
  }

  dispatch({
    type: UPDATE_SCHEMA_FILE,
    uploadingSchemaFileName: files[0].name
  })
  // this.setState({
  //   uploadingSchemaFileName: files[0].name
  // })

  e.target.value = null;

  fetch(`${API_BASE_URL}/api/firmwares/${selectedFirmwareFileName}/schemas`, {
    method: "POST",
    body: fd
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

export const uploadFirmwareFile = (dispatch, e, fileName) => {
  var fd = new FormData();

  const files = [...e.target.files]
  const filesJson = JSON.stringify(files)

  let ff = {}
  for (var x = 0; x < e.target.files.length; x++) {
    fd.append("config", files[x]);
    const f = files[x]

    for (let attribute in f) {
      ff[attribute] = f[attribute];
    }
  }

  dispatch({
    type: UPLOAD_FIRMWARE_FILE,
    files, ff
  })

  e.target.value = null;

  fetch(`${API_BASE_URL}/api/firmwares`, {
    method: "POST",
    body: fd
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
