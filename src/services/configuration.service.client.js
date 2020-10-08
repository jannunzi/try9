import {API_BASE_URL} from "../config";

export const saveConfigurationFileContent = (firmware, configurationFile, newConfigurations) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/configurations/${configurationFile}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(newConfigurations)
  })
    // .then(response => response.json())

export const cloneConfigurationFileContent = (firmware, saveAs, configurationFile, newConfigurations) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/configurations/${configurationFile}/cloneto/${saveAs}`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(newConfigurations)
  })
    // .then(response => response.json())

export const fetchConfigurationFiles = (firmware) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/configurations`)
    .then(response => response.json())

export const fetchConfigurationFilesWithContent = (firmware) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/configurations-with-content`)
    .then(response => response.json())

export const fetchConfigurationFileContent = (firmware, configurationFile) =>
    fetch(`${API_BASE_URL}/api/firmwares/${firmware}/configurations/${configurationFile}`)
        .then(response => response.json())

export default {
    saveConfigurationFileContent, fetchConfigurationFileContent, fetchConfigurationFiles, cloneConfigurationFileContent
}
