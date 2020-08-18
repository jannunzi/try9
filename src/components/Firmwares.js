import React from "react";
import {Link, NavLink} from "react-router-dom";
import {API_BASE_URL} from "../config";
import firmwareService from '../services/firmware.service.client'
import Moment from 'moment'

export default class Firmwares extends React.Component {

    state = {
        firmwares: []
    }

    downloadLinks = {}
    addFirmwareBtn = null
    addFirmware = () => {

      this.addFirmwareBtn.click()
    }

    fileSelectionChanged = (e) => {
        var fd = new FormData();

        for (var x = 0; x < e.target.files.length; x++) {
            fd.append("config", e.target.files[x]);
        }

        e.target.value = null;

        fetch(`${API_BASE_URL}/api/firmwares`, {
            method: "POST",
            body: fd
        }).then(response => {
            console.log(response)
            this.fetchFirmwares()
        })
    }

    componentDidMount() {
        this.fetchFirmwares()
        Moment.locale('en');
    }

    fetchFirmwares = () =>
        fetch(`${API_BASE_URL}/api/firmwares/details`)
            .then(response => response.json())
            .then(firmwares => this.setState({
                firmwares: firmwares
            }))

    deleteFirmware = (firmwareName) =>
        fetch(`${API_BASE_URL}/api/firmwares/${firmwareName}`, {
            method: 'DELETE'
        })
            .then(response => this.fetchFirmwares())

    packageFirmware = (firmwareName) =>
        firmwareService.packageFirmware(firmwareName)
            .then((response) => {
                setTimeout(() => this.downloadLinks[firmwareName].click(), 3000)
            })
            .catch(e => console.log(e))

    render() {
        return(
            <div>

              {/*<button onClick={this.addFirmware}*/}
              {/*        title="Upload"*/}
              {/*        className="btn btn-primary pull-right">*/}
              {/*  <i className="fa fa-plus"/>*/}
              {/*  &nbsp;*/}
              {/*  Upload*/}
              {/*</button>*/}

                <input
                  className="btn btn-primary pull-right"
                  type="file"
                  title="Add Firmware"
                  multiple
                  ref={input => {this.addFirmwareBtn = input}}
                  encType="multipart/form-data"
                  onChange={this.fileSelectionChanged}
                />

                <ul className="nav nav-tabs">
                    <li className={`active`}>
                        <NavLink to={`/compare/configurations`}>
                            Firmwares
                        </NavLink>
                    </li>
                </ul>

                <br/>

                <ul className="list-group">
                  <li className="list-group-item list-group-item-info">
                    <div className="row">
                      <div className="col-xs-5">
                        Filename
                      </div>
                      <div className="col-xs-3">
                        Uploaded on
                      </div>
                      <div className="col-xs-4">
                      </div>
                    </div>
                  </li>
                    {
                        this.state.firmwares.map(firmware =>
                            <li key={firmware.fileName} className="list-group-item">
                                <div className="row">
                                    <div className="col-xs-5">
                                        <Link to={`/firmwares/${firmware}`}>
                                            {firmware.fileName}
                                        </Link>
                                    </div>
                                    <div className="col-xs-3">
                                      {Moment(firmware.birthtime).format('MM/DD/YYYY HH:mm:SS')}
                                    </div>
                                    <div className="col-xs-4">
                                        <button
                                          title="Remove"
                                          onClick={() => this.deleteFirmware(firmware.fileName)}
                                          className="btn btn-danger btn-sm pull-right mks-margin-left-5px">
                                            <i className="fa fa-times"/>
                                            &nbsp;
                                            Remove
                                        </button>
                                        <button
                                          title="Download"
                                          onClick={() => this.packageFirmware(firmware.fileName)}
                                          className="btn btn-success btn-sm pull-right mks-margin-left-5px">
                                            <i className="fa fa-download"/>
                                            &nbsp;
                                            Download
                                        </button>
                                        <a className="pull-right mks-margin-left-5px mks-invisible"
                                           ref={link => {this.downloadLinks[firmware.fileName] = link}}
                                           href={`${API_BASE_URL}/api/firmwares/${firmware.fileName}`}>
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>
            )
    }
}
