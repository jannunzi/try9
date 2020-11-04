import {API_BASE_URL} from "../config";

export const deleteFirmware = (firmwareName) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmwareName}`, {
    method: 'DELETE'
  })

export const fetchFirmwareFileDetails = () =>
  fetch(`${API_BASE_URL}/api/firmwares/details`)
    .then(response => response.json())

export const fetchFirmwares = () =>
  fetch(`${API_BASE_URL}/api/firmwares`)
    .then(response => response.json())

export const fetchAllFirmwares = () =>
  fetch(`${API_BASE_URL}/api/firmwares`)
    .then(response => response.json())

export const compareFirmwares = (firmwareLeft, firmwareRight, fileLeft, fileRight, what) =>
  fetch(`${API_BASE_URL}/api/compare/${what}/${firmwareLeft}/${fileLeft}/with/${firmwareRight}/${fileRight}`)
    .then(response => response.json())
    .catch(e => {})

export const packageFirmware = (firmware) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/package`)

export const compareJsons = (json1, json2) =>
  fetch(`${API_BASE_URL}/api/compare/jsons`, {
      method: 'POST',
      body: JSON.stringify({
          json1: json1,
          json2: json2
      }),
      headers: {
          'content-type': 'application/json'
      }
  })
    .then(response => response.json())

export default {
  fetchFirmwares,
  fetchAllFirmwares,
  fetchFirmwareFileDetails,
  compareJsons,
  compareFirmwares,
  deleteFirmware,
  packageFirmware
}
