import {API_BASE_URL} from "../config";

export const fetchSchemaFiles = (firmware) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/schemas`)
    .then(response => response.json())

export const fetchSchemaFilesWithContent = (firmware) =>
  fetch(`${API_BASE_URL}/api/firmwares/${firmware}/schemas-with-content`)
    .then(response => response.json())

export const fetchSchemaFileContent = (firmware, schemaFile) =>
    fetch(`${API_BASE_URL}/api/firmwares/${firmware}/schemas/${schemaFile}`)
        .then(response => response.json())

export default {
    fetchSchemaFiles, fetchSchemaFileContent
}
