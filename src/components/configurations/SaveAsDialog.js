import React from "react";
import $ from "jquery";

export default class SaveAsDialog extends React.Component {
  state = {
    saveToSameFile: false,
    saveAsFile: this.props.saveAsFile,
    firmwareFile: ""
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.saveAsFile !== this.props.saveAsFile) {
      this.setState({
        saveAsFile: this.props.saveAsFile
      })
    }
  }

  render() {
    return(
      <div id="saveAs" className="mks-modal-dialog mks-invisible">
          <h3>
            Save as
          </h3>

          <div className="card-body">

            <label htmlFor="mks-overwrite-file">
              <input
                onChange={() => {}}
                checked={true}
                name="mks-save-file"
                id="mks-overwrite-file"
                type="radio"/>
              &nbsp;
              Overwrite original file
            </label>

            <br/>

            <label htmlFor="mks-save-as">
              <input
                onChange={() => {}}
                name="mks-save-file"
                id="mks-save-as"
                disabled={this.state.saveAsFile.indexOf('+') >= 0}
                type="radio"/>
              &nbsp;
              Save to a new file...
            </label>

            <br/>

            <div className="input-group">
              <input
                id="saveAsFile"
                disabled={this.state.saveToSameFile || this.state.saveAsFile.indexOf('+') >= 0}
                type="text"
                className="form-control"
                placeholder="Username"
                aria-describedby="basic-addon1"/>
              <span className="input-group-addon" id="basic-addon1">
                { this.state.firmwareFile.endsWith(".zcz") ? ".zcz" : ".zip.aes" }
              </span>
            </div>

            <br/>

            <span className="pull-right">
              <button onClick={() => $("#saveAs").addClass("mks-invisible")}
                      type="button"
                      className="btn btn-danger mks-margin-right-5px">Cancel</button>
              <button onClick={() => {
                $("#saveAs").addClass("mks-invisible")
                $("button[type='submit']").click()
              }}
                      type="button"
                      className="btn btn-primary">Save</button>
            </span>
          </div>
      </div>
    )
  }
}
