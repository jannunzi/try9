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
    configurations: [],
    schemas: []
  }

  downloadLinks = {}
  addFirmwareBtn = null
  addSchemaBtn = null
  addFirmware = () => this.addFirmwareBtn.click()
  addSchema = () => this.addSchemaBtn.click()

  deleteSchemaFile = (firmware, schema) => {
    schemService.deleteSchemaFile(firmware, schema)
      .then(this.fetchFirmwares)
  }

  uploadSchemaFile = (e) => {
    var fd = new FormData();

    for (var x = 0; x < e.target.files.length; x++) {
      fd.append("config", e.target.files[x]);
    }

    e.target.value = null;

    fetch(`${API_BASE_URL}/api/firmwares/${this.state.selectedFirmware.fileName}/schemas`, {
      method: "POST",
      body: fd
    }).then(() => {
      setTimeout(this.fetchFirmwares, 500)
    })
  }

  uploadFirmwareFile = (e) => {
    var fd = new FormData();

    for (var x = 0; x < e.target.files.length; x++) {
      fd.append("config", e.target.files[x]);
    }

    e.target.value = null;

    fetch(`${API_BASE_URL}/api/firmwares`, {
      method: "POST",
      body: fd
    }).then(response => {
      setTimeout(this.fetchFirmwares, 2000  )
    })
  }

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

  fetchFirmwares = () =>
    fetch(`${API_BASE_URL}/api/firmwares/details`)
      .then(response => response.json())
      .then(firmwares => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState.firmwares = firmwares

          if(this.props.match.params.fileName) {
            const firmware = nextState.firmwares.find(firmware => firmware.fileName === this.props.match.params.fileName)
            nextState.selectedFirmware = firmware
          }

          return nextState
        })
      })

  deleteFirmware = (firmwareName) => {
    debugger
    fetch(`${API_BASE_URL}/api/firmwares/${firmwareName}`, {
      method: 'DELETE'
    })
      .then(() => {
        this.setState(prevState => {
          let nextState = {...prevState}
          nextState.firmwares = prevState.firmwares.filter(firmware => firmware.fileName !== firmwareName)
          return nextState
        })

        this.props.history.push("/firmwares")
      })
  }

  packageFirmware = (firmwareName) =>
    firmwareService.packageFirmware(firmwareName)
      .then((response) => {
        setTimeout(() => {
          this.downloadLinks[firmwareName].click()
        }, 3000)
      })
      .catch(e => console.log(e))

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-6">
            <div className="list-group">
              <a href="/firmwares" className="list-group-item mks-active">
                Firmware
                <i onClick={this.addFirmware}
                   className="mks-cursor-pointer fa fa-plus pull-right fa-2x mks-position-relative-bottom-3px"/>
              </a>
              {this.state.firmwares &&
              this.state.firmwares.map(firmware =>
                <span key={firmware.fileName}>
                  <NavLink to={`/firmwares/${firmware.fileName}`}
                           className={`list-group-item
                            ${firmware.fileName === this.state.selectedFirmware.fileName ?
                             'list-group-item-info' : ''}`}>
                    <div className="row">
                      <div className="col-xs-7">
                        {firmware.fileName}
                      </div>
                      <div className="col-xs-3">
                        {Moment(firmware.birthtime).format('MM/DD/YYYY HH:mm:SS')}
                      </div>
                      <div className="col-xs-2">
                        <i onClick={() => this.deleteFirmware(firmware.fileName)}
                           className="mks-cursor-pointer fa fa-trash pull-right mks-color-red"/>
                        <i onClick={() => this.packageFirmware(firmware.fileName)}
                           className="mks-cursor-pointer fa fa-download pull-right mks-color-green"/>
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
          <div className="col-xs-6">
            <ul className="list-group">
              <li className="list-group-item mks-active mks-padding-bottom-2px">
                <div className="row">
                  <div className="col-xs-6">
                    Configurations
                  </div>
                  <div className="col-xs-6">
                    Schemas
                    <i onClick={this.addSchema}
                       className="mks-cursor-pointer fa fa-plus pull-right fa-2x mks-position-relative-bottom-3px"/>
                  </div>
                </div>
              </li>
              {
                this.state.selectedFirmware && this.state.selectedFirmware.differences &&
                this.state.selectedFirmware.differences.map(difference =>
                  <li key={difference[1]}
                      className={`list-group-item ${difference[0] === "-" || difference[0] === "+" ?
                        "list-group-item-info" : ""}`}>
                    <div className="row">
                      <div className="col-xs-6">
                        {difference[0] === " " && <span>{difference[1]}</span>}
                        {difference[0] === "-" && <span>{difference[1]}</span>}
                        {difference[0] !== " " && difference[0] !== "-" &&
                        <span className="mks-bold"><i className="fa fa-warning"/> NO CONFIGURATION</span>}
                      </div>
                      <div className="col-xs-6">
                        {difference[0] === " " && <span>{difference[1]}</span>}
                        {difference[0] === "+" && <span>{difference[1]}</span>}
                        {
                          (difference[0] === "+" || difference[0] === " ") &&
                          <i onClick={() => this.deleteSchemaFile(this.state.selectedFirmware.fileName,
                            difference[1])} className="fa fa-trash mks-color-red pull-right mks-cursor-pointer"/>
                        }
                        {difference[0] !== " " && difference[0] !== "+" &&
                        <span className="mks-bold"><i className="fa fa-warning"/> NO SCHEMA</span>}

                      </div>
                    </div>
                  </li>)
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
