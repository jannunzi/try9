import React from "react";
import {Link, NavLink} from "react-router-dom";
import {API_BASE_URL} from "../config";
import firmwareService from '../services/firmware.service.client'

export default class Firmwares extends React.Component {

    state = {
        firmwares: []
    }

    downloadLinks = {}

    fileSelectionChanged = (e) => {
        var fd = new FormData();

        for (var x = 0; x < e.target.files.length; x++) {
            fd.append("config", e.target.files[x]);
        }

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
                this.downloadLinks[firmwareName].click()
                console.log(response)
            })

    render() {
        return(
            <div>

                <input
                  className="btn btn-primary pull-right"
                  type="file"
                  title="Add Firmware"
                  multiple
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
                    {
                        this.state.firmwares.map(firmware =>
                            <li key={firmware.fileName} className="list-group-item">
                                <div className="row">
                                    <div className="col-xs-6">
                                        <Link to={`/firmwares/${firmware}`}>
                                            {firmware.fileName}
                                        </Link>
                                    </div>
                                    <div className="col-xs-3">
                                        {firmware.atime}<br/>
                                        {firmware.ctime}<br/>
                                        {firmware.mtime}<br/>
                                        {firmware.birthtime}
                                    </div>
                                    <div className="col-xs-3">
                                        <button
                                          onClick={() => this.deleteFirmware(firmware.fileName)}
                                          className="btn btn-danger btn-sm pull-right">
                                            <i className="fa fa-times mks-margin-right-5px"/>
                                            Delete
                                        </button>
                                        <button
                                          onClick={() => this.packageFirmware(firmware.fileName)}
                                          className="btn btn-success btn-sm pull-right mks-margin-right-5px">
                                            <i className="fa fa-download mks-margin-right-5px"/>
                                            Download
                                        </button>
                                        <a className="pull-right mks-margin-right-5px mks-invisible"
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
