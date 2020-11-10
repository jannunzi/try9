import {API_BASE_URL} from "../config";

export const findAllSettings = () =>
  fetch(`${API_BASE_URL}/api/settings`)
    .then(response => response.json())

export default {
  findAllSettings
}
