import React from "react";
import {Link} from "react-router-dom";
import {API_BASE_URL} from "../config";

export default class Firmwares extends React.Component {

    state = {
        firmwares: []
    }

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
        fetch(`${API_BASE_URL}/api/firmwares`)
            .then(response => response.json())
            .then(firmwares => this.setState({
                firmwares: firmwares
            }))

    deleteFirmware = (firmwareName) =>
        fetch(`${API_BASE_URL}/api/firmwares/${firmwareName}`, {
            method: 'DELETE'
        })
            .then(response => this.fetchFirmwares())

    render() {
        return(
            <div>
                <ul className="list-group">
                    <li className="list-group-item">
                        <input
                            className="btn btn-primary btn-block"
                            type="file"
                            multiple
                            encType="multipart/form-data"
                            onChange={this.fileSelectionChanged}
                        />
                    </li>
                    {
                        this.state.firmwares.map(firmware =>
                            <li key={firmware} className="list-group-item">
                                <Link to={`/firmwares/${firmware}`}>
                                    {firmware}
                                </Link>
                                <button
                                  onClick={() => this.deleteFirmware(firmware)}
                                  className="btn btn-danger btn-sm pull-right">
                                    <i className="fa fa-times mks-margin-right-5px"/>
                                    Delete
                                </button>
                                <button
                                  className="btn btn-success btn-sm pull-right mks-margin-right-5px">
                                    <i className="fa fa-download mks-margin-right-5px"/>
                                    Download
                                </button>
                            </li>
                        )
                    }
                </ul>
            </div>
            )
    }
}
