import React from "react";
import {NavLink} from "react-router-dom";
import {API_BASE_URL} from "../../config";
import firmwareService from '../../services/firmware.service.client'
import Moment from 'moment'
import {connect} from "react-redux";
import firwareActions from "../../actions/firwareActions";

class Firmwares extends React.Component {
  downloadLinks = {}
  addFirmwareBtn = null
  addSchemaBtn = null
  addFolderBtn = null

  componentDidMount() {
    this.props.fetchFirmwares(this.props.match.params.fileName)
    Moment.locale('en');
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.match.params.fileName && prevProps.match.params.fileName !== this.props.match.params.fileName) {
      this.props.selectFirmware(this.props.match.params.fileName)
    }
  }

  addFirmware = () => this.addFirmwareBtn.click()
  addSchema   = () => this.addSchemaBtn.click()
  addFolder   = () => this.addFolderBtn.click()

  // TODO: move this to action/reducer
  packageFirmware = (firmwareName) => {
    this.props.showDownloading(firmwareName, true)
    firmwareService.packageFirmware(firmwareName)
      .then((response) => {
        setTimeout(() => {
          this.props.showDownloading(firmwareName, false)
          this.downloadLinks[firmwareName].click()
        }, 3000)
      })
      .catch(e => console.log(e))
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-8">
            <div className="list-group">
              <a className="list-group-item mks-active">
                Configuration Files
                <button onClick={this.addFirmware}
                        className="btn btn-primary btn-sm pull-right mks-position-relative-bottom-5px mks-margin-left-5px">
                  Add File
                </button>
                <button onClick={this.addFolder}
                        className="btn btn-primary btn-sm pull-right mks-position-relative-bottom-5px">
                  Add Folder
                </button>
              </a>
              {
                this.props.state.firmwares &&
                this.props.state.firmwares.map((firmware, index) =>
                <span key={index}>
                  <NavLink to={`/firmwares/${firmware.fileName}`}
                           className={`list-group-item 
                           ${firmware.uploading ? 'disabled' : ''}
                           ${this.props.state.selectedFirmware && firmware.fileName === this.props.state.selectedFirmware.fileName ?
                             'list-group-item-info' : ''}`}>
                    <div className="row">
                      <div className="col-xs-11 col-sm-10 col-lg-9">
                        {firmware.fileName.replace(/\+/g, '/')}
                      </div>
                      <div className="col-xs-2 visible-lg visible-xl">
                        {Moment(firmware.birthtime).format('MM/DD/YYYY HH:mm:SS')}
                      </div>
                      <div className="col-xs-1 col-sm-2 col-lg-1">
                        {
                          !firmware.uploading &&
                          <span>
                            <i onClick={(e) => {e.preventDefault(); this.props.deleteFirmware(firmware.fileName)}}
                               className="mks-cursor-pointer fa fa-trash pull-right mks-color-red"/>
                            {
                              firmware.fileName.indexOf('+') === -1 && false &&
                              <i onClick={() => this.packageFirmware(firmware.fileName)}
                                 className="mks-cursor-pointer fa fa-download pull-right mks-color-green"/>
                            }
                            {
                              this.props.state.downloading[firmware.fileName] &&
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
          <div className="hidden-xs col-xs-4">
            <ul className="list-group">
              <li className="list-group-item mks-active mks-padding-bottom-2px">
                <div className="row">
                  <div className="col-xs-12">
                    Configurations
                    <button onClick={this.addSchema}
                            className={`${this.props.state.selectedFirmware && this.props.state.selectedFirmware.allowSchemaUpload ? 'mks-invisible':''}
                               btn btn-primary btn-sm pull-right mks-position-relative-bottom-5px`}>
                      Add Schema
                    </button>
                  </div>
                </div>
              </li>
              {
                this.props.state.uploadingSchemaFileName !== "" &&
                <li className="list-group-item">
                  UPLOADING {this.props.state.uploadingSchemaFileName}
                  <i className="fa fa-spinner fa-spin pull-right fa-2x"/>
                </li>
              }
              {
                this.props.state.selectedFirmware &&
                typeof this.props.state.selectedFirmware.differences !== 'undefined' &&
                this.props.state.selectedFirmware.differences.map((difference, index) =>
                  (difference[0] !== "+" && <li className="list-group-item" key={index}>
                    {
                      difference[0] !== "+" &&
                      <span>
                        {difference[1]}
                        {this.props.state.selectedFirmware && difference[0] !== "-" && this.props.state.selectedFirmware.allowSchemaUpload &&
                        <i className="fa fa-check pull-right" onClick={this.addSchema}/>}
                      </span>
                    }
                  </li>)
                )
              }
              {
                this.props.state.selectedFirmware &&
                typeof this.props.state.selectedFirmware.differences === 'undefined' &&
                this.props.state.selectedFirmware.configurations &&
                this.props.state.selectedFirmware.configurations.map(configuration =>
                  <li className="list-group-item" key={configuration}>
                    {configuration}
                  </li>
                )
              }
            </ul>
          </div>
        </div>
        <input
          className="btn btn-primary pull-right mks-invisible"
          type="file"
          id="filepicker"
          name="fileList"
          webkitdirectory="true"
          ref={input => {
            this.addFolderBtn = input
          }}
          multiple
          encType="multipart/form-data"
          onChange={this.props.uploadConfigurationFolder}/>

        <input
          className="btn btn-primary pull-right mks-invisible"
          type="file"
          title="Add Firmware"
          multiple
          ref={input => {
            this.addFirmwareBtn = input
          }}
          accept=".aes,.zcz"
          encType="multipart/form-data"
          onChange={(e) => this.props.uploadFirmwareFile(e, this.props.match.params.fileName)}
        />
        <input
          className="btn btn-primary pull-right mks-invisible"
          type="file"
          title="Add Schema"
          multiple
          accept=".json"
          ref={input => {
            this.addSchemaBtn = input
          }}
          encType="multipart/form-data"
          onChange={(e) =>
            this.props.uploadSchemaFile(e,
              this.props.match.params.fileName,
              this.props.state.selectedFirmware.fileName)}
        />
      </div>
    )
  }
}

const stateToPropertyMapper = (state) => ({
  state: state.firmwareReducer
})

const propertyToDispatchMapper = (dispatch) => ({
  fetchFirmwares: (fileNameParameter) =>
    firwareActions.fetchFirmwares(dispatch, fileNameParameter),
  updateFirmware: (firmware) =>
    firwareActions.updateFirmware(dispatch, firmware),
  showDownloading: (firmwareName, downloading) =>
    firwareActions.showDownloading(dispatch, firmwareName, downloading),
  deleteFirmware: (firmwareName) =>
    firwareActions.deleteFirmware(dispatch, firmwareName),
  uploadConfigurationFolder: (event) =>
    firwareActions.uploadConfigurationFolder(dispatch, event),
  uploadFirmwareFile: (event, firmwareFileName) =>
    firwareActions.uploadFirmwareFile(dispatch, event, firmwareFileName),
  selectFirmware: (firmware) =>
    firwareActions.selectFirmware(dispatch, firmware),
  uploadSchemaFile: (e, firmwareFileName, selectedFirmwareFileName) =>
    firwareActions.uploadSchemaFile(dispatch, e, firmwareFileName, selectedFirmwareFileName),
})

export default connect
( stateToPropertyMapper,
  propertyToDispatchMapper )
(Firmwares)
