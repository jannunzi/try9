import React from "react";
import firmwareService from "../../services/firmware.service.client";

export default class SchemaManager extends React.Component {
  state = {
    firmwares: []
  }

  componentDidMount() {
    firmwareService.fetchFirmwares()
      .then(_firmwares => this.setState({firmwares: _firmwares}))
  }

  render() {
    return (
      <div>
        <h1>Schemas</h1>

      </div>
    )
  }
}
