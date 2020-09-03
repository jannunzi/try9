import React from "react";
import {NavLink} from "react-router-dom";
import {API_BASE_URL} from "../config";
import firmwareService from '../services/firmware.service.client'
import schemService from '../services/schema.service.client'
import Moment from 'moment'

export default class Firmwares extends React.Component {

  state = {
    firmwares: [],
    selectedFirmware: {
      fileName: ""
    },
    uploadingSchemaFileName: "",
    uploads: [],
    downloading: {}
  }

  downloadLinks = {}
  addFirmwareBtn = null
  addSchemaBtn = null

  componentDidMount() {
    this.fetchFirmwares()
    Moment.locale('en');
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.match.params.fileName && prevProps.match.params.fileName !== this.props.match.params.fileName) {
      const firmware = this.state.firmwares.find(firmware => firmware.fileName === this.props.match.params.fileName)
      this.setState({
        selectedFirmware: firmware
      })
    }
  }

  addFirmware = () => this.addFirmwareBtn.click()
  addSchema = () => this.addSchemaBtn.click()

  deleteFirmware = (firmwareName) => {
    fetch(`${API_BASE_URL}/api/firmwares/${firmwareName}`, {
      method: 'DELETE'
    })
      .then(() => {
        this.setState(prevState => {
          return {
            firmwares: prevState.firmwares.filter(firmware => firmware.fileName !== firmwareName),
            selectedFirmware: {
              fileName: ""
            },
            configurations: [],
            schemas: []
          }
        })

        this.props.history.push("/firmwares")
      })
  }
  deleteSchemaFile = (firmware, schema) => {
    schemService.deleteSchemaFile(firmware, schema)
      .then(this.fetchFirmwares)
  }

  uploadFirmwareFile = (e) => {
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

    this.setState(prevStatus => {
      return {
        firmwares: [
          {
            fileName: files[0].name,
            uploading: true,
          },
          ...prevStatus.firmwares
        ],
        selectedFirmware: {
          fileName: ""
        },
        configurations: [],
        schemas: [],
        uploads: [ff]
      }
    })

    e.target.value = null;

    fetch(`${API_BASE_URL}/api/firmwares`, {
      method: "POST",
      body: fd
    }).then(response => {
      setTimeout(this.fetchFirmwares, 2000  )
    })
  }
  uploadSchemaFile = (e) => {
    var fd = new FormData();

    const files = [...e.target.files]

    for (var x = 0; x < e.target.files.length; x++) {
      fd.append("config", files[x]);
    }

    this.setState({
      uploadingSchemaFileName: files[0].name
    })

    e.target.value = null;

    fetch(`${API_BASE_URL}/api/firmwares/${this.state.selectedFirmware.fileName}/schemas`, {
      method: "POST",
      body: fd
    }).then(() => {
      setTimeout(this.fetchFirmwares, 500)
    })
  }

  fetchFirmwares = () =>
    fetch(`${API_BASE_URL}/api/firmwares/details`)
      .then(response => response.json())
      .then(firmwares => {
        this.setState(prevState => {
          return {
            ...prevState,
            firmwares: firmwares,
            uploadingSchemaFileName: "",
            selectedFirmware: this.props.match.params.fileName ?
              firmwares.find(firmware => firmware.fileName === this.props.match.params.fileName) : {}
          }
        })
      })

  packageFirmware = (firmwareName) => {
    this.setState(prevState => {
      let nextState = {...prevState}
      nextState.downloading[firmwareName] = true
      return nextState
    })
    firmwareService.packageFirmware(firmwareName)
      .then((response) => {
        setTimeout(() => {
          this.setState(prevState => {
            let nextState = {...prevState}
            nextState.downloading[firmwareName] = false
            return nextState
          })
          this.downloadLinks[firmwareName].click()
        }, 3000)
      })
      .catch(e => console.log(e))
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-8">
            <div className="list-group">
              <a className="list-group-item mks-active">
                Configuration Files
                <button onClick={this.addFirmware}
                        className="btn btn-primary btn-sm pull-right mks-position-relative-bottom-5px mks-margin-left-5px">
                  Add File
                </button>
                <button className="btn btn-primary btn-sm pull-right mks-position-relative-bottom-5px">
                  Add Folder
                </button>
              </a>
              {this.state.firmwares &&
              this.state.firmwares.map(firmware =>
                <span key={firmware.fileName}>
                  <NavLink to={`/firmwares/${firmware.fileName}`}
                           className={`list-group-item 
                           ${firmware.uploading ? 'disabled' : ''}
                           ${firmware.fileName === this.state.selectedFirmware.fileName ?
                             'list-group-item-info' : ''}`}>
                    <div className="row">
                      <div className="col-xs-7">
                        {firmware.fileName.replace(/:/g, '/')}
                      </div>
                      <div className="col-xs-3">
                        {Moment(firmware.birthtime).format('MM/DD/YYYY HH:mm:SS')}
                      </div>
                      <div className="col-xs-2">
                        {
                          !firmware.uploading &&
                          <span>
                            <i onClick={(e) => {e.preventDefault(); this.deleteFirmware(firmware.fileName)}}
                               className="mks-cursor-pointer fa fa-trash pull-right mks-color-red"/>
                            <i onClick={() => this.packageFirmware(firmware.fileName)}
                               className="mks-cursor-pointer fa fa-download pull-right mks-color-green"/>
                            {
                              this.state.downloading[firmware.fileName] &&
                              <i className="fa fa-spin fa-spinner pull-right"/>
                            }
                          </span>
                        }
                        {
                          firmware.uploading &&
                          <i className="fa fa-spinner fa-spin fa-2x pull-right mks-color-red"/>
                        }
                      </div>
                    </div>
                  </NavLink>
                  <a className="pull-right mks-margin-left-5px mks-invisible"
                     ref={link => {this.downloadLinks[firmware.fileName] = link}}
                     href={`${API_BASE_URL}/api/firmwares/${firmware.fileName}`}>
                    Download
                  </a>
                </span>
              )}
            </div>
          </div>
          <div className="col-xs-4">
            <ul className="list-group">
              <li className="list-group-item mks-active mks-padding-bottom-2px">
                <div className="row">
                  <div className="col-xs-12">
                    Configurations
                      <button onClick={this.addSchema}
                              className={`${this.state.selectedFirmware.allowSchemaUpload !== true ? 'mks-invisible':''}
                               btn btn-primary btn-sm pull-right mks-position-relative-bottom-5px`}>
                        Add Schema
                      </button>
                  </div>
                </div>
              </li>
              {
                this.state.uploadingSchemaFileName !== "" &&
                <li className="list-group-item">
                  UPLOADING {this.state.uploadingSchemaFileName}
                  <i className="fa fa-spinner fa-spin pull-right fa-2x"/>
                </li>
              }
              {
                this.state.selectedFirmware.differences &&
                this.state.selectedFirmware.differences.map((difference, index) =>
                  (difference[0] !== "+" && <li className="list-group-item" key={index}>
                    {
                      difference[0] !== "+" &&
                      <span>
                        {difference[1]}
                        {difference[0] !== "-" && this.state.selectedFirmware.allowSchemaUpload &&
                        <i className="fa fa-check pull-right" onClick={this.addSchema}/>}
                      </span>
                    }
                  </li>)
                )
              }
            </ul>
          </div>
        </div>

        <input
          className="btn btn-primary pull-right mks-invisible"
          type="file"
          title="Add Firmware"
          multiple
          ref={input => {
            this.addFirmwareBtn = input
          }}
          encType="multipart/form-data"
          onChange={this.uploadFirmwareFile}
        />
        <input
          className="btn btn-primary pull-right mks-invisible"
          type="file"
          title="Add Schema"
          multiple
          ref={input => {
            this.addSchemaBtn = input
          }}
          encType="multipart/form-data"
          onChange={this.uploadSchemaFile}
        />
      </div>
    )
  }
}
