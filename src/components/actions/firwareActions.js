import {API_BASE_URL} from "../../config";

export const FETCH_FIRMWARES = "FETCH_FIRMWARES"

export const fetchFirmwares = (dispatch, fileNameParameter) =>
  fetch(`${API_BASE_URL}/api/firmwares/details`)
    .then(response => response.json())
    .then(firmwares => dispatch({
      type: FETCH_FIRMWARES, firmwares, fileNameParameter
    }))
